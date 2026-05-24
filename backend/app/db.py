# =====================================================
# app/db.py — PostgreSQL connection pooling
# =====================================================

import logging
import threading
from pathlib import Path

import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import ThreadedConnectionPool

from app.config import get_settings

logger = logging.getLogger(__name__)

_pool = None
_pool_lock = threading.Lock()

POOL_MIN_CONN = 5
POOL_MAX_CONN = 40


def _get_pool():
    global _pool

    if _pool is not None:
        return _pool

    with _pool_lock:
        if _pool is not None:
            return _pool

        settings = get_settings()

        try:
            _pool = ThreadedConnectionPool(
                POOL_MIN_CONN,
                POOL_MAX_CONN,
                host=settings.DB_HOST,
                database=settings.DB_NAME,
                user=settings.DB_USER,
                password=settings.DB_PASSWORD,
                port=settings.DB_PORT,
            )
            logger.info(
                "PostgreSQL connection pool initialized (min=%s, max=%s)",
                POOL_MIN_CONN,
                POOL_MAX_CONN,
            )
        except Exception as exc:
            logger.error("Failed to initialize connection pool: %s", exc)
            raise

    return _pool


class PooledConnection:
    """Wraps a pooled psycopg2 connection; close() returns it to the pool."""

    def __init__(self, conn, pool):
        self._conn = conn
        self._pool = pool
        self._returned = False

    def close(self):
        if self._returned:
            return

        self._returned = True

        try:
            if not self._conn.closed:
                self._conn.rollback()
        except Exception as exc:
            logger.warning("Rollback on connection release failed: %s", exc)

        try:
            self._pool.putconn(self._conn)
        except Exception as exc:
            logger.error("Failed to return connection to pool: %s", exc)

    def __getattr__(self, name):
        return getattr(self._conn, name)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            try:
                self._conn.rollback()
            except Exception as rollback_exc:
                logger.warning("Transaction rollback failed: %s", rollback_exc)

        self.close()
        return False


def get_connection():
    """Acquire a pooled database connection."""
    pool = _get_pool()

    try:
        conn = pool.getconn()
    except Exception as exc:
        logger.error("Connection pool exhausted or acquisition failed: %s", exc)
        raise

    if conn is None:
        logger.error("Connection pool returned None connection")
        raise psycopg2.OperationalError("Unable to acquire database connection")

    return PooledConnection(conn, pool)


def get_cursor(conn):
    return conn.cursor(cursor_factory=RealDictCursor)


def _ensure_columns(cursor, table_name, columns):
    cursor.execute(
        """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = %s
        """,
        (table_name,),
    )
    existing = {row[0] for row in cursor.fetchall()}

    for column_name, definition in columns.items():
        if column_name in existing:
            continue
        cursor.execute(
            f"ALTER TABLE {table_name} ADD COLUMN {column_name} {definition}"
        )
        logger.info("Added missing column %s.%s", table_name, column_name)


def check_and_init_db():
    """Safe startup DB check and additive schema bootstrap logic."""
    settings = get_settings()
    
    # 1. Log Gemini API configuration statuses
    chat_ok = bool(settings.GEMINI_CHAT_API_KEY or settings.GEMINI_API_KEY)
    itinerary_ok = bool(settings.GEMINI_ITINERARY_API_KEY or settings.GEMINI_API_KEY)
    logger.info("Gemini chat configured: %s", chat_ok)
    logger.info("Gemini itinerary configured: %s", itinerary_ok)
    
    # 2. Check and log DB pool status
    try:
        pool = _get_pool()
        logger.info("DB pool initialized: True (min=%s, max=%s)", POOL_MIN_CONN, POOL_MAX_CONN)
    except Exception as exc:
        logger.error("DB pool initialization failed at startup: %s", exc)
        return

    # 3. Check table/column existence and bootstrap safely.
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor()

        tables_to_check = [
            "users",
            "vendors",
            "packages",
            "vendor_packages",
            "trips",
            "bookings",
            "reviews",
            "saved_itineraries",
            "payments",
            "invoices",
            "booking_notes",
            "analytics_events",
            "activity_logs",
        ]
        missing_tables = []

        for table in tables_to_check:
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = %s
                );
            """, (table,))
            exists = cursor.fetchone()[0]
            if not exists:
                missing_tables.append(table)

        logger.info("Required database tables present: %s", not missing_tables)

        if missing_tables:
            schema_path = Path(__file__).resolve().parents[1] / "schema.sql"
            logger.info(
                "Bootstrapping missing tables from schema.sql: %s",
                ", ".join(missing_tables),
            )
            cursor.execute(schema_path.read_text(encoding="utf-8"))
        else:
            logger.info("All required tables are present in the database.")

        _ensure_columns(
            cursor,
            "packages",
            {
                "vendor_id": "INTEGER REFERENCES vendors(vendor_id) ON DELETE SET NULL",
                "slug": "VARCHAR(180)",
                "region": "VARCHAR(120)",
                "seasonal_price": "NUMERIC(12, 2)",
                "short_description": "TEXT",
                "full_description": "TEXT",
                "featured_image": "TEXT",
                "gallery": "JSONB DEFAULT '[]'::jsonb",
                "category": "VARCHAR(80)",
                "difficulty": "VARCHAR(50)",
                "group_size": "VARCHAR(50)",
                "best_season": "VARCHAR(120)",
                "altitude": "VARCHAR(120)",
                "trek_distance": "VARCHAR(80)",
                "pickup_points": "JSONB DEFAULT '[]'::jsonb",
                "fitness_required": "VARCHAR(120)",
                "travel_type": "VARCHAR(80)",
                "featured": "BOOLEAN DEFAULT FALSE",
                "availability_calendar": "JSONB DEFAULT '{}'::jsonb",
                "rating": "NUMERIC(3, 2) DEFAULT 0",
                "total_reviews": "INTEGER DEFAULT 0",
                "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
            },
        )
        _ensure_columns(
            cursor,
            "bookings",
            {
                "agent_id": "INTEGER REFERENCES agents(id) ON DELETE SET NULL",
                "package_title": "TEXT",
                "package_image": "TEXT",
                "travel_date": "DATE",
                "travelers": "INTEGER DEFAULT 1",
                "special_request": "TEXT",
                "internal_notes": "TEXT",
                "assigned_agent": "VARCHAR(120)",
                "adjusted_price": "NUMERIC(12, 2)",
                "departure_date": "DATE",
                "return_date": "DATE",
                "notes": "TEXT",
                "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
            },
        )
        conn.commit()
        logger.info("Safe database bootstrap checks complete.")

        cursor.close()
    except Exception as exc:
        if conn:
            conn.rollback()
        logger.error("Safe startup database check or bootstrap failed: %s", exc)
    finally:
        if conn:
            conn.close()

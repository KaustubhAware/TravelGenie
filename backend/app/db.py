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
            if settings.DATABASE_URL:
                _pool = ThreadedConnectionPool(
                    POOL_MIN_CONN,
                    POOL_MAX_CONN,
                    dsn=settings.DATABASE_URL,
                )
            else:
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


def _fetch_existing_columns(cursor, table_name):
    cursor.execute(
        """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = %s
        """,
        (table_name,),
    )
    return {row[0] for row in cursor.fetchall()}


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
            "payment_transactions",
            "package_images",
            "ai_chat_history",
            "notifications",
            "invoices",
            "booking_notes",
            "analytics_events",
            "activity_logs",
            "trip_batches",
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

        expected_columns = {
            "users": {
                "password_hash", "emergency_contact", "travel_preferences",
                "profile_image",
            },
            "packages": {
                "vendor_id", "slug", "region", "seasonal_price",
                "short_description", "full_description", "featured_image",
                "gallery", "category", "difficulty", "group_size",
                "best_season", "altitude", "trek_distance", "pickup_points",
                "fitness_required", "travel_type", "highlights",
                "weather_details", "faq", "nearby_attractions",
                "safety_notes", "transport_info", "map_url", "featured",
                "availability_calendar", "rating", "total_reviews", "updated_at",
            },
            "bookings": {
                "agent_id", "package_title", "package_image", "travel_date",
                "travelers", "trip_batch_id", "special_request", "internal_notes",
                "assigned_agent", "adjusted_price", "departure_date",
                "return_date", "notes", "total_amount", "persons",
                "booking_date", "updated_at",
            },
            "payment_transactions": {
                "currency", "failure_reason", "metadata",
            },
            "ai_chat_history": {
                "prompt", "response", "metadata",
            },
            "notifications": {
                "is_read",
            },
            "vendors": {
                "rating", "response_time", "verified_badge",
            },
            "trip_batches": {
                "id", "package_id", "start_date", "end_date",
                "booking_deadline", "max_seats", "booked_seats",
                "pickup_location", "guide_name", "batch_status", "created_at",
                "updated_at",
            },
        }
        for table, columns in expected_columns.items():
            existing = _fetch_existing_columns(cursor, table)
            missing = sorted(columns - existing)
            if missing:
                logger.warning(
                    "Database table %s is missing schema.sql columns: %s",
                    table,
                    ", ".join(missing),
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

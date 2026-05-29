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


def _heal_schema(cursor):
    """Apply safe additive production schema fixes for older databases."""
    statements = [
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE
        """,
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL
        """,
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS password_hash TEXT
        """,
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(60)
        """,
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS travel_preferences JSONB DEFAULT '[]'::jsonb
        """,
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS profile_image TEXT
        """,
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS is_vendor BOOLEAN DEFAULT FALSE
        """,
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS vendor_status VARCHAR(30) DEFAULT 'none'
        """,
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS approved_by INTEGER NULL
        """,
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP NULL
        """,
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS rejection_reason TEXT
        """,
        """
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        """,
        """
        UPDATE users
        SET is_vendor = (role = 'vendor')
        WHERE is_vendor IS NULL
        """,
        """
        UPDATE users
        SET vendor_status = CASE
            WHEN role = 'vendor' THEN 'approved'
            ELSE 'none'
        END
        WHERE vendor_status IS NULL
        """,
        """
        UPDATE users
        SET is_deleted = FALSE
        WHERE is_deleted IS NULL
        """,
        """
        ALTER TABLE notifications
        ADD COLUMN IF NOT EXISTS audience VARCHAR(50) DEFAULT 'customer'
        """,
        """
        ALTER TABLE notifications
        ADD COLUMN IF NOT EXISTS type VARCHAR(60) DEFAULT 'general'
        """,
        """
        ALTER TABLE notifications
        ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb
        """,
        """
        ALTER TABLE notifications
        ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE
        """,
        """
        ALTER TABLE notifications
        ADD COLUMN IF NOT EXISTS read_at TIMESTAMP NULL
        """,
        """
        UPDATE notifications
        SET audience = 'customer'
        WHERE audience IS NULL
        """,
        """
        UPDATE notifications
        SET type = 'general'
        WHERE type IS NULL
        """,
        """
        UPDATE notifications
        SET metadata = '{}'::jsonb
        WHERE metadata IS NULL
        """,
        """
        UPDATE notifications
        SET is_read = COALESCE(is_read, read_at IS NOT NULL, FALSE)
        WHERE is_read IS NULL
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'active'
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS featured_image TEXT
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS pickup_points JSONB DEFAULT '[]'::jsonb
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS weather_details JSONB DEFAULT '{}'::jsonb
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS nearby_attractions JSONB DEFAULT '[]'::jsonb
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS safety_notes JSONB DEFAULT '[]'::jsonb
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS transport_info JSONB DEFAULT '{}'::jsonb
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 0
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0
        """,
        """
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        """,
        """
        ALTER TABLE payment_transactions
        ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR'
        """,
        """
        ALTER TABLE payment_transactions
        ADD COLUMN IF NOT EXISTS failure_reason TEXT
        """,
        """
        ALTER TABLE payment_transactions
        ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb
        """,
        """
        ALTER TABLE ai_chat_history
        ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb
        """,
        """
        ALTER TABLE reviews
        ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE
        """,
        """
        ALTER TABLE reviews
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        """,
        """
        ALTER TABLE vendors
        ADD COLUMN IF NOT EXISTS gst_number VARCHAR(80)
        """,
        """
        ALTER TABLE vendors
        ADD COLUMN IF NOT EXISTS business_address TEXT
        """,
        """
        ALTER TABLE vendors
        ADD COLUMN IF NOT EXISTS website_url TEXT
        """,
        """
        ALTER TABLE vendors
        ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb
        """,
        """
        ALTER TABLE vendors
        ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0
        """,
        """
        ALTER TABLE vendors
        ADD COLUMN IF NOT EXISTS categories JSONB DEFAULT '[]'::jsonb
        """,
        """
        ALTER TABLE vendors
        ADD COLUMN IF NOT EXISTS government_id_path TEXT
        """,
        """
        ALTER TABLE vendors
        ADD COLUMN IF NOT EXISTS rejection_reason TEXT
        """,
        """
        ALTER TABLE vendors
        ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 0
        """,
        """
        ALTER TABLE vendors
        ADD COLUMN IF NOT EXISTS response_time VARCHAR(80)
        """,
        """
        ALTER TABLE vendors
        ADD COLUMN IF NOT EXISTS verified_badge BOOLEAN DEFAULT FALSE
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_users_active_deleted
        ON users (is_deleted, deleted_at)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_users_vendor_status
        ON users (is_vendor, vendor_status)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_notifications_user_created
        ON notifications (user_id, created_at DESC)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_notifications_user_read
        ON notifications (user_id, is_read)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_packages_status_featured
        ON packages (status, featured)
        """,
        """
        CREATE INDEX IF NOT EXISTS idx_reviews_package_active
        ON reviews (package_id, is_deleted)
        """,
    ]

    for statement in statements:
        cursor.execute(statement)


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
            "admins",
            "vendors",
            "packages",
            "vendor_packages",
            "trips",
            "bookings",
            "reviews",
            "payment_transactions",
            "package_images",
            "ai_chat_history",
            "saved_itineraries",
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

        _heal_schema(cursor)

        expected_columns = {
            "users": {
                "password_hash", "emergency_contact", "travel_preferences",
                "profile_image", "is_deleted", "deleted_at",
                "updated_at", "is_vendor", "vendor_status", "approved_by",
                "approved_at", "rejection_reason",
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
                "is_read", "audience", "type", "metadata",
            },
            "vendors": {
                "rating", "response_time", "verified_badge", "gst_number",
                "business_address", "website_url", "social_links",
                "years_experience", "categories", "government_id_path",
                "rejection_reason",
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

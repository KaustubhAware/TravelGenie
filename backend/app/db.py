# =====================================================
# app/db.py
# =====================================================

import psycopg2

from psycopg2.extras import RealDictCursor
from app.config import get_settings

# =====================================================
# DATABASE CONNECTION
# =====================================================

def get_connection():

    settings = get_settings()

    return psycopg2.connect(

        host=settings.DB_HOST,

        database=settings.DB_NAME,

        user=settings.DB_USER,

        password=settings.DB_PASSWORD,

        port=settings.DB_PORT
    )

# =====================================================
# REAL DICT CURSOR
# =====================================================

def get_cursor(conn):

    return conn.cursor(
        cursor_factory=RealDictCursor
    )

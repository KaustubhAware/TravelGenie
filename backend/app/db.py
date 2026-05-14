# =====================================================
# app/db.py
# =====================================================

import psycopg2

from psycopg2.extras import RealDictCursor

# =====================================================
# DATABASE CONNECTION
# =====================================================

def get_connection():

    return psycopg2.connect(

        host="localhost",

        database="travelgenie",

        user="postgres",

        password="root",

        port="5432"
    )

# =====================================================
# REAL DICT CURSOR
# =====================================================

def get_cursor(conn):

    return conn.cursor(
        cursor_factory=RealDictCursor
    )
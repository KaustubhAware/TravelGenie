"""Check if packages.vendor_id column exists in the live DB."""
from app.config import get_settings
import psycopg2

s = get_settings()
conn = psycopg2.connect(host=s.DB_HOST, database=s.DB_NAME, user=s.DB_USER, password=s.DB_PASSWORD, port=s.DB_PORT)
cur = conn.cursor()
cur.execute("""
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'packages'
    ORDER BY ordinal_position;
""")
cols = [r[0] for r in cur.fetchall()]
print("packages columns:", cols)
print()
print("vendor_id present:", "vendor_id" in cols)
cur.close()
conn.close()

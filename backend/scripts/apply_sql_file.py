import sys
from pathlib import Path

import psycopg2

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.config import get_settings


def main():
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/apply_sql_file.py <sql-file>")

    sql_path = Path(sys.argv[1]).resolve()
    if not sql_path.exists():
        raise SystemExit(f"SQL file not found: {sql_path}")

    settings = get_settings()
    conn = psycopg2.connect(
        host=settings.DB_HOST,
        database=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        port=settings.DB_PORT,
    )
    try:
        with conn:
            with conn.cursor() as cursor:
                cursor.execute(sql_path.read_text(encoding="utf-8"))
        print(f"Applied SQL file: {sql_path}")
    finally:
        conn.close()


if __name__ == "__main__":
    main()

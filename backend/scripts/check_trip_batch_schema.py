import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db import get_connection


def main():
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                  AND table_name = 'trip_batches'
            )
            """
        )
        print(f"trip_batches_exists={cursor.fetchone()[0]}")
        cursor.execute(
            """
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                  AND table_name = 'bookings'
                  AND column_name = 'trip_batch_id'
            )
            """
        )
        print(f"booking_trip_batch_id={cursor.fetchone()[0]}")
        cursor.close()
    finally:
        conn.close()


if __name__ == "__main__":
    main()

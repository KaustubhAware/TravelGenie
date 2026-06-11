"""Targeted pre-viva database polish without schema changes."""
import sys
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.append(str(BACKEND_DIR))

import psycopg2
from psycopg2.extras import RealDictCursor

from app.config import get_settings

settings = get_settings()
DEFAULT_IMAGE = "/uploads/packages/sahyadri.jpg"
DEFAULT_SHORT = (
    "Guided Maharashtra experience with verified operators, "
    "clear inclusions, and local route support."
)


def connect():
    if settings.DATABASE_URL:
        return psycopg2.connect(settings.DATABASE_URL)
    return psycopg2.connect(
        host=settings.DB_HOST,
        database=settings.DB_NAME,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        port=settings.DB_PORT,
    )


def polish_packages(cur):
    cur.execute(
        """
        SELECT id, title, location, short_description, featured_image, image
        FROM packages
        WHERE LENGTH(COALESCE(short_description, '')) < 10
           OR COALESCE(NULLIF(featured_image, ''), NULLIF(image, ''), '') = ''
        """
    )
    rows = cur.fetchall()
    for row in rows:
        short = row["short_description"] or ""
        if len(short.strip()) < 10:
            location = row["location"] or "Maharashtra"
            short = (
                f"Explore {row['title']} in {location} with guided support, "
                "verified operators, and practical travel planning."
            )
        image = row["featured_image"] or row["image"] or DEFAULT_IMAGE
        cur.execute(
            """
            UPDATE packages
            SET short_description = %s,
                featured_image = COALESCE(NULLIF(featured_image, ''), %s),
                image = COALESCE(NULLIF(image, ''), %s),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            """,
            (short[:300], image, image, row["id"]),
        )
    return len(rows)


def remove_qa_smoke_users(cur):
    cur.execute(
        """
        SELECT id, email
        FROM users
        WHERE email ILIKE '%qa.%'
           OR email ILIKE '%smoke.%'
           OR email LIKE '%@presentation.travelgenie.in'
        """
    )
    users = cur.fetchall()
    if not users:
        return 0

    user_ids = [row["id"] for row in users]
    cur.execute("DELETE FROM notifications WHERE user_id = ANY(%s)", (user_ids,))
    cur.execute("DELETE FROM ai_chat_history WHERE user_id = ANY(%s)", (user_ids,))
    cur.execute("DELETE FROM saved_itineraries WHERE user_id = ANY(%s)", (user_ids,))
    cur.execute("DELETE FROM trips WHERE user_id = ANY(%s)", (user_ids,))
    cur.execute("DELETE FROM reviews WHERE user_id = ANY(%s)", (user_ids,))
    cur.execute("DELETE FROM bookings WHERE user_id = ANY(%s)", (user_ids,))
    cur.execute("DELETE FROM vendors WHERE user_id = ANY(%s)", (user_ids,))
    cur.execute("DELETE FROM users WHERE id = ANY(%s)", (user_ids,))
    return len(users)


def remove_orphan_packages(cur):
    cur.execute(
        """
        DELETE FROM packages p
        WHERE p.vendor_id IS NULL
          AND NOT EXISTS (
              SELECT 1 FROM bookings b WHERE b.package_id = p.id
          )
          AND NOT EXISTS (
              SELECT 1 FROM reviews r WHERE r.package_id = p.id
          )
        RETURNING id
        """
    )
    return len(cur.fetchall())


def remove_qa_packages(cur):
    cur.execute(
        """
        DELETE FROM packages
        WHERE title ILIKE '%qa %'
           OR title ILIKE '%demo %'
           OR title ILIKE '%smoke %'
           OR title ILIKE '%test package%'
        RETURNING id
        """
    )
    return len(cur.fetchall())


def main():
    conn = connect()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        polished = polish_packages(cur)
        removed_users = remove_qa_smoke_users(cur)
        removed_packages = remove_qa_packages(cur)
        removed_orphans = remove_orphan_packages(cur)
        conn.commit()
        print(
            {
                "packages_polished": polished,
                "qa_users_removed": removed_users,
                "qa_packages_removed": removed_packages,
                "orphan_packages_removed": removed_orphans,
            }
        )
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()

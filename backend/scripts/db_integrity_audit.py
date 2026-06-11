"""Read-only database integrity audit for TravelGenie pre-deployment QA."""
import json
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

DEMO_PATTERNS = (
    "%demo%",
    "%presentation%",
    "%qa.%",
    "%smoke%",
    "%sample%",
    "%dummy%",
    "%test package%",
    "%lorem%",
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


def main():
    conn = connect()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    issues = []

    checks = [
        (
            "packages_without_vendor",
            """
            SELECT COUNT(*) AS total
            FROM packages
            WHERE vendor_id IS NULL
            """,
        ),
        (
            "bookings_missing_user",
            """
            SELECT COUNT(*) AS total
            FROM bookings b
            LEFT JOIN users u ON u.id = b.user_id
            WHERE b.user_id IS NOT NULL AND u.id IS NULL
            """,
        ),
        (
            "bookings_missing_package",
            """
            SELECT COUNT(*) AS total
            FROM bookings b
            LEFT JOIN packages p ON p.id = b.package_id
            WHERE b.package_id IS NOT NULL AND p.id IS NULL
            """,
        ),
        (
            "reviews_missing_user",
            """
            SELECT COUNT(*) AS total
            FROM reviews r
            LEFT JOIN users u ON u.id = r.user_id
            WHERE r.user_id IS NOT NULL AND u.id IS NULL
            """,
        ),
        (
            "reviews_missing_package",
            """
            SELECT COUNT(*) AS total
            FROM reviews r
            LEFT JOIN packages p ON p.id = r.package_id
            WHERE r.package_id IS NOT NULL AND p.id IS NULL
            """,
        ),
        (
            "saved_trips_missing_user",
            """
            SELECT COUNT(*) AS total
            FROM trips t
            LEFT JOIN users u ON u.id = t.user_id
            WHERE t.user_id IS NOT NULL AND u.id IS NULL
            """,
        ),
        (
            "packages_short_description",
            """
            SELECT COUNT(*) AS total
            FROM packages
            WHERE COALESCE(short_description, '') = ''
               OR LENGTH(COALESCE(short_description, '')) < 10
            """,
        ),
        (
            "packages_missing_image",
            """
            SELECT COUNT(*) AS total
            FROM packages
            WHERE COALESCE(NULLIF(featured_image, ''), NULLIF(image, ''), '') = ''
            """,
        ),
    ]

    summary = {}
    for name, query in checks:
        cur.execute(query)
        total = int(cur.fetchone()["total"])
        summary[name] = total
        if total > 0:
            issues.append(f"{name}: {total}")

    demo_hits = {}
    for table, column in [
        ("users", "email"),
        ("users", "full_name"),
        ("vendors", "business_name"),
        ("packages", "title"),
        ("bookings", "package_title"),
    ]:
        cur.execute(
            f"""
            SELECT COUNT(*) AS total
            FROM {table}
            WHERE LOWER(COALESCE({column}, '')) LIKE ANY(%s)
            """,
            (list(DEMO_PATTERNS),),
        )
        count = int(cur.fetchone()["total"])
        if count:
            demo_hits[f"{table}.{column}"] = count
            issues.append(f"demo_data:{table}.{column}: {count}")

    cur.execute("SELECT COUNT(*) AS total FROM packages")
    summary["packages_total"] = int(cur.fetchone()["total"])
    cur.execute("SELECT COUNT(*) AS total FROM bookings")
    summary["bookings_total"] = int(cur.fetchone()["total"])
    cur.execute("SELECT COUNT(*) AS total FROM users WHERE role = 'customer'")
    summary["customers_total"] = int(cur.fetchone()["total"])
    cur.execute("SELECT COUNT(*) AS total FROM vendors")
    summary["vendors_total"] = int(cur.fetchone()["total"])

    print(json.dumps({"summary": summary, "demo_hits": demo_hits, "issues": issues}, indent=2))
    conn.close()
    return 1 if issues else 0


if __name__ == "__main__":
    raise SystemExit(main())

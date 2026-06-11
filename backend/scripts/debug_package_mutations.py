"""Debug PUT/DELETE package mutations for admin."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def admin_headers():
    res = client.post(
        "/api/admin/login",
        json={"username": "admin@travelgenie.com", "password": "Pass@123"},
    )
    if res.status_code != 200:
        res = client.post(
            "/api/admin/login",
            json={"username": "admin@travelgenie.com", "password": "Admin123"},
        )
    token = res.json().get("access_token") or res.json().get("data", {}).get("access_token")
    return {"Authorization": f"Bearer {token}"}


def get_package(package_id, headers):
    res = client.get("/api/admin/packages", headers=headers)
    packages = res.json().get("packages") or []
    return next((p for p in packages if p["id"] == package_id), None)


def build_payload(pkg):
    included = pkg.get("included") or []
    excluded = pkg.get("excluded") or []
    if isinstance(included, str):
        included = [x.strip() for x in included.split("\n") if x.strip()]
    if isinstance(excluded, str):
        excluded = [x.strip() for x in excluded.split("\n") if x.strip()]
    return {
        "title": pkg.get("title") or "Test Package",
        "location": pkg.get("location") or "Pune, Maharashtra",
        "region": pkg.get("region") or "",
        "category": pkg.get("category") or "",
        "duration": pkg.get("duration") or "1 Day",
        "difficulty": pkg.get("difficulty") or "Moderate",
        "trek_distance": pkg.get("trek_distance") or "",
        "altitude": pkg.get("altitude") or "",
        "best_season": pkg.get("best_season") or "",
        "group_size": int(pkg.get("group_size") or 0),
        "fitness_required": pkg.get("fitness_required") or "",
        "travel_type": pkg.get("travel_type") or "",
        "price": float(pkg.get("price") or 0),
        "seasonal_price": float(pkg.get("seasonal_price") or 0),
        "featured_image": pkg.get("featured_image") or pkg.get("image") or "",
        "short_description": pkg.get("short_description")
        or "Guided Maharashtra trek with verified local operators and clear inclusions.",
        "full_description": pkg.get("full_description") or pkg.get("description") or "",
        "included": included,
        "excluded": excluded,
        "pickup_points": pkg.get("pickup_points") or [],
        "gallery": pkg.get("gallery") or [],
        "itinerary": pkg.get("itinerary") or [],
        "rating": float(pkg.get("rating") or 0),
        "featured": bool(pkg.get("featured")),
    }


def test_package(package_id, headers):
    pkg = get_package(package_id, headers)
    print(f"\n=== PACKAGE {package_id} ===")
    if not pkg:
        print("NOT FOUND in admin list")
        return
    print("title:", pkg.get("title"))
    print("short_description len:", len(pkg.get("short_description") or ""))
    print("group_size:", repr(pkg.get("group_size")))

    payload = build_payload(pkg)
    put = client.put(f"/api/packages/{package_id}", headers=headers, json=payload)
    print("PUT", put.status_code, put.text[:500])

    delete = client.delete(f"/api/packages/{package_id}", headers=headers)
    print("DELETE", delete.status_code, delete.text[:500])


def list_deletable(headers):
    res = client.get("/api/admin/packages", headers=headers)
    packages = res.json().get("packages") or []
    import psycopg2
    from psycopg2.extras import RealDictCursor
    from app.config import get_settings
    from app.db import get_connection

    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute(
        """
        SELECT p.id, p.title,
          (SELECT COUNT(*) FROM bookings b
             WHERE b.package_id = p.id
               AND COALESCE(b.status, '') NOT IN ('cancelled', 'completed')) AS active_bookings,
          (SELECT COUNT(*) FROM trip_batches tb
             WHERE tb.package_id = p.id
               AND tb.end_date >= CURRENT_DATE) AS active_batches
        FROM packages p
        ORDER BY 3, 4, p.id
        LIMIT 10
        """
    )
    print("\n=== LOWEST BLOCKERS ===")
    for row in cur.fetchall():
        print(row)
    conn.close()
    return packages


def main():
    headers = admin_headers()
    list_deletable(headers)
    for pid in (31, 12):
        test_package(pid, headers)

    # Find first deletable package and test DELETE success
    import psycopg2
    from psycopg2.extras import RealDictCursor
    from app.db import get_connection

    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute(
        """
        SELECT p.id FROM packages p
        WHERE NOT EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.package_id = p.id
              AND COALESCE(b.status, '') NOT IN ('cancelled', 'completed')
        )
        AND NOT EXISTS (
            SELECT 1 FROM trip_batches tb
            WHERE tb.package_id = p.id
              AND tb.end_date >= CURRENT_DATE
        )
        ORDER BY p.id DESC
        LIMIT 1
        """
    )
    row = cur.fetchone()
    conn.close()
    if row:
        pid = row["id"]
        print(f"\n=== DELETABLE PACKAGE {pid} ===")
        pkg = get_package(pid, headers)
        payload = build_payload(pkg)
        put = client.put(f"/api/packages/{pid}", headers=headers, json=payload)
        print("PUT", put.status_code, put.text[:200])
        delete = client.delete(f"/api/packages/{pid}", headers=headers)
        print("DELETE", delete.status_code, delete.text[:200])


if __name__ == "__main__":
    main()

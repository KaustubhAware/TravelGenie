import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from fastapi.testclient import TestClient  # noqa: E402

from app.config import get_settings  # noqa: E402
from app.main import app  # noqa: E402
import app.routes.chat as chat_routes  # noqa: E402
import app.routes.trips as trips_routes  # noqa: E402


PNG_1X1 = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01"
    b"\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89"
    b"\x00\x00\x00\nIDATx\x9cc\xf8\x0f\x00\x01\x01\x01\x00"
    b"\x18\xdd\x8d\xb0\x00\x00\x00\x00IEND\xaeB`\x82"
)


def ok(response, label, statuses=(200,)):
    if response.status_code not in statuses:
        raise AssertionError(f"{label}: {response.status_code} {response.text}")
    print(f"PASS {label}: {response.status_code}")
    return response.json()


def token(payload):
    return payload.get("access_token") or payload.get("data", {}).get("access_token")


def data(payload):
    return payload.get("data", payload)


def fake_itinerary(_payload):
    return json.dumps(
        {
            "trip_summary": {
                "destination": "Pune",
                "duration": "2 days",
                "budget": 5000,
            },
            "itinerary": [
                {
                    "day": 1,
                    "title": "Arrival and local exploration",
                    "activities": ["Explore Pune", "Try local food"],
                }
            ],
            "recommended_places": ["Sinhagad Fort"],
            "estimated_cost": 4500,
            "sentiment": "positive",
            "budget_breakdown": {
                "hotel": 1800,
                "food": 900,
                "transport": 1000,
                "activities": 500,
                "emergency": 300,
            },
            "hotel_recommendations": [
                {"name": "Pune Comfort Stay", "price": 1800}
            ],
            "restaurant_recommendations": ["Local Maharashtrian thali"],
            "travel_tips": ["Carry ID proof"],
            "weather": {"summary": "Pleasant"},
            "packing_list": ["Water bottle"],
            "safety_notes": ["Check trail conditions"],
        }
    )


def ensure_package(client, admin_headers):
    packages = ok(client.get("/api/packages"), "packages list")
    package_list = data(packages).get("packages") or packages.get("packages") or []
    if package_list:
        return package_list[0]["id"]

    payload = {
        "title": f"Smoke Trek {int(time.time())}",
        "location": "Pune",
        "region": "Western Ghats",
        "category": "Trek",
        "difficulty": "Easy",
        "duration": "1D",
        "price": 1200,
        "featured_image": "/uploads/packages/smoke.jpg",
        "short_description": "Smoke test package for QA validation.",
        "full_description": "Smoke test package for QA validation.",
        "included": ["Guide"],
        "excluded": ["Personal expenses"],
        "pickup_points": ["Pune"],
        "highlights": ["Fort views"],
        "weather_details": {"season": "All year"},
        "faq": [],
        "nearby_attractions": ["Sinhagad"],
        "safety_notes": ["Carry water"],
        "transport_info": {"mode": "Bus"},
        "itinerary": [{"day": 1, "title": "Trek"}],
        "status": "active",
    }
    created = ok(
        client.post("/api/packages", json=payload, headers=admin_headers),
        "admin package create",
    )
    return data(created).get("id") or data(created).get("package_id")


def main():
    settings = get_settings()
    client = TestClient(app)
    stamp = int(time.time())

    trips_routes.generate_ai_itinerary = fake_itinerary
    chat_routes.generate_chat_reply = (
        lambda message, history, packages: "AI smoke chat response"
    )

    admin_login = ok(
        client.post(
            "/api/admin/login",
            json={
                "username": settings.ADMIN_USERNAME,
                "password": settings.ADMIN_PASSWORD,
            },
        ),
        "admin auth",
    )
    admin_headers = {"Authorization": f"Bearer {token(admin_login)}"}

    for path, label in [
        ("/api/admin/stats", "admin dashboard stats"),
        ("/api/admin/analytics", "admin analytics"),
        ("/api/admin/clients", "admin clients"),
        ("/api/admin/vendors", "admin vendors"),
        ("/api/admin/packages", "admin packages"),
        ("/api/admin/reviews", "admin reviews"),
        ("/api/admin/bookings", "admin bookings"),
    ]:
        ok(client.get(path, headers=admin_headers), label)

    package_id = ensure_package(client, admin_headers)
    ok(client.get(f"/api/packages/{package_id}"), "package detail")
    ok(client.get("/api/reviews", params={"package_id": package_id}), "reviews list")

    email = f"smoke.customer.{stamp}@travelgenie.in"
    password = "Smoke123"
    register = ok(
        client.post(
            "/api/auth/register",
            json={"email": email, "password": password, "full_name": "Smoke Customer"},
        ),
        "customer register",
    )
    customer_headers = {"Authorization": f"Bearer {token(register)}"}

    ok(client.get("/api/auth/me", headers=customer_headers), "customer jwt")
    ok(client.get("/api/notifications", headers=customer_headers), "notifications list")

    booking = ok(
        client.post(
            "/api/save-booking",
            headers=customer_headers,
            json={
                "firstName": "Smoke",
                "lastName": "Customer",
                "email": email,
                "phone": "9000000000",
                "destination": "Pune",
                "budget": 1200,
                "days": 1,
                "package_id": package_id,
                "travelers": 1,
            },
        ),
        "booking create",
    )
    booking_id = booking["booking_id"]
    ok(client.get("/api/my-bookings", headers=customer_headers), "customer bookings")

    notification_payload = ok(
        client.get("/api/notifications", headers=customer_headers),
        "notifications after booking",
    )
    notifications = data(notification_payload).get("notifications", [])
    unread_count = data(notification_payload).get("unread_count", 0)
    if unread_count < 1:
        raise AssertionError("notifications unread_count did not increment")
    if notifications:
        ok(
            client.post(
                f"/api/notifications/{notifications[0]['id']}/read",
                headers=customer_headers,
            ),
            "notification mark read",
        )
    ok(
        client.post("/api/notifications/read-all", headers=customer_headers),
        "notifications mark all read",
    )

    ok(
        client.post(
            "/api/reviews",
            headers=customer_headers,
            json={
                "package_id": package_id,
                "rating": 5,
                "review_text": "Smoke review content",
            },
        ),
        "review create",
    )
    ok(client.get("/api/admin/reviews", headers=admin_headers), "admin reviews after create")

    ok(
        client.post(
            "/api/save-itinerary",
            headers=customer_headers,
            json={
                "destination": "Pune",
                "budget": 5000,
                "days": 2,
                "preferences": ["forts"],
                "itinerary": [{"day": 1, "title": "Pune"}],
            },
        ),
        "AI itinerary save",
    )
    ok(client.get("/api/my-itineraries", headers=customer_headers), "saved AI trips")

    ok(
        client.post(
            "/api/generate-trip",
            json={"destination": "Pune", "budget": 5000, "preferences": ["forts"]},
        ),
        "AI planner generate",
    )
    ok(
        client.post(
            "/api/chat",
            headers=customer_headers,
            json={"message": "Suggest a weekend trek", "history": []},
        ),
        "AI chat",
    )

    payment = client.post(
        "/api/create-order",
        headers=customer_headers,
        json={"booking_id": booking_id},
    )
    ok(payment, "payment create order", statuses=(200, 503))

    vendor_email = f"smoke.vendor.{stamp}@travelgenie.in"
    apply_vendor = ok(
        client.post(
            "/api/vendors/apply",
            data={
                "business_name": f"Smoke Vendor {stamp}",
                "owner_name": "Smoke Vendor",
                "email": vendor_email,
                "password": "Vendor123",
                "phone": "9000000001",
                "categories": '["trekking"]',
                "description": "Smoke vendor",
            },
            files={
                "government_id": ("id.png", PNG_1X1, "image/png"),
                "business_logo": ("logo.png", PNG_1X1, "image/png"),
            },
        ),
        "vendor register",
    )
    vendor_id = data(apply_vendor)["vendor_id"]
    ok(
        client.post(
            f"/api/admin/vendors/{vendor_id}/verify",
            headers=admin_headers,
            json={
                "verification_status": "approved",
                "is_active": True,
                "rejection_reason": "",
            },
        ),
        "vendor approval",
    )
    vendor_login = ok(
        client.post(
            "/api/auth/login",
            json={"email": vendor_email, "password": "Vendor123"},
        ),
        "vendor login",
    )
    vendor_headers = {"Authorization": f"Bearer {token(vendor_login)}"}
    for path, label in [
        ("/api/vendors/me", "vendor dashboard profile"),
        ("/api/vendors/analytics", "vendor analytics"),
        ("/api/vendors/bookings", "vendor bookings"),
        ("/api/vendors/packages", "vendor packages"),
    ]:
        ok(client.get(path, headers=vendor_headers), label)

    upload = ok(
        client.post(
            "/api/uploads/package-image",
            headers=vendor_headers,
            files={"file": ("package.png", PNG_1X1, "image/png")},
        ),
        "vendor upload",
    )
    image_path = data(upload)["path"]
    ok(
        client.post(
            "/api/vendors/packages",
            headers=vendor_headers,
            json={
                "title": f"Vendor Smoke Package {stamp}",
                "destination": "Pune",
                "location": "Pune",
                "pricing": 1500,
                "itinerary": "Smoke itinerary",
                "package_images": [image_path],
                "availability": {},
            },
        ),
        "vendor package management",
    )

    svg_upload = client.post(
        "/api/uploads/package-image",
        headers=vendor_headers,
        files={"file": ("bad.svg", b"<svg></svg>", "image/svg+xml")},
    )
    ok(svg_upload, "svg upload blocked", statuses=(400,))


if __name__ == "__main__":
    main()

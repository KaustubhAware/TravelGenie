import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from fastapi.testclient import TestClient  # noqa: E402

from app.config import get_settings  # noqa: E402
from app.main import app  # noqa: E402


PNG_1X1 = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01"
    b"\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89"
    b"\x00\x00\x00\nIDATx\x9cc\xf8\x0f\x00\x01\x01\x01\x00"
    b"\x18\xdd\x8d\xb0\x00\x00\x00\x00IEND\xaeB`\x82"
)


def _assert_ok(response, label):
    if response.status_code >= 400:
        raise AssertionError(
            f"{label} failed: {response.status_code} {response.text}"
        )
    print(f"PASS {label}: {response.status_code}")
    return response.json()


def _token(payload):
    return payload.get("access_token") or payload.get("data", {}).get("access_token")


def main():
    settings = get_settings()
    client = TestClient(app)

    stamp = int(time.time())
    vendor_email = f"qa.vendor.{stamp}@travelgenie.in"
    vendor_password = "Vendor123"

    apply_response = client.post(
        "/api/vendors/apply",
        data={
            "business_name": f"QA Trek Co {stamp}",
            "owner_name": "QA Vendor",
            "email": vendor_email,
            "password": vendor_password,
            "phone": "9000000000",
            "gst_number": "QA-GST",
            "business_address": "Pune",
            "website_url": "",
            "social_links": "[]",
            "years_experience": "3",
            "categories": '["trekking"]',
            "description": "QA vendor lifecycle test",
        },
        files={
            "government_id": ("id.png", PNG_1X1, "image/png"),
            "business_logo": ("logo.png", PNG_1X1, "image/png"),
        },
    )
    apply_payload = _assert_ok(apply_response, "vendor application")
    vendor_id = apply_payload["data"]["vendor_id"]

    admin_login = client.post(
        "/api/admin/login",
        json={
            "username": settings.ADMIN_USERNAME,
            "password": settings.ADMIN_PASSWORD,
        },
    )
    admin_payload = _assert_ok(admin_login, "admin login")
    admin_token = _token(admin_payload)

    approve = client.post(
        f"/api/admin/vendors/{vendor_id}/verify",
        json={
            "verification_status": "approved",
            "is_active": True,
            "rejection_reason": "",
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    _assert_ok(approve, "admin vendor approval")

    vendor_login = client.post(
        "/api/auth/login",
        json={"email": vendor_email, "password": vendor_password},
    )
    vendor_payload = _assert_ok(vendor_login, "approved vendor login")
    vendor_token = _token(vendor_payload)
    vendor_headers = {"Authorization": f"Bearer {vendor_token}"}

    me = _assert_ok(
        client.get("/api/auth/me", headers=vendor_headers),
        "vendor JWT /auth/me",
    )
    user = me["data"]["user"]
    assert user["role"] == "vendor", user
    assert user["vendor_status"] == "approved", user

    _assert_ok(
        client.get("/api/vendors/me", headers=vendor_headers),
        "vendor profile dashboard load",
    )

    upload = client.post(
        "/api/uploads/package-image",
        headers=vendor_headers,
        files={"file": ("package.png", PNG_1X1, "image/png")},
    )
    upload_payload = _assert_ok(upload, "vendor package image upload")
    image_path = upload_payload["data"]["path"]

    package = client.post(
        "/api/vendors/packages",
        headers=vendor_headers,
        json={
            "title": f"QA Sahyadri Trek {stamp}",
            "destination": "Pune",
            "location": "Pune",
            "pricing": 1200,
            "itinerary": "Day 1: QA trek",
            "package_images": [image_path],
            "availability": {"weekends": True},
            "category": "Trek",
            "duration": "1D",
            "difficulty": "Easy",
            "description": "QA package creation",
        },
    )
    _assert_ok(package, "vendor package creation")

    _assert_ok(
        client.get("/api/vendors/packages", headers=vendor_headers),
        "vendor packages load",
    )
    _assert_ok(
        client.get("/api/vendors/analytics", headers=vendor_headers),
        "vendor analytics load",
    )
    _assert_ok(
        client.get("/api/vendors/bookings", headers=vendor_headers),
        "vendor bookings load",
    )

    print("PASS vendor logout: frontend clears token locally; no backend logout endpoint required")
    print(f"QA vendor email: {vendor_email}")


if __name__ == "__main__":
    main()

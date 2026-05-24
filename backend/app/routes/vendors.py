import logging
import json
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, field_validator, model_validator

from app.db import get_connection, get_cursor
from app.firebase_auth import verify_firebase_token
from app.routes.auth import get_current_user
from app.responses import success_response

logger = logging.getLogger(__name__)

router = APIRouter()


class VendorRegister(BaseModel):
    business_name: str = Field(..., min_length=2, max_length=200)
    owner_name: str = Field(..., min_length=2, max_length=160)
    contact_email: str = Field(..., max_length=180)
    phone: Optional[str] = None
    description: Optional[str] = None
    logo: Optional[str] = None


class VendorPackageCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    destination: Optional[str] = Field(default=None, min_length=2, max_length=120)
    location: Optional[str] = Field(default=None, min_length=2, max_length=120)
    pricing: float = Field(..., ge=0)
    itinerary: Optional[str] = None
    package_images: Optional[List[str]] = []
    availability: Optional[dict] = {}
    category: Optional[str] = None
    duration: Optional[str] = None
    difficulty: Optional[str] = None
    description: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_payload(cls, values: Any):
        if not isinstance(values, dict):
            return values

        normalized = dict(values)
        if "pricing" not in normalized and "price" in normalized:
            normalized["pricing"] = normalized.get("price")
        if "destination" not in normalized and "location" in normalized:
            normalized["destination"] = normalized.get("location")
        if "location" not in normalized and "destination" in normalized:
            normalized["location"] = normalized.get("destination")

        images = normalized.get("package_images", normalized.get("images"))
        if isinstance(images, str):
            normalized["package_images"] = [
                item.strip()
                for item in images.split(",")
                if item.strip()
            ]
        elif images is not None:
            normalized["package_images"] = images

        availability = normalized.get("availability")
        if isinstance(availability, str):
            try:
                normalized["availability"] = json.loads(availability)
            except json.JSONDecodeError:
                normalized["availability"] = {"notes": availability.strip()}

        itinerary = normalized.get("itinerary")
        if isinstance(itinerary, (list, dict)):
            normalized["itinerary"] = json.dumps(itinerary)

        return normalized

    @model_validator(mode="after")
    def require_location(self):
        if not self.location and self.destination:
            self.location = self.destination
        if not self.destination and self.location:
            self.destination = self.location
        if not self.location:
            raise ValueError("Package location is required")
        return self

    @field_validator("title", "destination", "location")
    @classmethod
    def strip_required_text(cls, value: Optional[str]):
        return value.strip() if value else value

    @field_validator("pricing", mode="before")
    @classmethod
    def normalize_pricing(cls, value):
        if value in ("", None):
            raise ValueError("Package price is required")
        return value


class VendorVerify(BaseModel):
    verification_status: str = Field(
        ...,
        pattern="^(approved|rejected|pending)$",
    )
    is_active: Optional[bool] = None


class VendorProfileUpdate(BaseModel):
    business_name: Optional[str] = None
    owner_name: Optional[str] = None
    phone: Optional[str] = None
    description: Optional[str] = None
    logo: Optional[str] = None


def _get_user_id(cursor, firebase_uid):
    cursor.execute(
        "SELECT id FROM users WHERE firebase_uid = %s",
        (firebase_uid,),
    )
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return row["id"] if hasattr(row, "keys") else row[0]


def _get_vendor_for_user(cursor, user_id):
    cursor.execute(
        """
        SELECT vendor_id, business_name, verification_status, is_active
        FROM vendors
        WHERE user_id = %s AND is_deleted = FALSE
        LIMIT 1
        """,
        (user_id,),
    )
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Vendor profile not found")
    return dict(row) if hasattr(row, "keys") else {
        "vendor_id": row[0],
        "business_name": row[1],
        "verification_status": row[2],
        "is_active": row[3],
    }


@router.post("/vendors/register")
def register_vendor(
    data: VendorRegister,
    user=Depends(verify_firebase_token),
):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _get_user_id(cursor, user["uid"])

        cursor.execute(
            "SELECT vendor_id FROM vendors WHERE user_id = %s",
            (user_id,),
        )
        if cursor.fetchone():
            raise HTTPException(
                status_code=400,
                detail="Vendor profile already exists",
            )

        cursor.execute(
            """
            INSERT INTO vendors (
                user_id, business_name, owner_name,
                contact_email, phone, description, logo
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING vendor_id
            """,
            (
                user_id,
                data.business_name,
                data.owner_name,
                data.contact_email,
                data.phone,
                data.description,
                data.logo,
            ),
        )
        row = cursor.fetchone()
        conn.commit()

        vendor_id = row["vendor_id"] if hasattr(row, "keys") else row[0]

        return success_response(
            message="Vendor registration submitted for approval",
            data={"vendor_id": vendor_id},
        )
    except HTTPException:
        conn.rollback()
        raise
    except Exception as exc:
        conn.rollback()
        logger.error("Vendor registration failed: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        cursor.close()
        conn.close()


@router.get("/vendors/me")
def get_my_vendor(user=Depends(verify_firebase_token)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _get_user_id(cursor, user["uid"])
        cursor.execute(
            """
            SELECT
                vendor_id, business_name, owner_name, contact_email,
                phone, description, logo, verification_status, is_active,
                created_at
            FROM vendors
            WHERE user_id = %s AND is_deleted = FALSE
            LIMIT 1
            """,
            (user_id,),
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Vendor profile not found")
        vendor = dict(row)
        if vendor.get("created_at"):
            vendor["created_at"] = str(vendor["created_at"])
        return success_response(message="Vendor profile", data=vendor)
    finally:
        cursor.close()
        conn.close()


@router.put("/vendors/me")
def update_my_vendor(
    data: VendorProfileUpdate,
    user=Depends(verify_firebase_token),
):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _get_user_id(cursor, user["uid"])
        vendor = _get_vendor_for_user(cursor, user_id)

        cursor.execute(
            """
            UPDATE vendors
            SET
                business_name = COALESCE(%s, business_name),
                owner_name = COALESCE(%s, owner_name),
                phone = COALESCE(%s, phone),
                description = COALESCE(%s, description),
                logo = COALESCE(%s, logo),
                updated_at = CURRENT_TIMESTAMP
            WHERE vendor_id = %s
            """,
            (
                data.business_name,
                data.owner_name,
                data.phone,
                data.description,
                data.logo,
                vendor["vendor_id"],
            ),
        )
        conn.commit()
        return success_response(message="Vendor profile updated")
    except HTTPException:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


@router.get("/vendors/analytics")
def vendor_analytics(user=Depends(verify_firebase_token)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _get_user_id(cursor, user["uid"])
        vendor = _get_vendor_for_user(cursor, user_id)
        vid = vendor["vendor_id"]

        cursor.execute(
            """
            SELECT COUNT(*) FROM vendor_packages
            WHERE vendor_id = %s AND is_deleted = FALSE
            """,
            (vid,),
        )
        package_count = cursor.fetchone()["count"]

        cursor.execute(
            """
            SELECT
                COUNT(b.id) AS total_bookings,
                COUNT(*) FILTER (
                    WHERE b.status IN ('paid', 'completed')
                ) AS completed_bookings,
                COUNT(*) FILTER (
                    WHERE b.status = 'pending'
                ) AS pending_bookings,
                COALESCE(SUM(
                    CASE WHEN b.status IN ('paid', 'completed')
                    THEN COALESCE(b.adjusted_price, b.budget) ELSE 0 END
                ), 0) AS revenue
            FROM bookings b
            INNER JOIN packages p ON b.package_id = p.id
            WHERE p.vendor_id = %s
            """,
            (vid,),
        )
        stats = dict(cursor.fetchone())

        cursor.execute(
            """
            SELECT
                b.booking_id, b.destination, b.name, b.status,
                b.payment_status, b.created_at,
                COALESCE(b.adjusted_price, b.budget) AS total_cost,
                p.title AS package_title
            FROM bookings b
            INNER JOIN packages p ON b.package_id = p.id
            WHERE p.vendor_id = %s
            ORDER BY b.id DESC
            LIMIT 50
            """,
            (vid,),
        )
        bookings = []
        for row in cursor.fetchall():
            item = dict(row)
            if item.get("created_at"):
                item["created_at"] = str(item["created_at"])
            bookings.append(item)

        return success_response(
            message="Vendor analytics",
            data={
                "stats": {
                    "packages": package_count,
                    "total_bookings": stats.get("total_bookings", 0),
                    "completed_bookings": stats.get("completed_bookings", 0),
                    "pending_bookings": stats.get("pending_bookings", 0),
                    "revenue": float(stats.get("revenue") or 0),
                },
                "bookings": bookings,
            },
        )
    except Exception as exc:
        logger.warning("Vendor analytics partial failure: %s", exc)
        return success_response(
            message="Vendor analytics",
            data={
                "stats": {
                    "packages": 0,
                    "total_bookings": 0,
                    "completed_bookings": 0,
                    "pending_bookings": 0,
                    "revenue": 0,
                },
                "bookings": [],
            },
        )
    finally:
        cursor.close()
        conn.close()


@router.get("/vendors/bookings")
def vendor_bookings(user=Depends(verify_firebase_token)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _get_user_id(cursor, user["uid"])
        vendor = _get_vendor_for_user(cursor, user_id)

        cursor.execute(
            """
            SELECT
                b.booking_id, b.destination, b.name, b.email, b.phone,
                b.status, b.payment_status, b.travelers, b.travel_date,
                COALESCE(b.adjusted_price, b.budget) AS total_cost,
                b.created_at, p.title AS package_title
            FROM bookings b
            INNER JOIN packages p ON b.package_id = p.id
            WHERE p.vendor_id = %s
            ORDER BY b.id DESC
            """,
            (vendor["vendor_id"],),
        )
        bookings = []
        for row in cursor.fetchall():
            item = dict(row)
            if item.get("created_at"):
                item["created_at"] = str(item["created_at"])
            bookings.append(item)

        return success_response(
            message="Vendor bookings",
            data={"bookings": bookings},
        )
    except Exception as exc:
        logger.warning("Vendor bookings query failed: %s", exc)
        return success_response(
            message="Vendor bookings",
            data={"bookings": []},
        )
    finally:
        cursor.close()
        conn.close()


@router.get("/vendors/packages")
def list_vendor_packages(user=Depends(verify_firebase_token)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _get_user_id(cursor, user["uid"])
        vendor = _get_vendor_for_user(cursor, user_id)

        cursor.execute(
            """
            SELECT
                id, title, destination, destination AS location,
                pricing, status, created_at
            FROM vendor_packages
            WHERE vendor_id = %s AND is_deleted = FALSE
            ORDER BY id DESC
            """,
            (vendor["vendor_id"],),
        )
        packages = [dict(r) for r in cursor.fetchall()]
        return success_response(
            message="Vendor packages",
            data={"packages": packages},
        )
    finally:
        cursor.close()
        conn.close()


@router.post("/vendors/packages")
def create_vendor_package(
    data: VendorPackageCreate,
    user=Depends(verify_firebase_token),
):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _get_user_id(cursor, user["uid"])
        vendor = _get_vendor_for_user(cursor, user_id)

        if vendor["verification_status"] != "approved":
            raise HTTPException(
                status_code=403,
                detail="Vendor must be approved before creating packages",
            )

        cursor.execute(
            """
            INSERT INTO vendor_packages (
                vendor_id, title, destination, pricing,
                itinerary, package_images, availability
            )
            VALUES (%s, %s, %s, %s, %s, %s::jsonb, %s::jsonb)
            RETURNING id
            """,
            (
                vendor["vendor_id"],
                data.title,
                data.destination,
                data.pricing,
                data.itinerary,
                json.dumps(data.package_images or []),
                json.dumps(data.availability or {}),
            ),
        )
        row = cursor.fetchone()
        pkg_id = row["id"] if hasattr(row, "keys") else row[0]

        cursor.execute(
            """
            INSERT INTO packages (
                vendor_id, title, location,
                price, duration, category, difficulty,
                short_description, description, status,
                featured_image, gallery
            )
            VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s,
                'active', %s, %s::jsonb
            )
            """,
            (
                vendor["vendor_id"],
                data.title,
                data.location,
                data.pricing,
                data.duration or "2D/1N",
                data.category or "Trek",
                data.difficulty or "Moderate",
                data.description or data.itinerary or data.title,
                data.description or data.itinerary or data.title,
                (data.package_images or [""])[0],
                json.dumps(data.package_images or []),
            ),
        )

        conn.commit()

        return success_response(
            message="Package created",
            data={"package_id": pkg_id},
        )
    except HTTPException:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


@router.get("/vendors/marketplace")
def marketplace_vendors():
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        cursor.execute(
            """
            SELECT vendor_id, business_name, description, logo, created_at
            FROM vendors
            WHERE verification_status = 'approved'
            AND is_active = TRUE
            AND is_deleted = FALSE
            ORDER BY business_name
            """
        )
        vendors = [dict(r) for r in cursor.fetchall()]
        return success_response(
            message="Marketplace vendors",
            data={"vendors": vendors},
        )
    finally:
        cursor.close()
        conn.close()


@router.get("/admin/vendors")
def admin_list_vendors(admin=Depends(get_current_user)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        cursor.execute(
            """
            SELECT
                vendor_id, business_name, owner_name, contact_email,
                verification_status, is_active, created_at
            FROM vendors
            WHERE is_deleted = FALSE
            ORDER BY created_at DESC
            """
        )
        vendors = [dict(r) for r in cursor.fetchall()]
        return success_response(message="Vendors", data={"vendors": vendors})
    finally:
        cursor.close()
        conn.close()


@router.post("/admin/vendors/{vendor_id}/verify")
def verify_vendor(
    vendor_id: int,
    data: VendorVerify,
    admin=Depends(get_current_user),
):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        cursor.execute(
            """
            UPDATE vendors
            SET
                verification_status = %s,
                is_active = COALESCE(%s, is_active),
                updated_at = CURRENT_TIMESTAMP
            WHERE vendor_id = %s
            """,
            (
                data.verification_status,
                data.is_active,
                vendor_id,
            ),
        )

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Vendor not found")

        conn.commit()
        return success_response(message="Vendor verification updated")
    except HTTPException:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

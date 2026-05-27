import logging
import json
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, field_validator, model_validator
from slugify import slugify

from app.db import get_connection, get_cursor
from app.auth.jwt_handler import get_current_user
from app.routes.auth import get_current_user as get_current_admin
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


class VendorBatchCreate(BaseModel):
    package_id: int
    start_date: str
    end_date: str
    booking_deadline: str
    max_seats: int = Field(default=20, ge=0)
    booked_seats: int = Field(default=0, ge=0)
    pickup_location: Optional[str] = "Pune"
    guide_name: Optional[str] = ""
    batch_status: Optional[str] = Field(
        default="open",
        pattern="^(open|closed|cancelled|completed)$",
    )


def _get_user_id(cursor, user_id):
    cursor.execute(
        "SELECT id FROM users WHERE id = %s",
        (user_id,),
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
    user=Depends(get_current_user),
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
def get_my_vendor(user=Depends(get_current_user)):
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
    user=Depends(get_current_user),
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
def vendor_analytics(user=Depends(get_current_user)):
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

        cursor.execute(
            """
            SELECT
                COUNT(*) AS upcoming_batches,
                COALESCE(AVG(
                    CASE WHEN tb.max_seats > 0
                    THEN (tb.booked_seats::numeric / tb.max_seats::numeric) * 100
                    ELSE 0 END
                ), 0) AS occupancy
            FROM trip_batches tb
            INNER JOIN packages p ON p.id = tb.package_id
            WHERE p.vendor_id = %s
            AND tb.start_date >= CURRENT_DATE
            AND tb.batch_status = 'open'
            """,
            (vid,),
        )
        batch_stats = dict(cursor.fetchone())

        return success_response(
            message="Vendor analytics",
            data={
                "stats": {
                    "packages": package_count,
                    "total_bookings": stats.get("total_bookings", 0),
                    "completed_bookings": stats.get("completed_bookings", 0),
                    "pending_bookings": stats.get("pending_bookings", 0),
                    "revenue": float(stats.get("revenue") or 0),
                    "upcoming_batches": batch_stats.get("upcoming_batches", 0),
                    "occupancy": round(float(batch_stats.get("occupancy") or 0), 1),
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
                    "upcoming_batches": 0,
                    "occupancy": 0,
                },
                "bookings": [],
            },
        )
    finally:
        cursor.close()
        conn.close()


@router.get("/vendors/bookings")
def vendor_bookings(user=Depends(get_current_user)):
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
def list_vendor_packages(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        user_id = _get_user_id(cursor, user["uid"])
        vendor = _get_vendor_for_user(cursor, user_id)

        cursor.execute(
            """
            SELECT
                vp.id, vp.title, vp.destination, vp.destination AS location,
                vp.pricing, vp.status, vp.created_at,
                p.id AS package_id
            FROM vendor_packages vp
            LEFT JOIN packages p
              ON p.vendor_id = vp.vendor_id
             AND p.title = vp.title
             AND p.location = vp.destination
            WHERE vp.vendor_id = %s AND vp.is_deleted = FALSE
            ORDER BY vp.id DESC
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
    user=Depends(get_current_user),
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
            "SELECT COUNT(*) AS count FROM packages WHERE slug = %s",
            (slugify(data.title),),
        )
        slug_count = cursor.fetchone()["count"]
        package_slug = slugify(data.title)
        if slug_count:
            package_slug = f"{package_slug}-{vendor['vendor_id']}-{pkg_id}"

        cursor.execute(
            """
            INSERT INTO packages (
                vendor_id, title, slug, location,
                price, duration, category, difficulty,
                short_description, description, status,
                featured_image, gallery
            )
            VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                'active', %s, %s::jsonb
            )
            """,
            (
                vendor["vendor_id"],
                data.title,
                package_slug,
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


@router.get("/vendors/batches")
def list_vendor_batches(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = get_cursor(conn)
    try:
        user_id = _get_user_id(cursor, user["uid"])
        vendor = _get_vendor_for_user(cursor, user_id)
        cursor.execute(
            """
            SELECT
                tb.id, tb.package_id, tb.start_date, tb.end_date,
                tb.booking_deadline, tb.max_seats, tb.booked_seats,
                tb.pickup_location, tb.guide_name, tb.batch_status,
                p.title AS package_title, p.location
            FROM trip_batches tb
            INNER JOIN packages p ON p.id = tb.package_id
            WHERE p.vendor_id = %s
            ORDER BY tb.start_date ASC
            """,
            (vendor["vendor_id"],),
        )
        batches = []
        for row in cursor.fetchall():
            item = dict(row)
            for key in ("start_date", "end_date", "booking_deadline"):
                if item.get(key):
                    item[key] = str(item[key])
            item["seats_left"] = max(
                int(item.get("max_seats") or 0) - int(item.get("booked_seats") or 0),
                0,
            )
            batches.append(item)
        return success_response(message="Vendor batches", data={"batches": batches})
    except Exception as exc:
        if "trip_batches" in str(exc) and "does not exist" in str(exc):
            logger.warning("Trip batches table missing: %s", exc)
            return success_response(
                message="Trip batch schema has not been applied yet",
                data={"batches": []},
            )
        raise
    finally:
        cursor.close()
        conn.close()


@router.post("/vendors/batches")
def create_vendor_batch(data: VendorBatchCreate, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = get_cursor(conn)
    try:
        user_id = _get_user_id(cursor, user["uid"])
        vendor = _get_vendor_for_user(cursor, user_id)
        if vendor["verification_status"] != "approved":
            raise HTTPException(
                status_code=403,
                detail="Vendor must be approved before managing batches",
            )
        if data.booked_seats > data.max_seats:
            raise HTTPException(status_code=400, detail="Booked seats cannot exceed max seats")

        cursor.execute(
            "SELECT id FROM packages WHERE id = %s AND vendor_id = %s",
            (data.package_id, vendor["vendor_id"]),
        )
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Vendor package not found")

        cursor.execute(
            """
            INSERT INTO trip_batches (
                package_id, start_date, end_date, booking_deadline,
                max_seats, booked_seats, pickup_location, guide_name,
                batch_status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                data.package_id, data.start_date, data.end_date,
                data.booking_deadline, data.max_seats, data.booked_seats,
                data.pickup_location, data.guide_name, data.batch_status,
            ),
        )
        row = cursor.fetchone()
        conn.commit()
        return success_response(message="Batch created", data={"batch_id": row["id"]})
    except HTTPException:
        conn.rollback()
        raise
    except Exception as exc:
        conn.rollback()
        if "trip_batches" in str(exc) and "does not exist" in str(exc):
            raise HTTPException(
                status_code=503,
                detail="Trip batch schema has not been applied. Run backend/schema.sql or backend/migrations/20260525_trip_batches.sql.",
            ) from exc
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
            SELECT vendor_id, business_name, description, logo, created_at,
                   rating, response_time, verified_badge
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
def admin_list_vendors(admin=Depends(get_current_admin)):
    conn = get_connection()
    cursor = get_cursor(conn)

    try:
        cursor.execute(
            """
            SELECT
                vendor_id, business_name, owner_name, contact_email,
                verification_status, is_active, created_at,
                rating, response_time, verified_badge
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
    admin=Depends(get_current_admin),
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

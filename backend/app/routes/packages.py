# =====================================================
# app/routes/packages.py
# MAHARASHTRA TRAVEL PACKAGES API
# FULL UPDATED CLEAN VERSION
# SLUG SUPPORT + DETAIL PAGE FIX
# =====================================================

import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from psycopg2.extras import Json, RealDictCursor
from slugify import slugify

from app.db import get_connection
from app.routes.auth import get_current_user

router = APIRouter(
    tags=["Packages"]
)


def _text_lines(value):
    if not value:
        return []
    if isinstance(value, list):
        return value
    return [
        item.strip()
        for item in str(value).splitlines()
        if item.strip()
    ]


def _serialize_package(row):
    item = dict(row)
    if not item.get("slug") and item.get("id") is not None:
        item["slug"] = str(item["id"])
    item["included"] = _text_lines(item.get("included"))
    item["excluded"] = _text_lines(item.get("excluded"))
    for key, fallback in {
        "gallery": [],
        "itinerary": [],
        "pickup_points": [],
        "highlights": [],
        "faq": [],
        "nearby_attractions": [],
        "safety_notes": [],
        "weather_details": {},
        "transport_info": {},
    }.items():
        value = item.get(key)
        if isinstance(value, str):
            try:
                item[key] = json.loads(value)
            except Exception:
                item[key] = fallback
        elif value is None:
            item[key] = fallback
    if item.get("created_at"):
        item["created_at"] = str(item["created_at"])
    if item.get("updated_at"):
        item["updated_at"] = str(item["updated_at"])
    return item


def _serialize_batch(row):
    item = dict(row)
    for key in ("start_date", "end_date", "booking_deadline", "created_at", "updated_at"):
        if item.get(key):
            item[key] = str(item[key])
    item["seats_left"] = max(
        int(item.get("max_seats") or 0) - int(item.get("booked_seats") or 0),
        0,
    )
    item["occupancy"] = (
        round((int(item.get("booked_seats") or 0) / int(item.get("max_seats") or 1)) * 100, 1)
        if int(item.get("max_seats") or 0) > 0
        else 0
    )
    return item

# =====================================================
# PACKAGE MODEL
# =====================================================

class PackageRequest(BaseModel):

    title: str = Field(
        ...,
        min_length=3,
        max_length=140
    )

    location: str = Field(
        ...,
        min_length=2,
        max_length=120
    )

    region: Optional[str] = ""

    category: Optional[str] = ""

    difficulty: Optional[str] = ""

    duration: Optional[str] = ""

    altitude: Optional[str] = ""

    trek_distance: Optional[str] = ""

    group_size: Optional[int] = 0

    best_season: Optional[str] = ""

    fitness_required: Optional[str] = ""

    travel_type: Optional[str] = ""

    price: float = Field(
        ...,
        ge=0
    )

    seasonal_price: Optional[float] = Field(
        default=None,
        ge=0
    )

    featured_image: Optional[str] = ""

    gallery: Optional[List[str]] = []

    short_description: str = Field(
        ...,
        min_length=10,
        max_length=300
    )

    full_description: Optional[str] = ""

    included: Optional[List[str]] = []

    excluded: Optional[List[str]] = []

    pickup_points: Optional[List[str]] = []

    highlights: Optional[List[str]] = []

    weather_details: Optional[dict] = {}

    faq: Optional[List[dict]] = []

    nearby_attractions: Optional[List[str]] = []

    safety_notes: Optional[List[str]] = []

    transport_info: Optional[dict] = {}

    map_url: Optional[str] = ""

    itinerary: Optional[List[dict]] = []

    featured: Optional[bool] = False

    status: Optional[str] = "active"

    rating: Optional[float] = Field(
        default=0,
        ge=0,
        le=5
    )


class TripBatchRequest(BaseModel):
    package_id: int
    start_date: str
    end_date: str
    booking_deadline: str
    max_seats: int = Field(default=20, ge=0)
    booked_seats: int = Field(default=0, ge=0)
    pickup_location: Optional[str] = "Pune"
    guide_name: Optional[str] = ""
    batch_status: Optional[str] = Field(default="open", pattern="^(open|closed|cancelled|completed)$")

# =====================================================
# GET ALL PACKAGES
# =====================================================

@router.get("/packages")
def get_packages():

    conn = get_connection()

    cur = conn.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cur.execute("""
            SELECT
                id,
                vendor_id,
                title,
                slug,
                location,
                region,
                category,
                difficulty,
                duration,
                altitude,
                trek_distance,
                group_size,
                best_season,
                fitness_required,
                travel_type,
                price,
                seasonal_price,
                featured_image,
                gallery,
                short_description,
                full_description,
                included,
                excluded,
                highlights,
                weather_details,
                faq,
                nearby_attractions,
                safety_notes,
                transport_info,
                map_url,
                pickup_points,
                itinerary,
                featured,
                status,
                rating,
                total_reviews,
                created_at,
                updated_at
            FROM packages
            WHERE status = 'active'
            ORDER BY featured DESC, rating DESC
        """)

        packages = [
            _serialize_package(row)
            for row in cur.fetchall()
        ]

        return {

            "success": True,

            "count": len(packages),

            "packages": packages

        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        cur.close()
        conn.close()

# =====================================================
# GET SINGLE PACKAGE BY SLUG
# IMPORTANT FIX
# =====================================================

@router.get("/packages/{slug}")
def get_single_package(slug: str):

    conn = get_connection()

    cur = conn.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cur.execute("""
            SELECT
                id,
                p.vendor_id,
                title,
                slug,
                location,
                region,
                category,
                difficulty,
                duration,
                altitude,
                trek_distance,
                group_size,
                best_season,
                fitness_required,
                travel_type,
                price,
                seasonal_price,
                featured_image,
                gallery,
                short_description,
                full_description,
                included,
                excluded,
                highlights,
                weather_details,
                faq,
                nearby_attractions,
                safety_notes,
                transport_info,
                map_url,
                pickup_points,
                itinerary,
                featured,
                p.status,
                p.rating,
                total_reviews,
                p.created_at,
                p.updated_at,
                v.business_name AS vendor_name,
                v.owner_name AS vendor_owner,
                v.rating AS vendor_rating,
                v.response_time AS vendor_response_time,
                v.verified_badge AS vendor_verified
            FROM packages p
            LEFT JOIN vendors v ON v.vendor_id = p.vendor_id
            WHERE (p.slug = %s OR p.id::text = %s)
            AND p.status = 'active'
        """, (slug, slug))

        package = cur.fetchone()

        if not package:

            raise HTTPException(
                status_code=404,
                detail="Package not found"
            )

        return {

            "success": True,

            "package": _serialize_package(package)

        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        cur.close()
        conn.close()


@router.get("/packages/{slug}/batches")
def get_package_batches(slug: str):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute(
            """
            SELECT
                tb.id, tb.package_id, tb.start_date, tb.end_date,
                tb.booking_deadline, tb.max_seats, tb.booked_seats,
                tb.pickup_location, tb.guide_name, tb.batch_status,
                tb.created_at, tb.updated_at
            FROM trip_batches tb
            INNER JOIN packages p ON p.id = tb.package_id
            WHERE p.slug = %s
            AND tb.batch_status = 'open'
            AND tb.start_date >= CURRENT_DATE
            ORDER BY tb.start_date ASC
            """,
            (slug,),
        )
        batches = [_serialize_batch(row) for row in cur.fetchall()]
        return {"success": True, "batches": batches}
    except Exception as exc:
        if "trip_batches" in str(exc) and "does not exist" in str(exc):
            return {
                "success": True,
                "message": "Trip batch schema has not been applied yet",
                "batches": [],
            }
        raise
    finally:
        cur.close()
        conn.close()


@router.get("/trip-batches")
def get_trip_batches(admin=Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cur.execute(
            """
            SELECT
                tb.id, tb.package_id, tb.start_date, tb.end_date,
                tb.booking_deadline, tb.max_seats, tb.booked_seats,
                tb.pickup_location, tb.guide_name, tb.batch_status,
                tb.created_at, tb.updated_at,
                p.title AS package_title, p.location
            FROM trip_batches tb
            INNER JOIN packages p ON p.id = tb.package_id
            ORDER BY tb.start_date ASC
            """
        )
        return {"success": True, "batches": [_serialize_batch(row) for row in cur.fetchall()]}
    except Exception as exc:
        if "trip_batches" in str(exc) and "does not exist" in str(exc):
            raise HTTPException(
                status_code=503,
                detail="Trip batch schema has not been applied. Run backend/schema.sql or backend/migrations/20260525_trip_batches.sql.",
            ) from exc
        raise
    finally:
        cur.close()
        conn.close()


@router.post("/trip-batches")
def create_trip_batch(data: TripBatchRequest, admin=Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    try:
        if data.booked_seats > data.max_seats:
            raise HTTPException(status_code=400, detail="Booked seats cannot exceed max seats")
        cur.execute(
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
        row = cur.fetchone()
        conn.commit()
        return {"success": True, "message": "Trip batch created", "batch_id": row["id"]}
    except HTTPException:
        conn.rollback()
        raise
    except Exception as exc:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        cur.close()
        conn.close()


@router.put("/trip-batches/{batch_id}")
def update_trip_batch(batch_id: int, data: TripBatchRequest, admin=Depends(get_current_user)):
    conn = get_connection()
    cur = conn.cursor()
    try:
        if data.booked_seats > data.max_seats:
            raise HTTPException(status_code=400, detail="Booked seats cannot exceed max seats")
        cur.execute(
            """
            UPDATE trip_batches
            SET
                package_id = %s, start_date = %s, end_date = %s,
                booking_deadline = %s, max_seats = %s, booked_seats = %s,
                pickup_location = %s, guide_name = %s, batch_status = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            """,
            (
                data.package_id, data.start_date, data.end_date,
                data.booking_deadline, data.max_seats, data.booked_seats,
                data.pickup_location, data.guide_name, data.batch_status,
                batch_id,
            ),
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Trip batch not found")
        conn.commit()
        return {"success": True, "message": "Trip batch updated"}
    except HTTPException:
        conn.rollback()
        raise
    except Exception as exc:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    finally:
        cur.close()
        conn.close()

# =====================================================
# CREATE PACKAGE
# =====================================================

@router.post("/packages")
def create_package(
    data: PackageRequest,
    admin=Depends(get_current_user)
):

    conn = get_connection()

    cur = conn.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        package_slug = slugify(
            data.title
        )

        # =====================================================
        # CHECK EXISTING SLUG
        # =====================================================

        cur.execute("""
            SELECT id
            FROM packages
            WHERE slug = %s
        """, (package_slug,))

        existing = cur.fetchone()

        if existing:

            package_slug = (
                f"{package_slug}-{existing['id']}"
            )

        # =====================================================
        # INSERT PACKAGE
        # =====================================================

        cur.execute("""
            INSERT INTO packages (

                title,
                slug,
                location,
                region,
                category,
                difficulty,
                duration,
                altitude,
                trek_distance,
                group_size,
                best_season,
                fitness_required,
                travel_type,
                price,
                seasonal_price,
                featured_image,
                gallery,
                short_description,
                full_description,
                included,
                excluded,
                highlights,
                weather_details,
                faq,
                nearby_attractions,
                safety_notes,
                transport_info,
                map_url,
                pickup_points,
                itinerary,
                featured,
                status,
                rating

            )

            VALUES (

                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s

            )

            RETURNING id, slug

        """, (

            data.title,
            package_slug,
            data.location,
            data.region,
            data.category,
            data.difficulty,
            data.duration,
            data.altitude,
            data.trek_distance,
            data.group_size,
            data.best_season,
            data.fitness_required,
            data.travel_type,
            data.price,
            data.seasonal_price,
            data.featured_image,
            Json(data.gallery or []),
            data.short_description,
            data.full_description,
            "\n".join(data.included or []),
            "\n".join(data.excluded or []),
            Json(data.highlights or []),
            Json(data.weather_details or {}),
            Json(data.faq or []),
            Json(data.nearby_attractions or []),
            Json(data.safety_notes or []),
            Json(data.transport_info or {}),
            data.map_url,
            Json(data.pickup_points or []),
            Json(data.itinerary or []),
            data.featured,
            data.status,
            data.rating

        ))

        created_package = cur.fetchone()

        conn.commit()

        return {

            "success": True,

            "message": "Package created successfully",

            "package_id": created_package["id"],

            "slug": created_package["slug"]

        }

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    finally:

        cur.close()
        conn.close()

# =====================================================
# UPDATE PACKAGE
# =====================================================

@router.put("/packages/{id}")
def update_package(
    id: int,
    data: PackageRequest,
    admin=Depends(get_current_user)
):

    conn = get_connection()

    cur = conn.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        package_slug = slugify(
            data.title
        )

        cur.execute("""
            UPDATE packages

            SET

                title = %s,
                slug = %s,
                location = %s,
                region = %s,
                category = %s,
                difficulty = %s,
                duration = %s,
                altitude = %s,
                trek_distance = %s,
                group_size = %s,
                best_season = %s,
                fitness_required = %s,
                travel_type = %s,
                price = %s,
                seasonal_price = %s,
                featured_image = %s,
                gallery = %s,
                short_description = %s,
                full_description = %s,
                included = %s,
                excluded = %s,
                highlights = %s,
                weather_details = %s,
                faq = %s,
                nearby_attractions = %s,
                safety_notes = %s,
                transport_info = %s,
                map_url = %s,
                pickup_points = %s,
                itinerary = %s,
                featured = %s,
                status = %s,
                rating = %s,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = %s

        """, (

            data.title,
            package_slug,
            data.location,
            data.region,
            data.category,
            data.difficulty,
            data.duration,
            data.altitude,
            data.trek_distance,
            data.group_size,
            data.best_season,
            data.fitness_required,
            data.travel_type,
            data.price,
            data.seasonal_price,
            data.featured_image,
            Json(data.gallery or []),
            data.short_description,
            data.full_description,
            "\n".join(data.included or []),
            "\n".join(data.excluded or []),
            Json(data.highlights or []),
            Json(data.weather_details or {}),
            Json(data.faq or []),
            Json(data.nearby_attractions or []),
            Json(data.safety_notes or []),
            Json(data.transport_info or {}),
            data.map_url,
            Json(data.pickup_points or []),
            Json(data.itinerary or []),
            data.featured,
            data.status,
            data.rating,
            id

        ))

        if cur.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Package not found"
            )

        conn.commit()

        return {

            "success": True,

            "message": "Package updated successfully"

        }

    except HTTPException:
        raise

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    finally:

        cur.close()
        conn.close()

# =====================================================
# DELETE PACKAGE
# =====================================================

@router.delete("/packages/{id}")
def delete_package(
    id: int,
    admin=Depends(get_current_user)
):

    conn = get_connection()

    cur = conn.cursor(
        cursor_factory=RealDictCursor
    )

    try:

        cur.execute("""
            DELETE FROM packages
            WHERE id = %s
        """, (id,))

        if cur.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Package not found"
            )

        conn.commit()

        return {

            "success": True,

            "message": "Package deleted successfully"

        }

    except HTTPException:
        raise

    except Exception as e:

        conn.rollback()

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    finally:

        cur.close()
        conn.close()

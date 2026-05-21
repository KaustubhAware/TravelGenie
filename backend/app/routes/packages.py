# =====================================================
# app/routes/packages.py
# MAHARASHTRA TRAVEL PACKAGES API
# FULL UPDATED CLEAN VERSION
# SLUG SUPPORT + DETAIL PAGE FIX
# =====================================================

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from psycopg2.extras import RealDictCursor
from slugify import slugify

from app.db import get_connection
from app.routes.auth import get_current_user

router = APIRouter(
    tags=["Packages"]
)

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

    itinerary: Optional[List[dict]] = []

    featured: Optional[bool] = False

    status: Optional[str] = "active"

    rating: Optional[float] = Field(
        default=0,
        ge=0,
        le=5
    )

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
                short_description,
                featured,
                rating,
                total_reviews
            FROM packages
            WHERE status = 'active'
            ORDER BY featured DESC, rating DESC
        """)

        packages = cur.fetchall()

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
                pickup_points,
                itinerary,
                featured,
                status,
                rating,
                total_reviews,
                created_at,
                updated_at
            FROM packages
            WHERE slug = %s
            AND status = 'active'
        """, (slug,))

        package = cur.fetchone()

        if not package:

            raise HTTPException(
                status_code=404,
                detail="Package not found"
            )

        return {

            "success": True,

            "package": package

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
                pickup_points,
                itinerary,
                featured,
                status,
                rating

            )

            VALUES (

                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,%s

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
            data.gallery,
            data.short_description,
            data.full_description,
            data.included,
            data.excluded,
            data.pickup_points,
            data.itinerary,
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
            data.gallery,
            data.short_description,
            data.full_description,
            data.included,
            data.excluded,
            data.pickup_points,
            data.itinerary,
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
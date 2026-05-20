# =====================================================
# app/routes/packages.py
# =====================================================

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.db import get_connection
from app.routes.auth import get_current_user

router = APIRouter()

# =====================================================
# PACKAGE REQUEST MODEL
# =====================================================

class PackageRequest(BaseModel):

    title: str = Field(..., min_length=3, max_length=140)

    destination: str = Field(..., min_length=2, max_length=120)

    duration: str = Field(..., min_length=2, max_length=60)

    price: float = Field(..., ge=0)

    description: str = Field(
        ...,
        min_length=10,
        max_length=1500
    )

    image: str | None = Field(
        default="",
        max_length=500
    )

    services: str = Field(
        default="",
        max_length=800
    )

    category: str | None = Field(
        default="",
        max_length=80
    )

    seasonal_price: float | None = Field(
        default=None,
        ge=0
    )

    featured: bool | None = False

    rating: float | None = Field(
        default=0,
        ge=0,
        le=5
    )

    # =====================================================
    # NEW PREMIUM FIELDS
    # =====================================================

    difficulty: str | None = ""

    group_size: str | None = ""

    best_season: str | None = ""

    altitude: str | None = ""

    included: str | None = ""

    excluded: str | None = ""

    itinerary: str | None = ""

    hotel_details: str | None = ""

    transport_details: str | None = ""

    gallery: str | None = ""

# =====================================================
# ENSURE EXTRA COLUMNS
# =====================================================

def ensure_package_operations_columns(cur):

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS category VARCHAR(80)
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS seasonal_price NUMERIC(12, 2)
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS availability_calendar JSONB DEFAULT '{}'::jsonb
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS gallery TEXT
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 0
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50)
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS group_size VARCHAR(50)
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS best_season VARCHAR(120)
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS altitude VARCHAR(120)
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS included TEXT
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS excluded TEXT
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS itinerary TEXT
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS hotel_details TEXT
    """)

    cur.execute("""
        ALTER TABLE packages
        ADD COLUMN IF NOT EXISTS transport_details TEXT
    """)
# =====================================================
# GET ALL PACKAGES
# =====================================================

@router.get("/packages")
def get_packages():

    conn = get_connection()

    cur = conn.cursor()

    try:

        ensure_package_operations_columns(cur)

        cur.execute("""
            SELECT
                id,
                title,
                destination,
                duration,
                price,
                description,
                image,
                services,
                category,
                seasonal_price,
                featured,
                rating,
                difficulty,
                group_size,
                best_season,
                altitude
            FROM packages
            ORDER BY id DESC
        """)

        rows = cur.fetchall()

        packages = []

        for row in rows:

            packages.append({

                "id": row[0],

                "title": row[1],

                "destination": row[2],

                "duration": row[3],

                "price": float(row[4]),

                "description": row[5],

                "image": row[6],

                "services": row[7],

                "category": row[8],

                "seasonal_price": (
                    float(row[9])
                    if row[9] is not None
                    else None
                ),

                "featured": row[10],

                "rating": float(row[11] or 0),

                "difficulty": row[12],

                "group_size": row[13],

                "best_season": row[14],

                "altitude": row[15]

            })

        return {
            "packages": packages
        }

    finally:

        cur.close()

        conn.close()

# =====================================================
# GET SINGLE PACKAGE
# =====================================================

@router.get("/packages/{id}")
def get_single_package(id: int):

    conn = get_connection()

    cur = conn.cursor()

    try:

        ensure_package_operations_columns(cur)

        cur.execute("""
            SELECT
                id,
                title,
                destination,
                duration,
                price,
                description,
                image,
                services,
                category,
                seasonal_price,
                featured,
                rating,
                itinerary,
                hotel_details,
                transport_details,
                difficulty,
                group_size,
                best_season,
                altitude,
                included,
                excluded,
                gallery
            FROM packages
            WHERE id = %s
        """, (id,))

        row = cur.fetchone()

        if not row:

            raise HTTPException(
                status_code=404,
                detail="Package not found"
            )

        return {

            "id": row[0],

            "title": row[1],

            "destination": row[2],

            "duration": row[3],

            "price": float(row[4]),

            "description": row[5],

            "image": row[6],

            "services": row[7],

            "category": row[8],

            "seasonal_price": (
                float(row[9])
                if row[9] is not None
                else None
            ),

            "featured": row[10],

            "rating": float(row[11] or 0),

            "itinerary": row[12],

            "hotel_details": row[13],

            "transport_details": row[14],

            "difficulty": row[15],

            "group_size": row[16],

            "best_season": row[17],

            "altitude": row[18],

            "included": row[19],

            "excluded": row[20],

            "gallery": row[21]

        }

    finally:

        cur.close()

        conn.close()

# =====================================================
# ADD PACKAGE
# =====================================================

@router.post("/packages")
def add_package(
    data: PackageRequest,
    admin=Depends(get_current_user)
):

    conn = get_connection()

    cur = conn.cursor()

    try:

        ensure_package_operations_columns(cur)

        cur.execute("""
            INSERT INTO packages
            (
                title,
                destination,
                duration,
                price,
                description,
                image,
                services,
                category,
                seasonal_price,
                featured,
                rating,
                difficulty,
                group_size,
                best_season,
                altitude,
                included,
                excluded,
                itinerary,
                hotel_details,
                transport_details,
                gallery
            )
            VALUES
            (
                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
            )
        """, (

            data.title,

            data.destination,

            data.duration,

            data.price,

            data.description,

            data.image or "",

            data.services,

            data.category or "",

            data.seasonal_price,

            data.featured,

            data.rating or 0,

            data.difficulty or "",

            data.group_size or "",

            data.best_season or "",

            data.altitude or "",

            data.included or "",

            data.excluded or "",

            data.itinerary or "",

            data.hotel_details or "",

            data.transport_details or "",

            data.gallery or ""

        ))

        conn.commit()

        return {
            "message": "Package added successfully"
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

    cur = conn.cursor()

    try:

        ensure_package_operations_columns(cur)

        cur.execute("""
            UPDATE packages
            SET
                title = %s,
                destination = %s,
                duration = %s,
                price = %s,
                description = %s,
                image = %s,
                services = %s,
                category = %s,
                seasonal_price = %s,
                featured = %s,
                rating = %s,
                difficulty = %s,
                group_size = %s,
                best_season = %s,
                altitude = %s,
                included = %s,
                excluded = %s,
                itinerary = %s,
                hotel_details = %s,
                transport_details = %s,
                gallery = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (

            data.title,

            data.destination,

            data.duration,

            data.price,

            data.description,

            data.image or "",

            data.services,

            data.category or "",

            data.seasonal_price,

            data.featured,

            data.rating or 0,

            data.difficulty or "",

            data.group_size or "",

            data.best_season or "",

            data.altitude or "",

            data.included or "",

            data.excluded or "",

            data.itinerary or "",

            data.hotel_details or "",

            data.transport_details or "",

            data.gallery or "",

            id

        ))

        if cur.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Package not found"
            )

        conn.commit()

        return {
            "message": "Package updated successfully"
        }

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

    cur = conn.cursor()

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
            "message": "Package deleted successfully"
        }

    finally:

        cur.close()

        conn.close()
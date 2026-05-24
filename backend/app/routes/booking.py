import logging
import random

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.db import get_connection
from app.firebase_auth import verify_firebase_token
from app.routes.auth import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()

VALID_BOOKING_STATUSES = {
    "pending",
    "under_review",
    "approved",
    "rejected",
    "payment_pending",
    "cancelled",
    "paid",
    "completed",
}

# =====================================================
# REQUEST MODELS
# =====================================================

class BookingRequest(BaseModel):

    firstName: str = Field(..., min_length=1, max_length=80)

    lastName: str = Field(..., min_length=1, max_length=80)

    email: str = Field(..., max_length=160)

    phone: str = Field(..., min_length=10, max_length=20)

    destination: str = Field(..., min_length=2, max_length=120)

    budget: float = Field(..., ge=0)

    days: int = Field(..., ge=1, le=60)

    departure: str | None = None

    returnDate: str | None = None

    adults: int | None = Field(default=1, ge=1)

    children: int | None = Field(default=0, ge=0)

    notes: str | None = Field(
        default=None,
        max_length=1000
    )

    # =====================================================
    # PACKAGE BOOKING
    # =====================================================

    package_id: int | None = None

    travel_date: str | None = None

    travelers: int | None = Field(
        default=1,
        ge=1
    )

    special_request: str | None = Field(
        default=None,
        max_length=1000
    )

class PaymentRequest(BaseModel):

    booking_id: str = Field(
        ...,
        min_length=5,
        max_length=40
    )

# =====================================================
# ENSURE COLUMNS
# =====================================================

def ensure_booking_workflow_columns(cursor):
    """Deprecated: schema is managed via schema.sql only."""
    logger.debug(
        "ensure_booking_workflow_columns is deprecated and no longer mutates schema"
    )

# =====================================================
# GENERATE BOOKING ID
# =====================================================

def generate_booking_id():

    return f"TG-BOOK-{random.randint(10000,99999)}"

# =====================================================
# GET DATABASE USER ID
# =====================================================

def get_db_user_id(firebase_uid):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE firebase_uid = %s
            """,
            (firebase_uid,)
        )

        user = cursor.fetchone()

        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        return user[0]

    finally:

        cursor.close()
        conn.close()

# =====================================================
# SAVE BOOKING
# =====================================================

@router.post("/save-booking")
def save_booking(
    data: BookingRequest,
    user=Depends(verify_firebase_token)
):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        firebase_uid = user["uid"]

        db_user_id = get_db_user_id(
            firebase_uid
        )

        ensure_booking_workflow_columns(cursor)

        if "@" not in data.email or "." not in data.email.split("@")[-1]:
            raise HTTPException(
                status_code=422,
                detail="Invalid email address",
            )

        booking_id = generate_booking_id()

        name = (
            f"{data.firstName} {data.lastName}"
        ).strip()

        # =====================================================
        # GET PACKAGE DETAILS FROM DATABASE
        # IMPORTANT FIX
        # =====================================================

        package_title = "Unknown"

        package_image = ""

        package_duration = data.days

        package_price = data.budget

        if data.package_id:

            cursor.execute(
                """
                SELECT
                    title,
                    featured_image,
                    duration,
                    price,
                    location

                FROM packages

                WHERE id = %s
                """,
                (data.package_id,)
            )

            package = cursor.fetchone()

            if package:

                package_title = package[0]

                package_image = package[1]

                package_duration = package[2]

                package_price = package[3]

                destination = package[4]

            else:

                destination = data.destination

        else:

            destination = data.destination

        # =====================================================
        # INSERT BOOKING
        # =====================================================

        cursor.execute(
            """
            INSERT INTO bookings
            (
                user_id,
                booking_id,
                destination,
                name,
                email,
                phone,
                budget,
                days,
                status,
                payment_status,

                package_id,
                package_title,
                package_image,
                travel_date,
                travelers,
                special_request
            )

            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,

                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            """,
            (
                db_user_id,

                booking_id,

                destination,

                name,

                data.email,

                data.phone,

                package_price,

                data.days,

                "pending",

                "unpaid",

                data.package_id,

                package_title,

                package_image,

                data.travel_date,

                data.travelers,

                data.special_request
            )
        )

        conn.commit()

        return {

            "message": "Booking request submitted",

            "booking_id": booking_id

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

        cursor.close()
        conn.close()

# =====================================================
# UPDATE PAYMENT
# =====================================================

@router.post("/update-payment")
def update_payment(
    data: PaymentRequest,
    user=Depends(verify_firebase_token)
):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        firebase_uid = user["uid"]

        db_user_id = get_db_user_id(
            firebase_uid
        )

        ensure_booking_workflow_columns(cursor)

        cursor.execute(
            """
            UPDATE bookings
            SET
                status = 'paid',
                payment_status = 'paid',
                updated_at = CURRENT_TIMESTAMP

            WHERE booking_id = %s
            AND user_id = %s
            AND status IN (
                'payment_pending',
                'approved'
            )
            """,
            (
                data.booking_id,
                db_user_id
            )
        )

        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Booking not found or not payable"
            )

        conn.commit()

        return {
            "message": "Payment successful"
        }

    finally:

        cursor.close()
        conn.close()

# =====================================================
# USER BOOKINGS
# =====================================================

@router.get("/my-bookings")
def get_my_bookings(
    user=Depends(verify_firebase_token)
):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        firebase_uid = user["uid"]

        db_user_id = get_db_user_id(
            firebase_uid
        )

        ensure_booking_workflow_columns(cursor)

        # =====================================================
        # IMPORTANT FIX
        # JOIN PACKAGE DATA
        # =====================================================

        cursor.execute(
            """
            SELECT

                b.id,
                b.booking_id,
                b.destination,
                b.name,
                b.email,
                b.phone,
                b.budget,
                b.days,
                b.status,
                b.payment_status,

                b.internal_notes,
                b.assigned_agent,

                COALESCE(
                    b.adjusted_price,
                    b.budget
                ) AS total_cost,

                b.created_at,

                b.package_id,
                b.travel_date,
                b.travelers,
                b.special_request,

                p.title,
                p.featured_image,
                p.duration,
                p.location,
                p.slug

            FROM bookings b

            LEFT JOIN packages p
            ON b.package_id = p.id

            WHERE b.user_id = %s

            ORDER BY b.id DESC
            """,
            (db_user_id,)
        )

        rows = cursor.fetchall()

        bookings = [

            {

                "id": r[0],

                "booking_id": r[1],

                "destination": r[2],

                "name": r[3],

                "email": r[4],

                "phone": r[5],

                "budget": r[6],

                "days": r[7],

                "status": r[8],

                "payment_status": r[9],

                "internal_notes": r[10],

                "assigned_agent": r[11],

                "total_cost": r[12],

                "created_at": str(r[13]),

                "package_id": r[14],

                "travel_date": r[15],

                "travelers": r[16],

                "special_request": r[17],

                # =====================================================
                # PACKAGE DATA
                # =====================================================

                "package_title": r[18],

                "package_image": r[19],

                "package_duration": r[20],

                "package_location": r[21],

                "package_slug": r[22],

            }

            for r in rows

        ]

        return {

            "bookings": bookings

        }

    finally:

        cursor.close()
        conn.close()

# =====================================================
# ADMIN BOOKINGS
# =====================================================

@router.get("/get-bookings")
def get_bookings(
    admin=Depends(get_current_user)
):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        ensure_booking_workflow_columns(cursor)

        cursor.execute(
            """
            SELECT

                b.id,
                b.booking_id,
                b.destination,
                b.name,
                b.email,
                b.phone,
                b.budget,
                b.days,
                b.status,
                b.payment_status,

                b.internal_notes,
                b.assigned_agent,

                COALESCE(
                    b.adjusted_price,
                    b.budget
                ) AS total_cost,

                b.created_at,

                b.package_id,
                b.travel_date,
                b.travelers,
                b.special_request,

                p.title,
                p.featured_image,
                p.duration,
                p.location,
                p.slug

            FROM bookings b

            LEFT JOIN packages p
            ON b.package_id = p.id

            ORDER BY b.id DESC
            """
        )

        rows = cursor.fetchall()

        bookings = [

            {

                "id": r[0],

                "booking_id": r[1],

                "destination": r[2],

                "name": r[3],

                "email": r[4],

                "phone": r[5],

                "budget": r[6],

                "days": r[7],

                "status": r[8],

                "payment_status": r[9],

                "internal_notes": r[10],

                "assigned_agent": r[11],

                "total_cost": r[12],

                "created_at": str(r[13]),

                "package_id": r[14],

                "travel_date": r[15],

                "travelers": r[16],

                "special_request": r[17],

                "package_title": r[18],

                "package_image": r[19],

                "package_duration": r[20],

                "package_location": r[21],

                "package_slug": r[22],

            }

            for r in rows

        ]

        return {

            "bookings": bookings

        }

    finally:

        cursor.close()
        conn.close()

# =====================================================
# SINGLE BOOKING DETAIL
# =====================================================

@router.get("/bookings/{booking_id}")
def get_booking_detail(
    booking_id: str,
    user=Depends(verify_firebase_token)
):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        db_user_id = get_db_user_id(
            user["uid"]
        )

        ensure_booking_workflow_columns(cursor)

        cursor.execute(
            """
            SELECT

                b.id,
                b.booking_id,
                b.destination,
                b.name,
                b.email,
                b.phone,
                b.budget,
                b.days,
                b.status,
                b.payment_status,

                b.internal_notes,
                b.assigned_agent,

                COALESCE(
                    b.adjusted_price,
                    b.budget
                ) AS total_cost,

                b.created_at,
                b.updated_at,

                b.package_id,
                b.travel_date,
                b.travelers,
                b.special_request,

                p.title,
                p.featured_image,
                p.duration,
                p.location,
                p.slug

            FROM bookings b

            LEFT JOIN packages p
            ON b.package_id = p.id

            WHERE b.booking_id = %s
            AND b.user_id = %s
            """,
            (
                booking_id,
                db_user_id
            )
        )

        row = cursor.fetchone()

        if not row:

            raise HTTPException(
                status_code=404,
                detail="Booking not found"
            )

        return {

            "booking": {

                "id": row[0],

                "booking_id": row[1],

                "destination": row[2],

                "name": row[3],

                "email": row[4],

                "phone": row[5],

                "budget": row[6],

                "days": row[7],

                "status": row[8],

                "payment_status": row[9],

                "internal_notes": row[10],

                "assigned_agent": row[11],

                "total_cost": row[12],

                "created_at": str(row[13]),

                "updated_at": (
                    str(row[14])
                    if row[14]
                    else None
                ),

                "package_id": row[15],

                "travel_date": row[16],

                "travelers": row[17],

                "special_request": row[18],

                "package_title": row[19],

                "package_image": row[20],

                "package_duration": row[21],

                "package_location": row[22],

                "package_slug": row[23],

            }

        }

    finally:

        cursor.close()
        conn.close()


# =====================================================
# ADMIN BOOKING STATUS UPDATE
# =====================================================

@router.put("/admin/bookings/{booking_id}/status")
def update_booking_status(
    booking_id: str,
    payload: dict,
    admin=Depends(get_current_user)
):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        new_status = payload.get("status")

        if not new_status:

            raise HTTPException(
                status_code=400,
                detail="Status is required"
            )

        if new_status not in VALID_BOOKING_STATUSES:

            raise HTTPException(
                status_code=400,
                detail="Invalid booking status"
            )

        ensure_booking_workflow_columns(cursor)

        # =====================================================
        # PAYMENT STATUS LOGIC
        # =====================================================

        payment_status = None

        if new_status == "payment_pending":

            payment_status = "pending"

        elif new_status == "paid":

            payment_status = "paid"

        elif new_status == "cancelled":

            payment_status = "cancelled"

        # =====================================================
        # UPDATE BOOKING
        # =====================================================

        if payment_status:

            cursor.execute(
                """
                UPDATE bookings

                SET
                    status = %s,
                    payment_status = %s,
                    updated_at = CURRENT_TIMESTAMP

                WHERE booking_id = %s
                """,
                (
                    new_status,
                    payment_status,
                    booking_id
                )
            )

        else:

            cursor.execute(
                """
                UPDATE bookings

                SET
                    status = %s,
                    updated_at = CURRENT_TIMESTAMP

                WHERE booking_id = %s
                """,
                (
                    new_status,
                    booking_id
                )
            )

        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Booking not found"
            )

        conn.commit()

        return {

            "success": True,

            "message": f"Booking updated to {new_status}"

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

        cursor.close()
        conn.close()
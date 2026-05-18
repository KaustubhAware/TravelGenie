from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.db import get_connection
from app.firebase_auth import verify_firebase_token
from app.routes.auth import get_current_user

import random

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
    notes: str | None = Field(default=None, max_length=1000)


class PaymentRequest(BaseModel):

    booking_id: str = Field(..., min_length=5, max_length=40)


def ensure_booking_workflow_columns(cursor):

    cursor.execute(
        """
        ALTER TABLE bookings
        ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) DEFAULT 'unpaid',
        ADD COLUMN IF NOT EXISTS internal_notes TEXT,
        ADD COLUMN IF NOT EXISTS assigned_agent VARCHAR(120),
        ADD COLUMN IF NOT EXISTS adjusted_price NUMERIC(12, 2),
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        """
    )


# ============================================
# =========== GENERATE BOOKING ID ============
# ============================================

def generate_booking_id():

    return f"TG-BOOK-{random.randint(10000,99999)}"


# ============================================
# ============ GET DATABASE USER ID ==========
# ============================================

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


# ============================================
# =============== SAVE BOOKING ===============
# ============================================

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

        if "@" not in data.email or "." not in data.email:

            raise HTTPException(
                status_code=422,
                detail="Invalid email address"
            )

        booking_id = generate_booking_id()

        name = f"{data.firstName} {data.lastName}".strip()

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
                status
                ,
                payment_status
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
                %s
                ,
                %s
            )
            """,
            (
                db_user_id,
                booking_id,
                data.destination,
                name,
                data.email,
                data.phone,
                data.budget,
                data.days,
                "pending",
                "unpaid"
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

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    finally:

        cursor.close()

        conn.close()


# ============================================
# ============== UPDATE PAYMENT ==============
# ============================================

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
            AND status IN ('payment_pending', 'approved')
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


# ============================================
# ============== USER BOOKINGS ===============
# ============================================

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

        cursor.execute(
            """
            SELECT
                id,
                booking_id,
                destination,
                name,
                email,
                phone,
                budget,
                days,
                status,
                payment_status,
                internal_notes,
                assigned_agent,
                COALESCE(adjusted_price, budget) AS total_cost,
                created_at

            FROM bookings

            WHERE user_id = %s

            ORDER BY id DESC
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
                "created_at": str(r[13])
            }

            for r in rows

        ]

        return {
            "bookings": bookings
        }

    finally:

        cursor.close()

        conn.close()


# ============================================
# ============= ADMIN BOOKINGS ===============
# ============================================

@router.get("/get-bookings")
def get_bookings(admin=Depends(get_current_user)):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        ensure_booking_workflow_columns(cursor)

        cursor.execute(
            """
            SELECT
                id,
                booking_id,
                destination,
                name,
                email,
                phone,
                budget,
                days,
                status,
                payment_status,
                internal_notes,
                assigned_agent,
                COALESCE(adjusted_price, budget) AS total_cost,
                created_at

            FROM bookings

            ORDER BY id DESC
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
                "created_at": str(r[13])
            }

            for r in rows

        ]

        return {
            "bookings": bookings
        }

    finally:

        cursor.close()

        conn.close()


@router.get("/bookings/{booking_id}")
def get_booking_detail(
    booking_id: str,
    user=Depends(verify_firebase_token)
):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        db_user_id = get_db_user_id(user["uid"])

        ensure_booking_workflow_columns(cursor)

        cursor.execute(
            """
            SELECT
                id,
                booking_id,
                destination,
                name,
                email,
                phone,
                budget,
                days,
                status,
                payment_status,
                internal_notes,
                assigned_agent,
                COALESCE(adjusted_price, budget) AS total_cost,
                created_at,
                updated_at
            FROM bookings
            WHERE booking_id = %s
            AND user_id = %s
            """,
            (booking_id, db_user_id)
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
                "updated_at": str(row[14]) if row[14] else None
            }
        }

    finally:

        cursor.close()

        conn.close()

from fastapi import APIRouter, Depends, HTTPException
from app.db import get_connection
from app.firebase_auth import verify_firebase_token
import random

router = APIRouter()

# ================= GENERATE BOOKING ID =================
def generate_booking_id():
    return f"TG-BOOK-{random.randint(10000,99999)}"


# ================= SAVE BOOKING =================
@router.post("/save-booking")
def save_booking(data: dict, user=Depends(verify_firebase_token)):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        user_id = user["uid"]
        booking_id = generate_booking_id()

        name = f"{data.get('firstName', '')} {data.get('lastName', '')}".strip()

        cursor.execute("""
            INSERT INTO bookings 
            (user_id, booking_id, destination, name, email, phone, budget, days, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user_id,
            booking_id,
            data.get("destination"),
            name,
            data.get("email"),
            data.get("phone"),
            data.get("budget"),
            data.get("days"),
            "pending"
        ))

        conn.commit()

        return {
            "message": "Booking saved",
            "booking_id": booking_id
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        cursor.close()
        conn.close()


# ================= UPDATE PAYMENT =================
@router.post("/update-payment")
def update_payment(data: dict, user=Depends(verify_firebase_token)):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE bookings
            SET status = 'paid'
            WHERE booking_id = %s AND user_id = %s
        """, (data.get("booking_id"), user["uid"]))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Booking not found")

        conn.commit()

        return {"message": "Payment successful"}

    finally:
        cursor.close()
        conn.close()


# ================= USER BOOKINGS =================
@router.get("/my-bookings")
def get_my_bookings(user=Depends(verify_firebase_token)):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT id, booking_id, destination, name, email, phone, budget, days, status, created_at
            FROM bookings 
            WHERE user_id = %s
            ORDER BY id DESC
        """, (user["uid"],))

        rows = cursor.fetchall()

        bookings = [{
            "id": r[0],
            "booking_id": r[1],
            "destination": r[2],
            "name": r[3],
            "email": r[4],
            "phone": r[5],
            "budget": r[6],
            "days": r[7],
            "status": r[8],
            "created_at": str(r[9])
        } for r in rows]

        return {"bookings": bookings}

    finally:
        cursor.close()
        conn.close()


# ================= ADMIN BOOKINGS =================
@router.get("/get-bookings")
def get_bookings():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT id, booking_id, destination, name, email, phone, budget, days, status, created_at 
            FROM bookings
            ORDER BY id DESC
        """)

        rows = cursor.fetchall()

        bookings = [{
            "id": r[0],
            "booking_id": r[1],
            "destination": r[2],
            "name": r[3],
            "email": r[4],
            "phone": r[5],
            "budget": r[6],
            "days": r[7],
            "status": r[8],
            "created_at": str(r[9])
        } for r in rows]

        return {"bookings": bookings}

    finally:
        cursor.close()
        conn.close()
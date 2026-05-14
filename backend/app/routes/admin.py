from fastapi import APIRouter, HTTPException

from app.db import get_connection

router = APIRouter(prefix="/admin")


# ============================================
# ================= STATS ====================
# ============================================

@router.get("/stats")
def get_stats():

    conn = get_connection()

    cursor = conn.cursor()

    try:

        # TOTAL BOOKINGS

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM bookings
            """
        )

        total = cursor.fetchone()[0]

        # PAID BOOKINGS

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM bookings
            WHERE status='paid'
            """
        )

        paid = cursor.fetchone()[0]

        # PENDING BOOKINGS

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM bookings
            WHERE status='pending'
            """
        )

        pending = cursor.fetchone()[0]

        # TOTAL REVENUE

        cursor.execute(
            """
            SELECT COALESCE(
                SUM(budget),
                0
            )

            FROM bookings

            WHERE status='paid'
            """
        )

        revenue = cursor.fetchone()[0]

        # TOTAL CLIENTS

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM users
            """
        )

        clients = cursor.fetchone()[0]

        return {

            "total": total,

            "paid": paid,

            "pending": pending,

            "revenue": revenue,

            "clients": clients

        }

    finally:

        cursor.close()

        conn.close()


# ============================================
# ============== REVENUE CHART ===============
# ============================================

@router.get("/revenue-by-date")
def revenue_by_date():

    conn = get_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT
                DATE(created_at),
                SUM(budget)

            FROM bookings

            WHERE status='paid'

            GROUP BY DATE(created_at)

            ORDER BY DATE(created_at)
            """
        )

        rows = cursor.fetchall()

        return {

            "data": [

                {
                    "date": str(r[0]),
                    "revenue": r[1]
                }

                for r in rows

            ]

        }

    finally:

        cursor.close()

        conn.close()


# ============================================
# ============ TOP DESTINATIONS ==============
# ============================================

@router.get("/top-destinations")
def top_destinations():

    conn = get_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT
                destination,
                COUNT(*) as count

            FROM bookings

            GROUP BY destination

            ORDER BY count DESC

            LIMIT 5
            """
        )

        rows = cursor.fetchall()

        return {

            "data": [

                {
                    "destination": r[0],
                    "count": r[1]
                }

                for r in rows

            ]

        }

    finally:

        cursor.close()

        conn.close()


# ============================================
# ============== UPDATE STATUS ===============
# ============================================

@router.post("/update-status")
def update_status(data: dict):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            UPDATE bookings
            SET status=%s
            WHERE booking_id=%s
            """,
            (
                data["status"],
                data["booking_id"]
            )
        )

        conn.commit()

        return {
            "message": "Updated"
        }

    finally:

        cursor.close()

        conn.close()


# ============================================
# ============= CANCEL BOOKING ===============
# ============================================

@router.post("/cancel-booking")
def cancel_booking(data: dict):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            DELETE FROM bookings
            WHERE booking_id=%s
            """,
            (data["booking_id"],)
        )

        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Booking not found"
            )

        conn.commit()

        return {
            "message": "Cancelled"
        }

    finally:

        cursor.close()

        conn.close()
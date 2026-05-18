from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.db import get_connection
from app.routes.auth import get_current_user

router = APIRouter(prefix="/admin")

VALID_STATUSES = {
    "pending",
    "under_review",
    "approved",
    "rejected",
    "payment_pending",
    "cancelled",
    "paid",
    "completed",
}


class BookingStatusRequest(BaseModel):

    booking_id: str = Field(..., min_length=5, max_length=40)
    status: str = Field(..., min_length=3, max_length=20)


class BookingActionRequest(BaseModel):

    booking_id: str = Field(..., min_length=5, max_length=40)


class BookingReviewRequest(BaseModel):

    booking_id: str = Field(..., min_length=5, max_length=40)
    decision: str = Field(..., min_length=3, max_length=30)
    internal_notes: str | None = Field(default="", max_length=1200)
    adjusted_price: float | None = Field(default=None, ge=0)
    assigned_agent: str | None = Field(default="", max_length=120)


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


def ensure_audit_tables(cursor):

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS activity_logs (
            id SERIAL PRIMARY KEY,
            actor VARCHAR(120),
            actor_role VARCHAR(40),
            action VARCHAR(120) NOT NULL,
            entity_type VARCHAR(80),
            entity_id VARCHAR(80),
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )


def write_activity(
    cursor,
    actor,
    action,
    entity_type,
    entity_id,
    metadata="{}",
):

    ensure_audit_tables(cursor)

    cursor.execute(
        """
        INSERT INTO activity_logs
        (
            actor,
            actor_role,
            action,
            entity_type,
            entity_id,
            metadata
        )
        VALUES (%s, %s, %s, %s, %s, %s::jsonb)
        """,
        (
            actor.get("sub", "admin"),
            "admin",
            action,
            entity_type,
            entity_id,
            metadata,
        )
    )


# ============================================
# ================= STATS ====================
# ============================================

@router.get("/stats")
def get_stats(admin=Depends(get_current_user)):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        # TOTAL BOOKINGS

        ensure_booking_workflow_columns(cursor)

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM bookings
            """
        )

        total = cursor.fetchone()[0]

        # APPROVED BOOKINGS

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM bookings
            WHERE status='approved'
            """
        )

        approved = cursor.fetchone()[0]

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

        # UNDER REVIEW BOOKINGS

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM bookings
            WHERE status='under_review'
            """
        )

        under_review = cursor.fetchone()[0]

        # PAYMENT PENDING BOOKINGS

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM bookings
            WHERE status='payment_pending'
            """
        )

        payment_pending = cursor.fetchone()[0]

        # COMPLETED BOOKINGS

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM bookings
            WHERE status='completed'
            """
        )

        completed = cursor.fetchone()[0]

        # CANCELLED BOOKINGS

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM bookings
            WHERE status='cancelled'
            """
        )

        cancelled = cursor.fetchone()[0]

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

            "approved": approved,

            "pending": pending,

            "under_review": under_review,

            "payment_pending": payment_pending,

            "cancelled": cancelled,

            "completed": completed,

            "revenue": revenue,

            "clients": clients,

            "cancellation_rate": round((cancelled / total) * 100, 2) if total else 0,

            "conversion_rate": round((paid / total) * 100, 2) if total else 0

        }

    finally:

        cursor.close()

        conn.close()


# ============================================
# ============== REVENUE CHART ===============
# ============================================

@router.get("/revenue-by-date")
def revenue_by_date(admin=Depends(get_current_user)):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        ensure_booking_workflow_columns(cursor)

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
def top_destinations(admin=Depends(get_current_user)):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        ensure_booking_workflow_columns(cursor)

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
def update_status(
    data: BookingStatusRequest,
    admin=Depends(get_current_user)
):

    status = data.status.lower().strip()

    if status not in VALID_STATUSES:

        raise HTTPException(
            status_code=400,
            detail="Invalid booking status"
        )

    conn = get_connection()

    cursor = conn.cursor()

    try:

        ensure_booking_workflow_columns(cursor)

        cursor.execute(
            """
            UPDATE bookings
            SET
                status=%s,
                payment_status = CASE
                    WHEN %s = 'payment_pending' THEN 'pending'
                    WHEN %s = 'paid' THEN 'paid'
                    ELSE payment_status
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE booking_id=%s
            """,
            (
                status,
                status,
                status,
                data.booking_id
            )
        )

        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Booking not found"
            )

        write_activity(
            cursor,
            admin,
            "booking_cancelled",
            "booking",
            data.booking_id
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
def cancel_booking(
    data: BookingActionRequest,
    admin=Depends(get_current_user)
):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        ensure_booking_workflow_columns(cursor)

        cursor.execute(
            """
            UPDATE bookings
            SET
                status='cancelled',
                updated_at=CURRENT_TIMESTAMP
            WHERE booking_id=%s
            """,
            (data.booking_id,)
        )

        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Booking not found"
            )

        write_activity(
            cursor,
            admin,
            "booking_reviewed",
            "booking",
            data.booking_id,
            f'{{"status":"{status}"}}'
        )

        conn.commit()

        return {
            "message": "Cancelled"
        }

    finally:

        cursor.close()

        conn.close()


@router.post("/review-booking")
def review_booking(
    data: BookingReviewRequest,
    admin=Depends(get_current_user)
):

    decision = data.decision.lower().strip()

    status_map = {
        "review": "under_review",
        "under_review": "under_review",
        "approve": "payment_pending",
        "approved": "payment_pending",
        "reject": "rejected",
        "rejected": "rejected",
        "complete": "completed",
        "completed": "completed",
    }

    status = status_map.get(decision)

    if not status:

        raise HTTPException(
            status_code=400,
            detail="Invalid review decision"
        )

    conn = get_connection()

    cursor = conn.cursor()

    try:

        ensure_booking_workflow_columns(cursor)

        cursor.execute(
            """
            UPDATE bookings
            SET
                status = %s,
                payment_status = CASE
                    WHEN %s = 'payment_pending' THEN 'pending'
                    WHEN %s = 'rejected' THEN 'not_required'
                    ELSE payment_status
                END,
                internal_notes = %s,
                assigned_agent = %s,
                adjusted_price = COALESCE(%s, adjusted_price),
                updated_at = CURRENT_TIMESTAMP
            WHERE booking_id = %s
            """,
            (
                status,
                status,
                status,
                data.internal_notes or "",
                data.assigned_agent or "",
                data.adjusted_price,
                data.booking_id
            )
        )

        if cursor.rowcount == 0:

            raise HTTPException(
                status_code=404,
                detail="Booking not found"
            )

        write_activity(
            cursor,
            admin,
            "booking_status_updated",
            "booking",
            data.booking_id,
            f'{{"status":"{status}"}}'
        )

        conn.commit()

        return {
            "message": "Booking review updated",
            "status": status
        }

    finally:

        cursor.close()

        conn.close()


@router.get("/bookings/{booking_id}")
def get_admin_booking_detail(
    booking_id: str,
    admin=Depends(get_current_user)
):

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
                created_at,
                updated_at
            FROM bookings
            WHERE booking_id = %s
            """,
            (booking_id,)
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


@router.get("/advanced-analytics")
def advanced_analytics(admin=Depends(get_current_user)):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        ensure_booking_workflow_columns(cursor)

        cursor.execute(
            """
            SELECT
                TO_CHAR(created_at, 'YYYY-MM') AS month,
                COUNT(*),
                COALESCE(
                    SUM(
                        CASE
                            WHEN status IN ('paid', 'completed')
                            THEN COALESCE(adjusted_price, budget)
                            ELSE 0
                        END
                    ),
                    0
                )
            FROM bookings
            GROUP BY TO_CHAR(created_at, 'YYYY-MM')
            ORDER BY month
            """
        )

        monthly = [
            {
                "month": row[0],
                "bookings": row[1],
                "revenue": row[2],
            }
            for row in cursor.fetchall()
        ]

        cursor.execute(
            """
            SELECT
                destination,
                COUNT(*) AS total,
                COALESCE(
                    SUM(
                        CASE
                            WHEN status IN ('paid', 'completed')
                            THEN COALESCE(adjusted_price, budget)
                            ELSE 0
                        END
                    ),
                    0
                ) AS revenue
            FROM bookings
            GROUP BY destination
            ORDER BY total DESC
            LIMIT 10
            """
        )

        destinations = [
            {
                "destination": row[0],
                "bookings": row[1],
                "revenue": row[2],
            }
            for row in cursor.fetchall()
        ]

        cursor.execute(
            """
            SELECT status, COUNT(*)
            FROM bookings
            GROUP BY status
            ORDER BY COUNT(*) DESC
            """
        )

        status_breakdown = [
            {
                "status": row[0],
                "count": row[1],
            }
            for row in cursor.fetchall()
        ]

        cursor.execute(
            """
            SELECT COUNT(DISTINCT user_id)
            FROM bookings
            """
        )

        customers_with_bookings = cursor.fetchone()[0]

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM users
            """
        )

        total_customers = cursor.fetchone()[0]

        retention_rate = round(
            (customers_with_bookings / total_customers) * 100,
            2
        ) if total_customers else 0

        return {
            "monthly": monthly,
            "destinations": destinations,
            "status_breakdown": status_breakdown,
            "retention_rate": retention_rate,
        }

    finally:

        cursor.close()

        conn.close()


@router.get("/activity-logs")
def activity_logs(admin=Depends(get_current_user)):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        ensure_audit_tables(cursor)

        cursor.execute(
            """
            SELECT
                actor,
                actor_role,
                action,
                entity_type,
                entity_id,
                created_at
            FROM activity_logs
            ORDER BY id DESC
            LIMIT 50
            """
        )

        return {
            "logs": [
                {
                    "actor": row[0],
                    "actor_role": row[1],
                    "action": row[2],
                    "entity_type": row[3],
                    "entity_id": row[4],
                    "created_at": str(row[5]),
                }
                for row in cursor.fetchall()
            ]
        }

    finally:

        cursor.close()

        conn.close()

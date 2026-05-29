import logging

from fastapi import APIRouter, Depends, HTTPException

from pydantic import BaseModel, Field

from app.auth.jwt_handler import get_current_user

from app.services.payment_service import (
    create_razorpay_order,
    verify_payment_signature,
)

from app.db import get_connection
from app.services.notification_service import create_notification
from app.services.email_service import send_email_async

router = APIRouter()
logger = logging.getLogger(__name__)

ACTIVE_PAYMENT_STATUSES = ("created", "attempted")


def _payment_order_payload(row):
    amount = float(row["amount"] or 0)
    return {
        "id": row["razorpay_order_id"],
        "amount": int(round(amount * 100)),
        "currency": row.get("currency") or "INR",
        "receipt": row["booking_id"],
        "status": row.get("status") or "created",
        "reused": True,
    }

# =====================================================
# REQUESTS
# =====================================================

class CreateOrderRequest(BaseModel):

    booking_id: str = Field(..., min_length=5, max_length=40)

    amount: float | None = Field(default=None, ge=0)


class VerifyPaymentRequest(BaseModel):

    booking_id: str = Field(..., min_length=5, max_length=40)

    razorpay_order_id: str

    razorpay_payment_id: str

    razorpay_signature: str


class FailedPaymentRequest(BaseModel):

    booking_id: str = Field(..., min_length=5, max_length=40)

    razorpay_order_id: str | None = None

    reason: str | None = None

# =====================================================
# CREATE ORDER
# =====================================================

@router.post("/create-order")
def create_order(
    data: CreateOrderRequest,
    user=Depends(get_current_user)
):

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT
                booking_id,
                payment_status,
                COALESCE(adjusted_price, total_amount, budget, 0) AS payable_amount
            FROM bookings
            WHERE booking_id = %s AND user_id = %s
            FOR UPDATE
            """,
            (data.booking_id, user["uid"]),
        )
        booking = cursor.fetchone()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        if booking[1] == "paid":
            raise HTTPException(status_code=409, detail="Booking is already paid")

        payable_amount = float(booking[2] or 0)
        if payable_amount <= 0:
            raise HTTPException(status_code=400, detail="Booking amount is invalid")

        cursor.execute(
            """
            SELECT
                booking_id,
                razorpay_order_id,
                amount,
                currency,
                status
            FROM payment_transactions
            WHERE booking_id = %s
            AND razorpay_order_id IS NOT NULL
            AND status IN ('created', 'attempted')
            ORDER BY created_at DESC, id DESC
            LIMIT 1
            FOR UPDATE
            """,
            (data.booking_id,),
        )
        existing_payment = cursor.fetchone()

        if existing_payment:
            cursor.execute(
                """
                UPDATE payment_transactions
                SET amount = %s,
                    currency = 'INR',
                    metadata = COALESCE(metadata, '{}'::jsonb)
                        || jsonb_build_object(
                            'last_reused_at', CURRENT_TIMESTAMP,
                            'reuse_reason', 'booking_active_order'
                        )
                WHERE razorpay_order_id = %s
                """,
                (payable_amount, existing_payment[1]),
            )
            conn.commit()
            existing_payment = {
                "booking_id": data.booking_id,
                "razorpay_order_id": existing_payment[1],
                "amount": payable_amount,
                "currency": "INR",
                "status": existing_payment[4],
            }
            return {
                "success": True,
                "order": _payment_order_payload(existing_payment),
                "reused": True,
            }

        order = create_razorpay_order(

            amount=payable_amount,

            receipt=data.booking_id,

        )

        cursor.execute(
            """
            INSERT INTO payment_transactions (
                booking_id, razorpay_order_id, amount, currency, status, metadata
            )
            VALUES (
                %s, %s, %s, 'INR', 'created',
                jsonb_build_object('created_for_booking', TRUE)
            )
            ON CONFLICT (razorpay_order_id) DO UPDATE
            SET status = 'created',
                booking_id = EXCLUDED.booking_id,
                amount = EXCLUDED.amount,
                currency = EXCLUDED.currency,
                metadata = COALESCE(payment_transactions.metadata, '{}'::jsonb)
                    || jsonb_build_object('last_idempotent_update_at', CURRENT_TIMESTAMP)
            """,
            (data.booking_id, order.get("id"), payable_amount),
        )
        conn.commit()

        return {

            "success": True,

            "order": order,

        }

    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        logger.warning("Payment order creation failed for %s: %s", data.booking_id, e)

        raise HTTPException(
            status_code=500,
            detail="Unable to create payment order. Please retry shortly."
        )
    finally:
        cursor.close()
        conn.close()

# =====================================================
# VERIFY PAYMENT
# =====================================================

@router.post("/verify-payment")
def verify_payment(
    data: VerifyPaymentRequest,
    user=Depends(get_current_user)
):

    verified = verify_payment_signature(

        data.razorpay_order_id,

        data.razorpay_payment_id,

        data.razorpay_signature,

    )

    if not verified:

        raise HTTPException(
            status_code=400,
            detail="Payment verification failed"
        )

    conn = get_connection()

    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT
                b.booking_id,
                b.payment_status,
                COALESCE(b.adjusted_price, b.total_amount, b.budget, 0) AS payable_amount,
                pt.id AS transaction_id,
                pt.razorpay_payment_id,
                pt.status AS transaction_status,
                b.email
            FROM bookings b
            LEFT JOIN payment_transactions pt
                ON pt.booking_id = b.booking_id
                AND pt.razorpay_order_id = %s
            WHERE b.booking_id = %s
            AND b.user_id = %s
            FOR UPDATE OF b
            """,
            (data.razorpay_order_id, data.booking_id, user["uid"]),
        )
        payment_context = cursor.fetchone()

        if not payment_context:
            raise HTTPException(status_code=404, detail="Booking not found")

        if (
            payment_context[1] == "paid"
            and payment_context[4] == data.razorpay_payment_id
        ):
            conn.commit()
            return {
                "success": True,
                "message": "Payment already verified",
            }

        if payment_context[1] == "paid":
            raise HTTPException(status_code=409, detail="Booking is already paid")

        if not payment_context[3]:
            cursor.execute(
                """
                INSERT INTO payment_transactions (
                    booking_id, razorpay_order_id, amount, currency, status, metadata
                )
                VALUES (%s, %s, %s, 'INR', 'created',
                        jsonb_build_object('created_during_verification', TRUE))
                ON CONFLICT (razorpay_order_id) DO UPDATE
                SET booking_id = EXCLUDED.booking_id,
                    amount = EXCLUDED.amount
                RETURNING id
                """,
                (
                    data.booking_id,
                    data.razorpay_order_id,
                    payment_context[2],
                ),
            )

        cursor.execute(
            """
            UPDATE bookings

            SET
                payment_status = 'paid',
                status = 'paid',
                total_amount = COALESCE(adjusted_price, total_amount, budget, 0),
                updated_at = CURRENT_TIMESTAMP

            WHERE booking_id = %s
            AND user_id = %s
            AND payment_status <> 'paid'
            """,
            (data.booking_id, user["uid"])
        )

        cursor.execute(
            """
            UPDATE payment_transactions
            SET razorpay_payment_id = %s,
                status = 'paid',
                failure_reason = NULL,
                metadata = COALESCE(metadata, '{}'::jsonb)
                    || jsonb_build_object('verified_at', CURRENT_TIMESTAMP)
            WHERE booking_id = %s
            AND razorpay_order_id = %s
            """,
            (
                data.razorpay_payment_id,
                data.booking_id,
                data.razorpay_order_id,
            ),
        )

        if cursor.rowcount == 0:
            cursor.execute(
                """
                INSERT INTO payment_transactions (
                    booking_id, razorpay_order_id, razorpay_payment_id,
                    amount, currency, status, metadata
                )
                SELECT booking_id, %s, %s, COALESCE(adjusted_price, total_amount, budget, 0),
                       'INR', 'paid', jsonb_build_object('verified_at', CURRENT_TIMESTAMP)
                FROM bookings
                WHERE booking_id = %s AND user_id = %s
                ON CONFLICT (razorpay_payment_id) DO UPDATE
                SET status = 'paid',
                    booking_id = EXCLUDED.booking_id,
                    razorpay_order_id = EXCLUDED.razorpay_order_id,
                    amount = EXCLUDED.amount,
                    currency = EXCLUDED.currency,
                    metadata = COALESCE(payment_transactions.metadata, '{}'::jsonb)
                        || jsonb_build_object('duplicate_verify_at', CURRENT_TIMESTAMP)
                """,
                (
                    data.razorpay_order_id,
                    data.razorpay_payment_id,
                    data.booking_id,
                    user["uid"],
            ),
        )

        create_notification(
            cursor,
            user["uid"],
            "Payment successful",
            f"Your payment for booking {data.booking_id} is confirmed.",
            "payment_success",
            metadata={
                "booking_id": data.booking_id,
                "razorpay_order_id": data.razorpay_order_id,
                "razorpay_payment_id": data.razorpay_payment_id,
            },
        )

        send_email_async(
            payment_context[6],
            "TravelGenie payment confirmed",
            (
                f"Your payment for booking {data.booking_id} has been verified.\n\n"
                "Thank you for booking with TravelGenie."
            ),
        )

        conn.commit()

        return {

            "success": True,

            "message": "Payment verified successfully",

        }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as exc:
        conn.rollback()
        logger.warning("Payment verification failed for %s: %s", data.booking_id, exc)
        raise HTTPException(
            status_code=500,
            detail="Payment verification could not be completed. Please contact support if amount was debited.",
        ) from exc

    finally:

        cursor.close()
        conn.close()


@router.post("/payment-failed")
def mark_payment_failed(
    data: FailedPaymentRequest,
    user=Depends(get_current_user),
):

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT b.payment_status
            FROM bookings b
            WHERE b.booking_id = %s
            AND b.user_id = %s
            FOR UPDATE
            """,
            (data.booking_id, user["uid"]),
        )
        booking = cursor.fetchone()

        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")

        if booking[0] == "paid":
            conn.commit()
            return {
                "success": True,
                "message": "Booking is already paid",
            }

        cursor.execute(
            """
            UPDATE bookings
            SET payment_status = 'failed',
                status = CASE
                    WHEN status = 'paid' THEN status
                    ELSE 'payment_pending'
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE booking_id = %s
            AND user_id = %s
            """,
            (data.booking_id, user["uid"]),
        )

        cursor.execute(
            """
            INSERT INTO payment_transactions (
                booking_id, razorpay_order_id, amount, currency,
                status, failure_reason, metadata
            )
            SELECT booking_id, %s, COALESCE(adjusted_price, total_amount, budget, 0),
                   'INR', 'failed', %s, jsonb_build_object('failed_at', CURRENT_TIMESTAMP)
            FROM bookings
            WHERE booking_id = %s AND user_id = %s
            ON CONFLICT (razorpay_order_id) DO UPDATE
            SET status = 'failed',
                failure_reason = EXCLUDED.failure_reason,
                metadata = COALESCE(payment_transactions.metadata, '{}'::jsonb)
                    || jsonb_build_object('last_failed_at', CURRENT_TIMESTAMP)
            """,
            (data.razorpay_order_id, data.reason, data.booking_id, user["uid"]),
        )

        create_notification(
            cursor,
            user["uid"],
            "Payment failed",
            f"Payment for booking {data.booking_id} could not be completed. Please retry or contact support.",
            "payment_failed",
            metadata={
                "booking_id": data.booking_id,
                "reason": data.reason,
            },
        )

        conn.commit()

        return {
            "success": True,
            "message": "Payment failure recorded",
        }

    except HTTPException:
        conn.rollback()
        raise
    except Exception as exc:
        conn.rollback()
        logger.warning("Payment failure recording failed for %s: %s", data.booking_id, exc)
        raise HTTPException(
            status_code=500,
            detail="Unable to record payment status. Please retry.",
        ) from exc
    finally:
        cursor.close()
        conn.close()

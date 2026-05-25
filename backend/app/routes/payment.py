from fastapi import APIRouter, Depends, HTTPException

from pydantic import BaseModel

from app.firebase_auth import verify_firebase_token

from app.services.payment_service import (
    create_razorpay_order,
    verify_payment_signature,
)

from app.db import get_connection

router = APIRouter()

# =====================================================
# REQUESTS
# =====================================================

class CreateOrderRequest(BaseModel):

    booking_id: str

    amount: float


class VerifyPaymentRequest(BaseModel):

    booking_id: str

    razorpay_order_id: str

    razorpay_payment_id: str

    razorpay_signature: str

# =====================================================
# CREATE ORDER
# =====================================================

@router.post("/create-order")
def create_order(
    data: CreateOrderRequest,
    user=Depends(verify_firebase_token)
):

    try:

        order = create_razorpay_order(

            amount=data.amount,

            receipt=data.booking_id,

        )

        return {

            "success": True,

            "order": order,

        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

# =====================================================
# VERIFY PAYMENT
# =====================================================

@router.post("/verify-payment")
def verify_payment(
    data: VerifyPaymentRequest,
    user=Depends(verify_firebase_token)
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
            UPDATE bookings

            SET
                payment_status = 'paid',
                status = 'paid',
                updated_at = CURRENT_TIMESTAMP

            WHERE booking_id = %s
            """,
            (data.booking_id,)
        )

        conn.commit()

        return {

            "success": True,

            "message": "Payment verified successfully",

        }

    finally:

        cursor.close()
        conn.close()
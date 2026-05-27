import logging

import razorpay
from fastapi import HTTPException

from app.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

# =====================================================
# RAZORPAY CLIENT
# =====================================================

razorpay_client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET,
    )
)

# =====================================================
# CREATE ORDER
# =====================================================

def create_razorpay_order(
    amount: float,
    receipt: str,
):

    """
    amount = rupees
    razorpay expects paise
    """

    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=503,
            detail="Razorpay test keys are not configured",
        )

    order_data = {

        "amount": int(amount * 100),

        "currency": "INR",

        "receipt": receipt,

        "payment_capture": 1,

    }

    try:
        order = razorpay_client.order.create(
            data=order_data
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.warning("Razorpay order creation failed: %s", exc)
        raise HTTPException(
            status_code=502,
            detail="Razorpay order creation failed. Please retry shortly.",
        ) from exc

    return order

# =====================================================
# VERIFY PAYMENT
# =====================================================

def verify_payment_signature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
):

    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=503,
            detail="Razorpay test keys are not configured",
        )

    try:

        razorpay_client.utility.verify_payment_signature(
            {
                "razorpay_order_id":
                    razorpay_order_id,

                "razorpay_payment_id":
                    razorpay_payment_id,

                "razorpay_signature":
                    razorpay_signature,
            }
        )

        return True

    except Exception:

        return False

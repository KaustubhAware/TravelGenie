import razorpay

from app.config import get_settings

settings = get_settings()

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

    order_data = {

        "amount": int(amount * 100),

        "currency": "INR",

        "receipt": receipt,

        "payment_capture": 1,

    }

    order = razorpay_client.order.create(
        data=order_data
    )

    return order

# =====================================================
# VERIFY PAYMENT
# =====================================================

def verify_payment_signature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
):

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
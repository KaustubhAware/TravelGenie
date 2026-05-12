from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.db import get_connection
from app.firebase_auth import verify_firebase_token

router = APIRouter(prefix="/profile")


# ============================================
# ================= MODEL ====================
# ============================================

class ProfileRequest(BaseModel):

    full_name: str

    phone: str

    city: str

    country: str

    preferences: str


# ============================================
# ============== SAVE PROFILE ================
# ============================================

@router.post("/save")
def save_profile(
    data: ProfileRequest,
    user=Depends(verify_firebase_token)
):

    uid = user["uid"]

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE users
        SET
            full_name = %s,
            phone = %s,
            city = %s,
            country = %s,
            preferences = %s,
            profile_completed = TRUE
        WHERE firebase_uid = %s
        """,
        (
            data.full_name,
            data.phone,
            data.city,
            data.country,
            data.preferences,
            uid
        )
    )

    conn.commit()

    cursor.close()

    conn.close()

    return {
        "message": "Profile saved successfully"
    }
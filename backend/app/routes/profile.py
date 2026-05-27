from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.db import get_connection
from app.auth.jwt_handler import get_current_user

router = APIRouter(prefix="/profile")


# ============================================
# ================= MODEL ====================
# ============================================

class ProfileRequest(BaseModel):

    full_name: str | None = None

    phone: str | None = None

    city: str | None = None

    country: str | None = None

    preferences: str | None = None

    emergency_contact: str | None = None

    travel_preferences: list[str] | None = None

    profile_image: str | None = None


@router.get("/me")
def get_profile(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT
                id, email, full_name, phone, emergency_contact,
                city, country, preferences, travel_preferences,
                profile_image, profile_completed
            FROM users
            WHERE id = %s
            """,
            (user["uid"],),
        )
        row = cursor.fetchone()
        if not row:
            return {"profile": None}

        return {
            "profile": {
                "id": row[0],
                "email": row[1],
                "full_name": row[2],
                "phone": row[3],
                "emergency_contact": row[4],
                "city": row[5],
                "country": row[6],
                "preferences": row[7],
                "travel_preferences": row[8] or [],
                "profile_image": row[9],
                "profile_completed": row[10],
            }
        }
    finally:
        cursor.close()
        conn.close()


# ============================================
# ============== SAVE PROFILE ================
# ============================================

@router.post("/save")
def save_profile(
    data: ProfileRequest,
    user=Depends(get_current_user)
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
            emergency_contact = %s,
            travel_preferences = %s::jsonb,
            profile_image = %s,
            profile_completed = TRUE
        WHERE id = %s
        """,
        (
            data.full_name,
            data.phone,
            data.city,
            data.country,
            data.preferences,
            data.emergency_contact,
            __import__("json").dumps(data.travel_preferences or []),
            data.profile_image,
            uid
        )
    )

    conn.commit()

    cursor.close()

    conn.close()

    return {
        "message": "Profile saved successfully"
    }

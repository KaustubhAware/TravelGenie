from fastapi import APIRouter, Depends
from app.db import get_connection
from app.firebase_auth import verify_firebase_token

router = APIRouter()


# ============================================
# ============ GET DB USER ID ================
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
            return None

        return user[0]

    finally:

        cursor.close()

        conn.close()


# ============================================
# ============ SAVE ITINERARY ================
# ============================================

@router.post("/save-itinerary")
def save_itinerary(
    data: dict,
    user=Depends(verify_firebase_token)
):

    firebase_uid = user["uid"]

    db_user_id = get_db_user_id(
        firebase_uid
    )

    conn = get_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO saved_itineraries
            (
                user_id,
                destination,
                budget,
                days,
                preferences,
                itinerary
            )

            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            """,
            (
                db_user_id,
                data.get("destination"),
                data.get("budget"),
                data.get("days"),
                data.get("preferences"),
                data.get("itinerary")
            )
        )

        conn.commit()

        return {
            "message": "Itinerary saved"
        }

    finally:

        cursor.close()

        conn.close()


# ============================================
# ============ GET SAVED TRIPS ===============
# ============================================

@router.get("/my-itineraries")
def get_itineraries(
    user=Depends(verify_firebase_token)
):

    firebase_uid = user["uid"]

    db_user_id = get_db_user_id(
        firebase_uid
    )

    conn = get_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT
                id,
                destination,
                budget,
                days,
                preferences,
                itinerary,
                created_at

            FROM saved_itineraries

            WHERE user_id = %s

            ORDER BY id DESC
            """,
            (db_user_id,)
        )

        rows = cursor.fetchall()

        trips = [

            {
                "id": r[0],
                "destination": r[1],
                "budget": r[2],
                "days": r[3],
                "preferences": r[4],
                "itinerary": r[5],
                "created_at": str(r[6])
            }

            for r in rows

        ]

        return {
            "trips": trips
        }

    finally:

        cursor.close()

        conn.close()
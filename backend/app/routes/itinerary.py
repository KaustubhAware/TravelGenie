from fastapi import APIRouter, Depends, HTTPException
from app.db import get_connection
import json

from app.auth.jwt_handler import get_current_user
from app.services.notification_service import create_notification

router = APIRouter()


# ============================================
# ============ GET DB USER ID ================
# ============================================

def get_db_user_id(user_id):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE id = %s
            """,
            (user_id,)
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
    user=Depends(get_current_user)
):

    user_id = user["uid"]

    db_user_id = get_db_user_id(
        user_id
    )

    conn = get_connection()

    cursor = conn.cursor()

    try:

        if not db_user_id:
            raise HTTPException(status_code=404, detail="User not found")

        itinerary_json = json.dumps(data.get("itinerary", []))

        cursor.execute(
            """
            INSERT INTO trips
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
            RETURNING id
            """,
            (
                db_user_id,
                data.get("destination"),
                data.get("budget"),
                data.get("days"),
                data.get("preferences"),
                itinerary_json
            )
        )

        trip_id = cursor.fetchone()[0]

        cursor.execute(
            """
            INSERT INTO saved_itineraries (
                user_id,
                trip_id,
                destination,
                budget,
                days,
                preferences,
                itinerary,
                metadata,
                created_at,
                updated_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, NOW(), NOW())
            """,
            (
                db_user_id,
                trip_id,
                data.get("destination"),
                data.get("budget"),
                data.get("days"),
                data.get("preferences"),
                itinerary_json,
                json.dumps({"source": "save-itinerary"}),
            ),
        )

        create_notification(
            cursor,
            db_user_id,
            "AI itinerary saved",
            f"Your {data.get('destination')} itinerary is now available in Saved AI Itineraries.",
            "itinerary_saved",
            metadata={
                "trip_id": trip_id,
                "destination": data.get("destination"),
            },
        )

        conn.commit()

        return {"message": "Trip saved"}

    finally:

        cursor.close()

        conn.close()


# ============================================
# ============ GET SAVED TRIPS ===============
# ============================================

@router.get("/my-itineraries")
def get_itineraries(
    user=Depends(get_current_user)
):

    user_id = user["uid"]

    db_user_id = get_db_user_id(
        user_id
    )

    conn = get_connection()

    cursor = conn.cursor()

    try:

        if not db_user_id:
            raise HTTPException(status_code=404, detail="User not found")

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

            FROM trips

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

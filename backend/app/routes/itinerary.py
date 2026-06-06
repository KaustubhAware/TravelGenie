from fastapi import APIRouter, Depends, HTTPException
from app.db import get_connection
import json

from app.auth.jwt_handler import get_current_user
from app.services.notification_service import create_notification

router = APIRouter()


def _json_value(value, fallback):
    if value is None:
        return fallback
    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return fallback
    return value


def _itinerary_payload(row):
    item = dict(row) if hasattr(row, "keys") else {
        "id": row[0],
        "trip_id": row[1],
        "destination": row[2],
        "budget": row[3],
        "days": row[4],
        "preferences": row[5],
        "itinerary": row[6],
        "metadata": row[7],
        "created_at": row[8],
        "updated_at": row[9],
    }
    item["itinerary"] = _json_value(item.get("itinerary"), [])
    item["metadata"] = _json_value(item.get("metadata"), {})
    item["title"] = item["metadata"].get("title") or item.get("destination") or "Saved itinerary"
    item["created_at"] = str(item["created_at"]) if item.get("created_at") else None
    item["updated_at"] = str(item["updated_at"]) if item.get("updated_at") else None
    return item


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
                json.dumps({
                    "source": "save-itinerary",
                    **(data.get("metadata") if isinstance(data.get("metadata"), dict) else {}),
                }),
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
                id, trip_id, destination, budget, days, preferences,
                itinerary, metadata, created_at, updated_at
            FROM saved_itineraries
            WHERE user_id = %s
            ORDER BY updated_at DESC, id DESC
            """,
            (db_user_id,)
        )

        trips = [_itinerary_payload(row) for row in cursor.fetchall()]

        return {
            "trips": trips
        }

    finally:

        cursor.close()

        conn.close()


@router.get("/my-itineraries/{itinerary_id}")
def get_itinerary_detail(
    itinerary_id: int,
    user=Depends(get_current_user),
):
    user_id = user["uid"]
    db_user_id = get_db_user_id(user_id)
    conn = get_connection()
    cursor = conn.cursor()

    try:
        if not db_user_id:
            raise HTTPException(status_code=404, detail="User not found")

        cursor.execute(
            """
            SELECT
                id, trip_id, destination, budget, days, preferences,
                itinerary, metadata, created_at, updated_at
            FROM saved_itineraries
            WHERE id = %s AND user_id = %s
            LIMIT 1
            """,
            (itinerary_id, db_user_id),
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Saved itinerary not found")

        return {"trip": _itinerary_payload(row)}
    finally:
        cursor.close()
        conn.close()


@router.put("/my-itineraries/{itinerary_id}")
def rename_itinerary(
    itinerary_id: int,
    data: dict,
    user=Depends(get_current_user),
):
    title = str(data.get("title") or "").strip()
    if not title:
        raise HTTPException(status_code=400, detail="Title is required")

    user_id = user["uid"]
    db_user_id = get_db_user_id(user_id)
    conn = get_connection()
    cursor = conn.cursor()

    try:
        if not db_user_id:
            raise HTTPException(status_code=404, detail="User not found")

        cursor.execute(
            """
            UPDATE saved_itineraries
            SET metadata = COALESCE(metadata, '{}'::jsonb) || %s::jsonb,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s AND user_id = %s
            """,
            (json.dumps({"title": title}), itinerary_id, db_user_id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Saved itinerary not found")
        conn.commit()
        return {"message": "Saved itinerary renamed"}
    except HTTPException:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()


@router.delete("/my-itineraries/{itinerary_id}")
def delete_itinerary(
    itinerary_id: int,
    user=Depends(get_current_user),
):
    user_id = user["uid"]
    db_user_id = get_db_user_id(user_id)
    conn = get_connection()
    cursor = conn.cursor()

    try:
        if not db_user_id:
            raise HTTPException(status_code=404, detail="User not found")

        cursor.execute(
            """
            DELETE FROM saved_itineraries
            WHERE id = %s AND user_id = %s
            """,
            (itinerary_id, db_user_id),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Saved itinerary not found")
        conn.commit()
        return {"message": "Saved itinerary deleted"}
    except HTTPException:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

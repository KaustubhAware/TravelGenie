
from fastapi import APIRouter, Depends

from app.db import get_connection

from app.auth.jwt_handler import get_current_user

from app.ml.recommendation import recommend

from app.ml.predict_cost import predict_cost

from app.ml.sentiment import analyze_sentiment

from app.ml.ai_itinerary_generator import (
    generate_ai_itinerary
)

from app.ml.itinerary_parser import (
    parse_itinerary_response
)

from app.services.notification_service import create_notification

import json

router = APIRouter()


def _positive_number(value):
    if value in (None, ""):
        return None

    try:
        numeric = float(str(value).replace(",", "").strip())
    except (TypeError, ValueError):
        return None

    return numeric if numeric > 0 else None


def _budget_breakdown_has_value(breakdown):
    if not isinstance(breakdown, dict):
        return False

    return any(_positive_number(value) is not None for value in breakdown.values())


# =====================================================
# GENERATE TRIP
# =====================================================

@router.post("/generate-trip")
def generate_trip(data: dict):

    # =====================================================
    # GET DATA
    # =====================================================

    destination = data.get(
        "destination",
        ""
    )

    budget = data.get(
        "budget",
        0
    )

    requested_budget = _positive_number(budget)

    preferences = data.get(
        "preferences",
        []
    )

    # =====================================================
    # CONVERT PREFERENCES
    # =====================================================

    if isinstance(
        preferences,
        list
    ):

        preferences_text = ", ".join(
            preferences
        )

    else:

        preferences_text = str(
            preferences
        )

    # =====================================================
    # ML FEATURES
    # =====================================================

    recommended_places = recommend(
        destination
    )

    estimated_cost = predict_cost(
        destination
    )

    sentiment = analyze_sentiment(
        preferences_text
    )

    try:
        raw_text = generate_ai_itinerary(
            data
        )
    except ValueError as exc:
        from fastapi.responses import JSONResponse
        from app.responses import error_response
        return JSONResponse(
            status_code=400,
            content=error_response(
                message=str(exc),
                error="ConfigError",
                detail=str(exc),
            )
        )
    except RuntimeError as exc:
        from fastapi.responses import JSONResponse
        from app.responses import error_response
        lowered = str(exc).lower()
        status_code = 429 if "quota" in lowered else 503
        return JSONResponse(
            status_code=status_code,
            content=error_response(
                message=(
                    "AI trip planning is temporarily unavailable. "
                    "Please try again shortly."
                ),
                error="AIServiceError",
                detail=str(exc),
            )
        )

    # =====================================================
    # PARSE RESPONSE
    # =====================================================

    parsed_data = parse_itinerary_response(
        raw_text
    )

    parsed_estimated_cost = _positive_number(
        parsed_data.get("estimated_cost")
    )
    final_estimated_cost = requested_budget or parsed_estimated_cost or estimated_cost
    parsed_breakdown = parsed_data.get("budget_breakdown", {})
    fallback_breakdown = {}

    if final_estimated_cost:
        fallback_breakdown = {
            "hotel": int(final_estimated_cost * 0.4),
            "food": int(final_estimated_cost * 0.25),
            "transport": int(final_estimated_cost * 0.2),
            "activities": int(final_estimated_cost * 0.1),
            "emergency": int(final_estimated_cost * 0.05),
        }

    final_budget_breakdown = (
        parsed_breakdown
        if _budget_breakdown_has_value(parsed_breakdown)
        else fallback_breakdown
    )

    # =====================================================
    # RETURN FINAL RESPONSE
    # =====================================================

    return {

        # =====================================================
        # AI ITINERARY
        # =====================================================

        "itinerary":
            parsed_data.get(
                "itinerary",
                []
            ),

        "trip_summary":
            parsed_data.get(
                "trip_summary",
                {}
            ),

        # =====================================================
        # RECOMMENDED PLACES
        # =====================================================

        "recommended_places":
            parsed_data.get(
                "recommended_places",
                recommended_places
            ),

        # =====================================================
        # ESTIMATED COST
        # =====================================================

        "estimated_cost":
            final_estimated_cost,

        "requested_budget":
            requested_budget,

        # =====================================================
        # SENTIMENT
        # =====================================================

        "sentiment":
            parsed_data.get(
                "sentiment",
                sentiment
            ),

        # =====================================================
        # BUDGET BREAKDOWN
        # =====================================================

        "budget_breakdown":
            final_budget_breakdown,

        # =====================================================
        # TRAVEL TIPS
        # =====================================================

        "travel_tips":
            parsed_data.get(
                "travel_tips",
                [

                    "Carry ID proof and travel documents",

                    "Book hotels in advance",

                    "Keep emergency cash",

                    "Check local weather before travel",
                ]
            ),

        # =====================================================
        # HOTEL RECOMMENDATIONS
        # =====================================================

        "hotel_recommendations":
            parsed_data.get(
                "hotel_recommendations",
                []
            ),

        # =====================================================
        # RESTAURANT RECOMMENDATIONS
        # =====================================================

        "restaurant_recommendations":
            parsed_data.get(
                "restaurant_recommendations",
                []
            ),

        # =====================================================
        # WEATHER
        # =====================================================

        "weather":
            parsed_data.get(
                "weather",
                {}
            ),

        "packing_list":
            parsed_data.get(
                "packing_list",
                []
            ),

        "safety_notes":
            parsed_data.get(
                "safety_notes",
                []
            ),

        "hotels":
            parsed_data.get(
                "hotel_recommendations",
                []
            ),

        "restaurants":
            parsed_data.get(
                "restaurant_recommendations",
                []
            )
    }


# =====================================================
# SAVE TRIP
# =====================================================

@router.post("/save-trip")
def save_trip(
    data: dict,
    user=Depends(
        get_current_user
    )
):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO trips
            (
                user_id,
                destination,
                budget,
                days,
                preferences,
                cost,
                sentiment,
                itinerary
            )

            VALUES
            (
                %s,
                %s,
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
                user["uid"],
                data.get("destination"),
                data.get("budget"),
                data.get("days"),
                data.get("preferences"),
                data.get("cost"),
                data.get("sentiment"),
                json.dumps(
                    data.get(
                        "itinerary",
                        []
                    )
                )
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
                user["uid"],
                trip_id,
                data.get("destination"),
                data.get("budget"),
                data.get("days"),
                data.get("preferences"),
                json.dumps(data.get("itinerary", [])),
                json.dumps({
                    "source": "save-trip",
                    **(data.get("metadata") if isinstance(data.get("metadata"), dict) else {}),
                }),
            ),
        )

        create_notification(
            cursor,
            user["uid"],
            "AI itinerary saved",
            f"Your {data.get('destination')} itinerary is now available in Saved AI Itineraries.",
            "itinerary_saved",
            metadata={
                "trip_id": trip_id,
                "destination": data.get("destination"),
            },
        )

        conn.commit()

        return {

            "message":
                "Trip saved"

        }

    finally:

        cursor.close()

        conn.close()


# =====================================================
# GET TRIPS
# =====================================================

@router.get("/get-trips")
def get_trips(
    user=Depends(
        get_current_user
    )
):

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
                cost,
                sentiment,
                itinerary,
                created_at

            FROM trips

            WHERE user_id = %s

            ORDER BY id DESC
            """,
            (user["uid"],)
        )

        rows = cursor.fetchall()

        trips = []

        for row in rows:

            trips.append({

                "id":
                    row[0],

                "destination":
                    row[1],

                "budget":
                    row[2],

                "days":
                    row[3],

                "preferences":
                    row[4],

                "cost":
                    row[5],

                "sentiment":
                    row[6],

                "itinerary":
                    json.loads(
                        row[7]
                    )
                    if isinstance(
                        row[7],
                        str
                    )
                    else row[7],

                "created_at":
                    str(row[8])

            })

        return {

            "trips":
                trips

        }

    finally:

        cursor.close()

        conn.close()


# =====================================================
# DELETE TRIP
# =====================================================

@router.delete("/delete-trip/{trip_id}")
def delete_trip(
    trip_id: int,
    user=Depends(
        get_current_user
    )
):

    conn = get_connection()

    cursor = conn.cursor()

    try:

        cursor.execute(
            """
            DELETE FROM trips

            WHERE id = %s
            AND user_id = %s
            """,
            (
                trip_id,
                user["uid"]
            )
        )

        conn.commit()

        return {

            "message":
                "Trip deleted"

        }

    finally:

        cursor.close()

        conn.close()


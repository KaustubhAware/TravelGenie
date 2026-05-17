
from fastapi import APIRouter, Depends

from app.db import get_connection

from app.firebase_auth import verify_firebase_token

from app.ml.recommendation import recommend

from app.ml.predict_cost import predict_cost

from app.ml.sentiment import analyze_sentiment

from app.ml.ai_itinerary_generator import (
    generate_ai_itinerary
)

from app.ml.itinerary_parser import (
    parse_itinerary_response
)

import json

router = APIRouter()


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

    # =====================================================
    # GENERATE AI RESPONSE
    # =====================================================

    raw_text = generate_ai_itinerary(
        data
    )

    # =====================================================
    # PARSE RESPONSE
    # =====================================================

    parsed_data = parse_itinerary_response(
        raw_text
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
            parsed_data.get(
                "estimated_cost",
                estimated_cost
            ),

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
            parsed_data.get(
                "budget_breakdown",
                {

                    "hotel":
                        int(
                            estimated_cost * 0.4
                        ),

                    "food":
                        int(
                            estimated_cost * 0.25
                        ),

                    "transport":
                        int(
                            estimated_cost * 0.2
                        ),

                    "activities":
                        int(
                            estimated_cost * 0.1
                        ),

                    "emergency":
                        int(
                            estimated_cost * 0.05
                        ),
                }
            ),

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
            )
    }


# =====================================================
# SAVE TRIP
# =====================================================

@router.post("/save-trip")
def save_trip(
    data: dict,
    user=Depends(
        verify_firebase_token
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
        verify_firebase_token
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
        verify_firebase_token
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


# =====================================================
# ITINERARY PARSER
# =====================================================

import json
import re

# =====================================================
# DEFAULT RESPONSE
# =====================================================

DEFAULT_RESPONSE = {

    "itinerary": [],

    "recommended_places": [],

    "estimated_cost": 0,

    "sentiment": "Neutral",

    "budget_breakdown": {},

    "travel_tips": [],

    "hotel_recommendations": [],

    "restaurant_recommendations": [],

    "weather": {},

    "crowd_insights": []
}

# =====================================================
# PARSE RESPONSE
# =====================================================

def parse_itinerary_response(text):

    try:

        # =====================================================
        # EMPTY CHECK
        # =====================================================

        if not text:

            return DEFAULT_RESPONSE

        # =====================================================
        # CLEAN MARKDOWN
        # =====================================================

        cleaned = re.sub(
            r"```json|```",
            "",
            text
        ).strip()

        print("=" * 40)
        print("CLEANED RESPONSE")
        print("=" * 40)
        print(cleaned)

        # =====================================================
        # LOAD JSON
        # =====================================================

        data = json.loads(cleaned)

        # =====================================================
        # SAFE RESPONSE
        # =====================================================

        response = {

            "itinerary": data.get(
                "itinerary",
                []
            ),

            "recommended_places": data.get(
                "recommended_places",
                []
            ),

            "estimated_cost": data.get(
                "estimated_cost",
                0
            ),

            "sentiment": data.get(
                "sentiment",
                "Neutral"
            ),

            "budget_breakdown": data.get(
                "budget_breakdown",
                {}
            ),

            "travel_tips": data.get(
                "travel_tips",
                []
            ),

            # =====================================================
            # HOTELS
            # =====================================================

            "hotel_recommendations": data.get(
                "hotel_recommendations",
                []
            ),

            # =====================================================
            # RESTAURANTS
            # =====================================================

            "restaurant_recommendations": data.get(
                "restaurant_recommendations",
                []
            ),

            # =====================================================
            # WEATHER
            # =====================================================

            "weather": data.get(
                "weather",
                {}
            ),

            # =====================================================
            # CROWD INSIGHTS
            # =====================================================

            "crowd_insights": data.get(
                "crowd_insights",
                []
            )
        }

        print("=" * 40)
        print("FINAL PARSED RESPONSE")
        print("=" * 40)
        print(response)

        return response

    # =====================================================
    # ERROR
    # =====================================================

    except Exception as e:

        print("=" * 40)
        print("PARSER ERROR")
        print("=" * 40)
        print(e)

        return DEFAULT_RESPONSE
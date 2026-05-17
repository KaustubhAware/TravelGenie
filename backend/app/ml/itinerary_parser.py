
# =====================================================
# ITINERARY PARSER
# =====================================================

import json
import re

# =====================================================
# PARSE RESPONSE
# =====================================================

def parse_itinerary_response(text):

    try:

        # =====================================================
        # EMPTY CHECK
        # =====================================================

        if not text:

            return {

                "itinerary": [],

                "recommended_places": [],

                "estimated_cost": 0,

                "sentiment": "Neutral",

                "budget_breakdown": {},

                "travel_tips": [],

                "hotel_recommendations": [],

                "restaurant_recommendations": [],

                "weather": {}
            }

        # =====================================================
        # REMOVE MARKDOWN
        # =====================================================

        cleaned = re.sub(
            r"```json|```",
            "",
            text
        ).strip()

        # =====================================================
        # CONVERT TO JSON
        # =====================================================

        data = json.loads(
            cleaned
        )

        # =====================================================
        # RETURN SAFE DATA
        # =====================================================

        return {

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
            )
        }

    except Exception as e:

        print(
            "PARSER ERROR:",
            e
        )

        return {

            "itinerary": [],

            "recommended_places": [],

            "estimated_cost": 0,

            "sentiment": "Neutral",

            "budget_breakdown": {},

            "travel_tips": [],

            "hotel_recommendations": [],

            "restaurant_recommendations": [],

            "weather": {}
        }

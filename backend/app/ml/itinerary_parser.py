# =====================================================
# ITINERARY PARSER
# =====================================================

import json
import logging
import re

logger = logging.getLogger(__name__)

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

    "trip_summary": {},

    "packing_list": [],

    "safety_notes": [],

    "hotel_recommendations": [],

    "restaurant_recommendations": [],

    "weather": {},

    "crowd_insights": [],

    "transport_recommendations": [],

    "nearby_attractions": [],

    "best_season": ""
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

        # =====================================================
        # LOAD JSON
        # =====================================================

        data = json.loads(cleaned)

        # =====================================================
        # SAFE RESPONSE
        # =====================================================

        response = {

            "trip_summary": data.get(
                "trip_summary",
                {}
            ),

            "itinerary": data.get(
                "itinerary",
                []
            ),

            "recommended_places": data.get(
                "recommended_places",
                []
            ),

            "recommendations": data.get(
                "recommendations",
                data.get("recommended_places", [])
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
                data.get("hotels", [])
            ),

            # =====================================================
            # RESTAURANTS
            # =====================================================

            "restaurant_recommendations": data.get(
                "restaurant_recommendations",
                data.get("restaurants", [])
            ),

            # =====================================================
            # WEATHER
            # =====================================================

            "weather": data.get(
                "weather",
                {}
            ),

            "transport_recommendations": data.get(
                "transport_recommendations",
                []
            ),

            "nearby_attractions": data.get(
                "nearby_attractions",
                []
            ),

            "best_season": data.get(
                "best_season",
                data.get("weather", {}).get("best_season", "")
            ),

            # =====================================================
            # CROWD INSIGHTS
            # =====================================================

            "crowd_insights": data.get(
                "crowd_insights",
                []
            ),

            "packing_list": data.get(
                "packing_list",
                []
            ),

            "safety_notes": data.get(
                "safety_notes",
                []
            )
        }

        return response

    # =====================================================
    # ERROR
    # =====================================================

    except Exception as exc:

        logger.warning("Itinerary parser returned default response: %s", exc)

        return DEFAULT_RESPONSE

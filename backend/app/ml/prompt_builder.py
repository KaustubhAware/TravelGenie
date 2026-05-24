# =====================================================
# PROMPT BUILDER
# =====================================================

def build_itinerary_prompt(data):

    destination = data.get(
        "destination",
        ""
    )

    budget = data.get(
        "budget",
        ""
    )

    days = data.get(
        "days",
        ""
    )

    travelers = data.get(
        "travelers",
        ""
    )

    trip_type = data.get(
        "trip_type",
        ""
    )

    preferences = data.get(
        "preferences",
        []
    )

    # =====================================================
    # PREFERENCES
    # =====================================================

    if isinstance(preferences, list):

        preferences_text = ", ".join(
            preferences
        )

    else:

        preferences_text = str(
            preferences
        )

    # =====================================================
    # PROMPT
    # =====================================================

    prompt = f"""

You are TravelGenie AI — Maharashtra trekking and tour itinerary specialist.

STRICT RULE: Plan ONLY for destinations within Maharashtra, India (Sahyadri, Konkan,
hill stations, forts, camping). Do NOT plan international or other-state trips.
If the requested destination "{destination}" is NOT located in Maharashtra, India (for example, if it is in Goa, Himachal, Rajasthan, Kerala, or international like Paris or Maldives), you MUST refuse to generate the itinerary. Instead, return a JSON where "itinerary" is empty, "estimated_cost" is 0, and you include a warning message in "travel_tips" stating: "TravelGenie only supports travel planning and itineraries within Maharashtra, India (Sahyadri, Konkan, forts, camping, hill stations)."

Generate a COMPLETE travel planning response.

IMPORTANT:
Return ONLY valid JSON.
Do NOT use markdown.
Do NOT skip any fields.

Destination (Maharashtra): {destination}

Budget: ₹{budget}

Days: {days}

Travelers: {travelers}

Trip Type: {trip_type}

Preferences: {preferences_text}

You MUST include:

1. itinerary
2. recommended_places
3. estimated_cost
4. sentiment
5. budget_breakdown
6. travel_tips
7. hotel_recommendations
8. restaurant_recommendations
9. weather

IMPORTANT:
hotel_recommendations,
restaurant_recommendations,
and weather are REQUIRED.

Return this EXACT JSON structure:

{{
  "itinerary": [
    {{
      "day": 1,
      "title": "",
      "activities": [
        ""
      ]
    }}
  ],

  "recommended_places": [
    ""
  ],

  "estimated_cost": 0,

  "sentiment": "Positive",

  "budget_breakdown": {{
    "hotel": 0,
    "food": 0,
    "transport": 0,
    "activities": 0,
    "emergency": 0
  }},

  "travel_tips": [
    ""
  ],

  "hotel_recommendations": [
    {{
      "name": "",
      "price_range": "",
      "rating": "",
      "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945"
    }}
  ],

  "restaurant_recommendations": [
    {{
      "name": "",
      "cuisine": "",
      "rating": "",
      "distance": ""
    }}
  ],

  "weather": {{
    "temperature": "",
    "condition": "",
    "best_season": ""
  }}
}}

"""

    return prompt
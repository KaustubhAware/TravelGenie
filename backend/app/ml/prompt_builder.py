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

Generate a COMPLETE Maharashtra trek planning response. Prioritize Sahyadri treks,
monsoon safety, camping, weekend travel from Pune/Mumbai/Nashik, and budget travel
in INR when relevant.

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

You MUST include concise UI-ready content for every field below.
Hotels must cover budget hotels, premium hotels, camping stays, and nearby stays.
Restaurants should be practical nearby food stops. Avoid large paragraphs.

Return this EXACT JSON structure:

{{
  "trip_summary": {{
    "destination": "{destination}",
    "duration": "{days} days",
    "travelers": "{travelers}",
    "trip_type": "{trip_type}",
    "estimated_cost": 0,
    "best_for": "",
    "summary": ""
  }},

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

  "nearby_attractions": [
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

  "transport_recommendations": [
    {{
      "mode": "",
      "route": "",
      "estimated_cost": 0,
      "duration": "",
      "notes": ""
    }}
  ],

  "hotels": [
    {{
      "name": "",
      "type": "Budget Hotel",
      "price_range": "",
      "rating": "",
      "area": "",
      "why_recommended": "",
      "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945"
    }}
  ],

  "restaurants": [
    {{
      "name": "",
      "cuisine": "",
      "rating": "",
      "distance": "",
      "best_for": ""
    }}
  ],

  "packing_list": [
    ""
  ],

  "safety_notes": [
    ""
  ],

  "weather": {{
    "temperature": "",
    "condition": "",
    "best_season": "",
    "rainfall_conditions": "",
    "monsoon_warning": ""
  }},

  "best_season": ""
}}

"""

    return prompt

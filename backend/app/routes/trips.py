from fastapi import APIRouter, Depends
from app.db import get_connection
from app.firebase_auth import verify_firebase_token

from app.ml.recommendation import recommend
from app.ml.predict_cost import predict_cost
from app.ml.sentiment import analyze_sentiment

from google import genai
import json
import os
import re

router = APIRouter()


# ================= GENERATE TRIP =================
@router.post("/generate-trip")
def generate_trip(data: dict):

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return {"error": "Gemini API key not found"}

    destination = data.get("destination")
    budget = data.get("budget")
    days = data.get("days")
    preferences = data.get("preferences")

    recommended_places = recommend(destination)
    estimated_cost = predict_cost(destination)
    sentiment = analyze_sentiment(preferences)

    try:
        prompt = f"""
You are a travel planner AI.
Return ONLY valid JSON.

[
  {{
    "day": 1,
    "title": "Day 1",
    "activities": ["Visit place", "Lunch"]
  }}
]

Plan a {days}-day trip for {destination}.
Preferences: {preferences}
Budget: {budget}
Places: {recommended_places}
"""

        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=prompt
        )

        raw_text = response.text.strip()

        # 🔥 CLEAN RESPONSE
        cleaned_text = re.sub(r"```json|```", "", raw_text).strip()

        try:
            itinerary = json.loads(cleaned_text)

            # ✅ SAFETY CHECK
            if not isinstance(itinerary, list):
                itinerary = []

        except Exception as e:
            print("JSON ERROR:", e)
            print("RAW:", raw_text)
            itinerary = []

    except Exception as e:
        return {"error": str(e)}

    return {
        "itinerary": itinerary,
        "recommended_places": recommended_places,
        "estimated_cost": estimated_cost,
        "sentiment": sentiment
    }


# ================= SAVE TRIP =================
@router.post("/save-trip")
def save_trip(data: dict, user=Depends(verify_firebase_token)):

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO trips 
            (user_id, destination, budget, days, preferences, cost, sentiment, itinerary)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user["uid"],
            data.get("destination"),
            data.get("budget"),
            data.get("days"),
            data.get("preferences"),
            data.get("cost"),
            data.get("sentiment"),
            json.dumps(data.get("itinerary", []))
        ))

        conn.commit()

        return {"message": "Trip saved"}

    finally:
        cursor.close()
        conn.close()


# ================= GET TRIPS =================
@router.get("/get-trips")
def get_trips(user=Depends(verify_firebase_token)):

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT id, destination, budget, days, preferences, cost, sentiment, itinerary, created_at
            FROM trips
            WHERE user_id = %s
            ORDER BY id DESC
        """, (user["uid"],))

        rows = cursor.fetchall()

        trips = []
        for row in rows:
            trips.append({
                "id": row[0],
                "destination": row[1],
                "budget": row[2],
                "days": row[3],
                "preferences": row[4],
                "cost": row[5],
                "sentiment": row[6],
                # ✅ FIX: ensure proper JSON
                "itinerary": json.loads(row[7]) if isinstance(row[7], str) else row[7],
                "created_at": str(row[8])
            })

        return {"trips": trips}

    finally:
        cursor.close()
        conn.close()


# ================= DELETE TRIP =================
@router.delete("/delete-trip/{trip_id}")
def delete_trip(trip_id: int, user=Depends(verify_firebase_token)):

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            DELETE FROM trips
            WHERE id = %s AND user_id = %s
        """, (trip_id, user["uid"]))

        conn.commit()

        return {"message": "Trip deleted"}

    finally:
        cursor.close()
        conn.close()
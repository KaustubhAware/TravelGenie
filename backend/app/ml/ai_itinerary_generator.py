# =====================================================
# AI ITINERARY GENERATOR
# =====================================================

import os

from google import genai

from dotenv import load_dotenv

from app.ml.prompt_builder import (
    build_itinerary_prompt
)

# =====================================================
# LOAD ENV
# =====================================================

load_dotenv()

# =====================================================
# CREATE CLIENT
# =====================================================

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# =====================================================
# GENERATE AI ITINERARY
# =====================================================

def generate_ai_itinerary(data):

    try:

        # =====================================================
        # BUILD PROMPT
        # =====================================================

        prompt = build_itinerary_prompt(data)

        print("PROMPT SENT TO GEMINI")

        # =====================================================
        # GENERATE RESPONSE
        # =====================================================

        response = client.models.generate_content(

            model="models/gemini-flash-latest",

            contents=prompt
        )

        print("GEMINI RESPONSE RECEIVED")

        # =====================================================
        # DEBUG RAW RESPONSE
        # =====================================================

        print("======================================")
        print("RAW GEMINI RESPONSE")
        print("======================================")

        print(response.text)

        print("======================================")

        # =====================================================
        # VALIDATE RESPONSE
        # =====================================================

        if not response:

            print("EMPTY RESPONSE")

            return None

        if not hasattr(response, "text"):

            print("NO TEXT ATTRIBUTE")

            return None

        # =====================================================
        # CLEAN RESPONSE
        # =====================================================

        cleaned_response = response.text.strip()

        print("======================================")
        print("CLEANED RESPONSE")
        print("======================================")

        print(cleaned_response)

        print("======================================")

        # =====================================================
        # RETURN TEXT
        # =====================================================

        return cleaned_response

    except Exception as e:

        print("GEMINI ERROR:", e)

        return None
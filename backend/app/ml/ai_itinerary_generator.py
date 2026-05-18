# =====================================================
# AI ITINERARY GENERATOR
# =====================================================

import os
import re

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
# GEMINI CLIENT
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

        prompt = build_itinerary_prompt(
            data
        )

        print("=" * 40)
        print("PROMPT SENT TO GEMINI")
        print("=" * 40)

        # =====================================================
        # GENERATE RESPONSE
        # =====================================================

        response = client.models.generate_content(

          model="models/gemini-flash-latest",

            contents=prompt
        )

        # =====================================================
        # VALIDATION
        # =====================================================

        if not response:

            print("NO RESPONSE")

            return None

        if not hasattr(response, "text"):

            print("NO TEXT FOUND")

            return None

        raw_text = response.text.strip()

        print("=" * 40)
        print("RAW GEMINI RESPONSE")
        print("=" * 40)
        print(raw_text)

        # =====================================================
        # CLEAN RESPONSE
        # =====================================================

        cleaned = re.sub(
            r"```json|```",
            "",
            raw_text
        ).strip()

        print("=" * 40)
        print("CLEANED RESPONSE")
        print("=" * 40)
        print(cleaned)

        return cleaned

    # =====================================================
    # ERROR
    # =====================================================

    except Exception as e:

        print("=" * 40)
        print("GEMINI ERROR")
        print("=" * 40)
        print(e)

        return None
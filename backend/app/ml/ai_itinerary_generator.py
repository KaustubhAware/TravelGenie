import logging
import re

from app.config import get_settings
from app.ml.prompt_builder import build_itinerary_prompt

logger = logging.getLogger(__name__)

_itinerary_model = None


def _get_itinerary_client():
    global _itinerary_model
    if _itinerary_model is None:
        settings = get_settings()
        api_key = settings.GEMINI_ITINERARY_API_KEY or settings.GEMINI_API_KEY
        if not api_key:
            return None
        try:
            import google.generativeai as genai
        except ImportError as exc:
            raise RuntimeError("Gemini SDK is not installed") from exc
        genai.configure(api_key=api_key)
        _itinerary_model = genai.GenerativeModel("gemini-1.5-flash")
    return _itinerary_model


def generate_ai_itinerary(data):
    client = _get_itinerary_client()
    if not client:
        raise ValueError("GEMINI_ITINERARY_API_KEY is not configured")

    try:
        prompt = build_itinerary_prompt(data)
        response = client.generate_content(prompt)

        if not response or not hasattr(response, "text"):
            raise RuntimeError("Gemini itinerary response was empty")

        raw_text = response.text.strip()
        cleaned = re.sub(r"```json|```", "", raw_text).strip()
        return cleaned

    except Exception as exc:
        logger.error("Itinerary generation failed: %s", exc)
        raise RuntimeError("Itinerary generation failed") from exc

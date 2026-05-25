# =====================================================
# AI ITINERARY GENERATOR
# =====================================================

import logging
import os
import re

from dotenv import load_dotenv
from google import genai

from app.config import get_settings
from app.ml.prompt_builder import build_itinerary_prompt

# =====================================================
# ENV + LOG CLEANUP
# =====================================================

os.environ.setdefault("GRPC_VERBOSITY", "ERROR")
os.environ.setdefault("GLOG_minloglevel", "2")

load_dotenv()

logger = logging.getLogger(__name__)

# =====================================================
# GEMINI CLIENT
# =====================================================

_client = None

MODEL_CANDIDATES = [
    "models/gemini-flash-latest",
    "models/gemini-1.5-flash",
]


def _get_client():
    global _client

    if _client is not None:
        return _client

    settings = get_settings()

    api_key = (
        settings.GEMINI_ITINERARY_API_KEY
        or settings.GEMINI_API_KEY
    )

    if not api_key:
        return None

    try:
        _client = genai.Client(api_key=api_key)

        logger.info("Gemini itinerary client initialized")

        return _client

    except Exception as exc:
        logger.error("Gemini itinerary client init failed: %s", exc)

        raise RuntimeError(
            "Failed to initialize Gemini itinerary client"
        ) from exc


# =====================================================
# GENERATE AI ITINERARY
# =====================================================

def generate_ai_itinerary(data):

    client = _get_client()

    if not client:
        raise ValueError(
            "GEMINI_ITINERARY_API_KEY is not configured"
        )

    try:

        # =====================================================
        # BUILD PROMPT
        # =====================================================

        prompt = build_itinerary_prompt(data)

        logger.info("Generating itinerary with Gemini")

        response = None

        # =====================================================
        # MODEL FALLBACK
        # =====================================================

        last_error = None

        for model_name in MODEL_CANDIDATES:

            try:

                logger.info(
                    "Trying itinerary model: %s",
                    model_name
                )

                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                )

                if response:
                    logger.info(
                        "Gemini itinerary success using: %s",
                        model_name
                    )

                    break

            except Exception as model_error:

                last_error = model_error

                logger.warning(
                    "Gemini itinerary model failed: %s | %s",
                    model_name,
                    str(model_error),
                )

        if not response:

            raise RuntimeError(
                f"No working Gemini itinerary model found: {last_error}"
            )

        # =====================================================
        # VALIDATION
        # =====================================================

        text = getattr(response, "text", "")

        if not text.strip():

            raise RuntimeError(
                "Gemini itinerary response was empty"
            )

        # =====================================================
        # CLEAN RESPONSE
        # =====================================================

        cleaned = re.sub(
            r"```json|```",
            "",
            text
        ).strip()

        return cleaned

    # =====================================================
    # ERROR HANDLING
    # =====================================================

    except Exception as exc:

        message = str(exc)

        logger.warning(
            "Itinerary generation failed: %s",
            message
        )

        lowered = message.lower()

        if "quota" in lowered or "429" in lowered:

            raise RuntimeError(
                "Gemini quota exceeded. Please try again later."
            ) from exc

        if (
            "model" in lowered
            or "not found" in lowered
            or "invalid" in lowered
        ):

            raise RuntimeError(
                "Configured Gemini model is unavailable."
            ) from exc

        if (
            "network" in lowered
            or "timeout" in lowered
            or "connection" in lowered
        ):

            raise RuntimeError(
                "Gemini network request failed."
            ) from exc

        raise RuntimeError(
            "Itinerary generation failed."
        ) from exc
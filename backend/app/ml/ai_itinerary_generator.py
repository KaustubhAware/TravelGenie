# =====================================================
# AI ITINERARY GENERATOR
# =====================================================

import logging
import os
import re
import time

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
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
]

MAX_MODEL_ATTEMPTS = 2
RETRY_BACKOFF_SECONDS = (0.75, 1.5)


def _model_candidates():
    settings = get_settings()

    configured = [
        settings.GEMINI_MODEL,
        settings.GEMINI_FALLBACK_MODEL,
        *MODEL_CANDIDATES,
    ]

    candidates = []

    for model_name in configured:
        if model_name and model_name not in candidates:
            candidates.append(model_name)

    return candidates


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


def _generate_with_fallback(client, prompt):
    response = None
    last_error = None

    for model_name in _model_candidates():
        for attempt in range(1, MAX_MODEL_ATTEMPTS + 1):
            started = time.perf_counter()

            try:
                logger.info(
                    "Trying itinerary model=%s attempt=%s",
                    model_name,
                    attempt,
                )

                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                )

                latency_ms = int((time.perf_counter() - started) * 1000)
                if response:
                    logger.info(
                        "Gemini itinerary success model=%s attempt=%s latency_ms=%s",
                        model_name,
                        attempt,
                        latency_ms,
                    )
                    return response

                last_error = RuntimeError("Gemini returned no response object")
                logger.warning(
                    "Gemini itinerary empty response model=%s attempt=%s latency_ms=%s",
                    model_name,
                    attempt,
                    latency_ms,
                )

            except Exception as model_error:
                latency_ms = int((time.perf_counter() - started) * 1000)
                last_error = model_error

                logger.warning(
                    "Gemini itinerary failed model=%s attempt=%s latency_ms=%s error=%s",
                    model_name,
                    attempt,
                    latency_ms,
                    str(model_error),
                )

            if attempt < MAX_MODEL_ATTEMPTS:
                time.sleep(RETRY_BACKOFF_SECONDS[min(attempt - 1, len(RETRY_BACKOFF_SECONDS) - 1)])

    raise RuntimeError(
        f"No working Gemini itinerary model found: {last_error}"
    )


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

        response = _generate_with_fallback(client, prompt)

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
            "network" in lowered
            or "timeout" in lowered
            or "connection" in lowered
            or "503" in lowered
            or "unavailable" in lowered
            or "high demand" in lowered
        ):

            raise RuntimeError(
                "Gemini is temporarily unavailable. Please try again shortly."
            ) from exc

        if (
            "model" in lowered
            or "not found" in lowered
            or "invalid" in lowered
        ):

            raise RuntimeError(
                "Configured Gemini model is unavailable."
            ) from exc

        raise RuntimeError(
            "Itinerary generation failed."
        ) from exc

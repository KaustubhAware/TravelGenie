import logging
import os
import re

from dotenv import load_dotenv
from google import genai

from app.config import get_settings

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

# =====================================================
# MAHARASHTRA SYSTEM PROMPT
# =====================================================

MAHARASHTRA_SYSTEM = """
You are TravelGenie AI — a Maharashtra trekking and travel expert.

STRICT RULES:
- Recommend ONLY Maharashtra destinations.
- Focus on Sahyadri treks, forts, waterfalls, camping,
  monsoon travel, and weekend tours.

Examples:
Rajmachi, Kalsubai, Harishchandragad,
Andharban, Devkund, Lohagad,
Visapur, Bhandardara, Pawna,
Matheran, Mahabaleshwar, Lonavala.

NEVER recommend:
- international trips
- non-Maharashtra states
- luxury foreign vacations

Provide:
- budget guidance
- packing tips
- weather warnings
- monsoon safety
- trek recommendations
"""

# =====================================================
# CLIENT INIT
# =====================================================

def _get_client():

    global _client

    if _client is not None:
        return _client

    settings = get_settings()

    api_key = (
        settings.GEMINI_CHAT_API_KEY
        or settings.GEMINI_API_KEY
    )

    if not api_key:
        return None

    try:

        _client = genai.Client(api_key=api_key)

        logger.info("Gemini chat client initialized")

        return _client

    except Exception as exc:

        logger.error(
            "Gemini chat client init failed: %s",
            exc
        )

        raise RuntimeError(
            "Failed to initialize Gemini chat client"
        ) from exc

# =====================================================
# HELPERS
# =====================================================

def sanitize_prompt(text: str, max_len: int = 2000):

    if not text:
        return ""

    cleaned = re.sub(r"<[^>]+>", "", str(text))

    cleaned = re.sub(
        r"\s+",
        " ",
        cleaned
    ).strip()

    return cleaned[:max_len]


def build_package_context(packages: list):

    if not packages:

        return (
            "No Maharashtra packages are currently listed."
        )

    lines = [
        "Available Maharashtra packages:"
    ]

    for pkg in packages[:15]:

        title = pkg.get("title") or "Package"

        location = (
            pkg.get("location")
            or pkg.get("destination")
            or "Maharashtra"
        )

        price = (
            pkg.get("price")
            or pkg.get("pricing")
            or "N/A"
        )

        lines.append(
            f"- {title} ({location}) — approx ₹{price}"
        )

    return "\n".join(lines)

# =====================================================
# CHAT GENERATION
# =====================================================

def generate_chat_reply(
    message: str,
    history: list,
    packages: list
):

    client = _get_client()

    if not client:

        raise ValueError(
            "GEMINI_CHAT_API_KEY is not configured"
        )

    safe_message = sanitize_prompt(message)

    package_context = build_package_context(packages)

    history_text = ""

    for turn in (history or [])[-6:]:

        role = turn.get("role", "user")

        content = sanitize_prompt(
            turn.get("content", ""),
            500,
        )

        if content:

            history_text += (
                f"{role}: {content}\n"
            )

    prompt = f"""
{MAHARASHTRA_SYSTEM}

{package_context}

Conversation:
{history_text}

user: {safe_message}

assistant:
"""

    try:

        response = None

        last_error = None

        for model_name in MODEL_CANDIDATES:

            try:

                logger.info(
                    "Trying chat model: %s",
                    model_name
                )

                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                )

                if response:

                    logger.info(
                        "Gemini chat success using: %s",
                        model_name
                    )

                    break

            except Exception as model_error:

                last_error = model_error

                logger.warning(
                    "Gemini chat model failed: %s | %s",
                    model_name,
                    str(model_error),
                )

        if not response:

            raise RuntimeError(
                f"No working Gemini chat model found: {last_error}"
            )

        text = getattr(response, "text", "")

        if not text.strip():

            raise RuntimeError(
                "Gemini chat response was empty"
            )

        return text.strip()

    except Exception as exc:

        message = str(exc)

        logger.warning(
            "Chat generation failed: %s",
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
            "Chat generation failed"
        ) from exc
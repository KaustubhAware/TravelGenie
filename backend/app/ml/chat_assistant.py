import logging
import re

from app.config import get_settings

logger = logging.getLogger(__name__)

_chat_model = None

MAHARASHTRA_SYSTEM = """
You are TravelGenie AI — a Maharashtra trekking and travel operations expert.

SCOPE (strict):
- ONLY recommend destinations within Maharashtra, India.
- Focus: Sahyadri treks, forts, camping, Konkan coast, hill stations, weekend group tours.
- Examples: Lonavala, Khandala, Mahabaleshwar, Matheran, Alibaug, Harihar, Kalsubai,
  Rajmachi, Harishchandragad, Bhandardara, Igatpuri, Saputara border treks, Tarkarli.

NEVER recommend: Goa (unless Konkan coastal context), international trips, Delhi, Rajasthan,
Kerala, Himachal, Ladakh, or any non-Maharashtra destination.

CAPABILITIES:
- Trek and camping recommendations
- Monsoon travel safety tips
- Weekend tour ideas
- Budget guidance in INR
- Packing lists for Sahyadri treks
- Weather/monsoon guidance for Maharashtra

RULES:
- Use only packages from the provided list when suggesting bookable trips.
- Do not invent packages or prices.
- Keep answers concise, practical, and friendly.
- If asked about non-Maharashtra travel, politely redirect to Maharashtra options.
"""


def _get_chat_client():
    global _chat_model
    if _chat_model is None:
        settings = get_settings()
        api_key = settings.GEMINI_CHAT_API_KEY or settings.GEMINI_API_KEY
        if not api_key:
            return None
        try:
            import google.generativeai as genai
        except ImportError as exc:
            raise RuntimeError("Gemini SDK is not installed") from exc
        genai.configure(api_key=api_key)
        _chat_model = genai.GenerativeModel("gemini-1.5-flash")
    return _chat_model


def sanitize_prompt(text: str, max_len: int = 2000) -> str:
    if not text:
        return ""
    cleaned = re.sub(r"<[^>]+>", "", str(text))
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned[:max_len]


def build_package_context(packages: list) -> str:
    if not packages:
        return (
            "No Maharashtra packages are currently listed. "
            "Suggest general Maharashtra trek/camping ideas without inventing prices."
        )

    lines = ["Maharashtra packages available on TravelGenie (use only these for bookings):"]
    for pkg in packages[:15]:
        title = pkg.get("title") or "Package"
        dest = pkg.get("destination") or pkg.get("location") or "Maharashtra"
        price = pkg.get("price") or pkg.get("pricing") or "N/A"
        lines.append(f"- {title} ({dest}) — approx ₹{price}")
    return "\n".join(lines)


def generate_chat_reply(message: str, history: list, packages: list) -> str:
    client = _get_chat_client()
    package_context = build_package_context(packages)
    safe_message = sanitize_prompt(message)

    history_text = ""
    for turn in (history or [])[-6:]:
        role = turn.get("role", "user")
        content = sanitize_prompt(turn.get("content", ""), 500)
        if content:
            history_text += f"{role}: {content}\n"

    prompt = (
        f"{MAHARASHTRA_SYSTEM}\n\n"
        f"{package_context}\n\n"
        f"Conversation:\n{history_text}\n"
        f"user: {safe_message}\n"
        f"assistant:"
    )

    if not client:
        raise ValueError("GEMINI_CHAT_API_KEY is not configured")

    try:
        response = client.generate_content(prompt)
        text = getattr(response, "text", None) or ""
        if not text.strip():
            raise RuntimeError("Gemini chat response was empty")
        return text.strip()
    except Exception as exc:
        logger.error("Chat generation failed: %s", exc)
        raise RuntimeError("Chat generation failed") from exc

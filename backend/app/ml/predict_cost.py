import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

ML_DIR = Path(__file__).resolve().parent
LOOKUP_PATH = ML_DIR / "city_cost_lookup.json"

_DEFAULT_OVERALL = 25000
_lookup_cache = None


def _load_lookup():
    global _lookup_cache

    if _lookup_cache is not None:
        return _lookup_cache

    if not LOOKUP_PATH.exists():
        logger.warning("City cost lookup file missing: %s", LOOKUP_PATH)
        _lookup_cache = {
            "city_costs": {},
            "overall_average": _DEFAULT_OVERALL,
        }
        return _lookup_cache

    try:
        raw = LOOKUP_PATH.read_text(encoding="utf-8")
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        logger.error("Malformed city cost lookup JSON: %s", exc)
        _lookup_cache = {
            "city_costs": {},
            "overall_average": _DEFAULT_OVERALL,
        }
        return _lookup_cache
    except OSError as exc:
        logger.error("Unable to read city cost lookup: %s", exc)
        _lookup_cache = {
            "city_costs": {},
            "overall_average": _DEFAULT_OVERALL,
        }
        return _lookup_cache

    if not isinstance(data, dict):
        logger.error("Invalid lookup format: expected object")
        data = {}

    city_costs = data.get("city_costs", {})
    if not isinstance(city_costs, dict):
        logger.error("Invalid city_costs in lookup file")
        city_costs = {}

    overall = data.get("overall_average", _DEFAULT_OVERALL)
    try:
        overall = int(overall)
    except (TypeError, ValueError):
        overall = _DEFAULT_OVERALL

    _lookup_cache = {
        "city_costs": city_costs,
        "overall_average": overall,
    }
    return _lookup_cache


def predict_cost(city):
    """Return average travel cost for a city, or overall average as fallback."""
    if not city or not str(city).strip():
        logger.warning("predict_cost called with empty city")
        lookup = _load_lookup()
        return lookup["overall_average"]

    key = str(city).strip().lower()
    lookup = _load_lookup()
    city_costs = lookup.get("city_costs", {})

    value = city_costs.get(key)
    if value is None:
        logger.info("No cost data for city '%s', using overall average", city)
        return lookup["overall_average"]

    try:
        return int(value)
    except (TypeError, ValueError):
        logger.warning("Invalid cost value for city '%s'", city)
        return lookup["overall_average"]

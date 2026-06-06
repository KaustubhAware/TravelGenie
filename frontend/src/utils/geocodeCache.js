const CACHE_KEY = "tg-geocode-cache-v1";

const readCache = () => {
  try {
    return JSON.parse(sessionStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeCache = (data) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
};

/**
 * Improves map center when keyword lookup is too generic.
 * Uses sessionStorage cache + OpenStreetMap Nominatim (no API key).
 */
export async function resolveDestinationCoords(label, keywordMatch) {
  const text = String(label || "")
    .trim()
    .toLowerCase();

  if (!text) {
    return keywordMatch;
  }

  if (keywordMatch?.zoom && keywordMatch.zoom >= 11) {
    return keywordMatch;
  }

  const cache = readCache();
  if (cache[text]) {
    return { coords: cache[text], zoom: 12 };
  }

  try {
    const query = encodeURIComponent(`${label}, Maharashtra, India`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`,
      { headers: { "Accept-Language": "en" } }
    );

    if (!response.ok) {
      return keywordMatch;
    }

    const results = await response.json();
    const hit = results?.[0];

    if (hit?.lat && hit?.lon) {
      const coords = [parseFloat(hit.lat), parseFloat(hit.lon)];
      cache[text] = coords;
      writeCache(cache);
      return { coords, zoom: 12 };
    }
  } catch {
    return keywordMatch;
  }

  return keywordMatch;
}

import { env } from "../config/env";

export const FALLBACK_TREK_IMAGE = new URL("../assets/images/destinations/western-ghats.jpeg", import.meta.url).href;
const ALLOWED_UPLOAD_EXTENSIONS = /\.(jpe?g|png|webp)(\?.*)?$/i;
const IMAGE_CACHE_PREFIX = "tg-img-cache:";

const LOCAL_DESTINATION_IMAGES = {
  lonavala: new URL("../assets/images/destinations/lonavala.jpg", import.meta.url).href,
  rajmachi: new URL("../assets/images/treks/rajmachi.jpg", import.meta.url).href,
  kalsubai: new URL("../assets/images/treks/Kalsubai.jpg", import.meta.url).href,
  igatpuri: new URL("../assets/images/treks/igatpuri.jpg", import.meta.url).href,
  harishchandragad: new URL("../assets/images/treks/harishchandragad.jpg", import.meta.url).href,
  pune: new URL("../assets/images/destinations/pune.jpg", import.meta.url).href,
  mumbai: new URL("../assets/images/destinations/mumbai.jpg", import.meta.url).href,
  konkan: new URL("../assets/images/destinations/kokan.jpg", import.meta.url).href,
  kokan: new URL("../assets/images/destinations/kokan.jpg", import.meta.url).href,
  alibaug: new URL("../assets/images/treks/alibaug-camping.jpg", import.meta.url).href,
  pawna: new URL("../assets/images/treks/pawna-camping.jpg", import.meta.url).href,
  bhandardara: new URL("../assets/images/treks/bhandardara-camping.jpg", import.meta.url).href,
  visapur: new URL("../assets/images/treks/visapur.jpg", import.meta.url).href,
  lohagad: new URL("../assets/images/treks/lohagad.jpg", import.meta.url).href,
  torna: new URL("../assets/images/treks/torna.jpg", import.meta.url).href,
  tikona: new URL("../assets/images/treks/tikona.jpeg", import.meta.url).href,
  devkund: new URL("../assets/images/treks/devkund.jpg", import.meta.url).href,
  andharban: new URL("../assets/images/treks/andharban.jpg", import.meta.url).href,
  sahyadri: new URL("../assets/images/destinations/sahyadri.jpg", import.meta.url).href,
  camping: new URL("../assets/images/destinations/camping.jpg", import.meta.url).href,
  waterfalls: new URL("../assets/images/destinations/waterfalls.jpg", import.meta.url).href,
};

const readImageCache = (key) => {
  try {
    return sessionStorage.getItem(`${IMAGE_CACHE_PREFIX}${key}`);
  } catch {
    return null;
  }
};

const writeImageCache = (key, value) => {
  try {
    sessionStorage.setItem(`${IMAGE_CACHE_PREFIX}${key}`, value);
  } catch {
    /* ignore */
  }
};

export function getUnsplashFallbackForDestination(destination = "") {
  return getLocalFallbackForDestination(destination);
}

export function getLocalFallbackForDestination(destination = "") {
  const text = String(destination).toLowerCase();
  const match = Object.entries(LOCAL_DESTINATION_IMAGES).find(([key]) =>
    text.includes(key)
  );
  return match?.[1] || FALLBACK_TREK_IMAGE;
}

export function resolveImageUrl(path, fallback = FALLBACK_TREK_IMAGE) {
  if (!path || typeof path !== "string") {
    return fallback;
  }

  const normalizedPath = path.trim().replace(/\\/g, "/");
  if (!normalizedPath) {
    return fallback;
  }

  if (
    normalizedPath.startsWith("http://") ||
    normalizedPath.startsWith("https://") ||
    normalizedPath.startsWith("data:") ||
    normalizedPath.startsWith("blob:")
  ) {
    return normalizedPath;
  }

  const uploadIndex = normalizedPath.indexOf("/uploads/");
  const backendUploadIndex = normalizedPath.indexOf("backend/uploads/");
  const rawUploadPath =
    uploadIndex >= 0
      ? normalizedPath.slice(uploadIndex)
      : backendUploadIndex >= 0
        ? `/${normalizedPath.slice(backendUploadIndex + "backend/".length)}`
        : normalizedPath;

  const uploadPath = rawUploadPath.startsWith("uploads/")
    ? `/${rawUploadPath}`
    : rawUploadPath;

  if (uploadPath.startsWith("/uploads")) {
    if (!ALLOWED_UPLOAD_EXTENSIONS.test(uploadPath)) {
      return fallback;
    }
    return `${env.API_BASE_URL.replace(/\/api\/?$/, "")}${uploadPath}`;
  }

  if (/^[A-Za-z]:\//.test(normalizedPath) || normalizedPath.startsWith("frontend/src/")) {
    return fallback;
  }

  return normalizedPath;
}

/**
 * Priority: package/upload image → backend URL → Unsplash by destination → local fallback.
 */
export function resolveDestinationImage(
  primaryPath,
  destination = "",
  fallback = FALLBACK_TREK_IMAGE
) {
  const cacheKey = `${primaryPath || ""}|${destination || ""}`.slice(0, 200);
  const cached = readImageCache(cacheKey);
  if (cached && !cached.endsWith("/maharashtra-map.png")) {
    return cached;
  }

  const fromPrimary = primaryPath
    ? resolveImageUrl(primaryPath, "")
    : "";

  if (
    fromPrimary &&
    fromPrimary !== "" &&
    !fromPrimary.endsWith(FALLBACK_TREK_IMAGE)
  ) {
    writeImageCache(cacheKey, fromPrimary);
    return fromPrimary;
  }

  const localFallback = getLocalFallbackForDestination(destination);
  writeImageCache(cacheKey, localFallback || fallback);
  return localFallback || fallback;
}

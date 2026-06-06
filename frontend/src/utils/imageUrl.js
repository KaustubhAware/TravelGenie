import { env } from "../config/env";

export const FALLBACK_TREK_IMAGE = "/maharashtra-map.png";
const ALLOWED_UPLOAD_EXTENSIONS = /\.(jpe?g|png|webp)(\?.*)?$/i;
const IMAGE_CACHE_PREFIX = "tg-img-cache:";

const DESTINATION_UNSPLASH = {
  lonavala: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  rajmachi: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  kalsubai: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  igatpuri: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  harishchandragad: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80",
  pune: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  mumbai: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
  konkan: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  alibaug: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  maharashtra: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
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
  const text = String(destination).toLowerCase();
  const match = Object.entries(DESTINATION_UNSPLASH).find(([key]) =>
    text.includes(key)
  );
  return match?.[1] || DESTINATION_UNSPLASH.maharashtra;
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
  if (cached) {
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

  if (destination) {
    const unsplash = getUnsplashFallbackForDestination(destination);
    writeImageCache(cacheKey, unsplash);
    return unsplash;
  }

  writeImageCache(cacheKey, fallback);
  return fallback;
}

import { env } from "../config/env";

export const FALLBACK_TREK_IMAGE = "/maharashtra-map.png";

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
    return `${env.API_BASE_URL.replace(/\/api\/?$/, "")}${uploadPath}`;
  }

  if (/^[A-Za-z]:\//.test(normalizedPath) || normalizedPath.startsWith("frontend/src/")) {
    return fallback;
  }

  return normalizedPath;
}

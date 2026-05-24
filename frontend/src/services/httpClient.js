import { env } from "../config/env";
import { buildAuthHeaders, getAuthToken, clearAdminAuth } from "../utils/authToken";

const API_BASE = env.API_BASE_URL;

const redirectUnauthorized = () => {
  const isAdminArea =
    window.location.pathname.startsWith("/admin") ||
    window.location.pathname.startsWith("/agent");

  if (isAdminArea) {
    clearAdminAuth();
    window.location.href = "/admin/login";
  } else {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
};

/**
 * @param {string} path
 * @param {RequestInit & { auth?: boolean; skipAuthRedirect?: boolean }} options
 */
export async function apiRequest(path, options = {}) {
  const {
    auth = true,
    skipAuthRedirect = false,
    headers: optionHeaders,
    ...fetchOptions
  } = options;

  const token = getAuthToken();

  if (auth && !token) {
    throw new Error("Not authenticated");
  }

  const headers = buildAuthHeaders(optionHeaders || {});

  if (!token && headers.Authorization) {
    delete headers.Authorization;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...fetchOptions,
      headers,
    });
  } catch {
    throw new Error("Network error. Check your connection and try again.");
  }

  if (res.status === 401 && !skipAuthRedirect) {
    redirectUnauthorized();
    throw new Error("Session expired. Please sign in again.");
  }

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) {
    const validationDetail = Array.isArray(data?.detail)
      ? data.detail
          .map((item) => {
            const field = Array.isArray(item.loc)
              ? item.loc.filter((part) => part !== "body").join(".")
              : "";
            return field ? `${field}: ${item.msg}` : item.msg;
          })
          .join("; ")
      : null;

    const message =
      validationDetail ||
      data?.detail ||
      data?.message ||
      data?.error ||
      `Request failed (${res.status})`;
    throw new Error(
      typeof message === "string" ? message : "Request failed"
    );
  }

  return data;
}

export { API_BASE };

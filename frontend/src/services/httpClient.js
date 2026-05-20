import { env } from "../config/env";
import { buildAuthHeaders, getAuthToken } from "../utils/authToken";

const API_BASE = env.API_BASE_URL;

const redirectUnauthorized = () => {
  localStorage.removeItem("token");

  const isAdminArea =
    window.location.pathname.startsWith("/admin") ||
    window.location.pathname.startsWith("/agent");

  window.location.href = isAdminArea ? "/admin/login" : "/login";
};

/**
 * @param {string} path
 * @param {RequestInit & { auth?: boolean; skipAuthRedirect?: boolean }} options
 *   auth: default true — requires token before request; omits Authorization when false
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

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (res.status === 401 && !skipAuthRedirect) {
    redirectUnauthorized();
    throw new Error("Unauthorized");
  }

  const contentType = res.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) {
    throw new Error(data?.detail || data?.error || "Request failed");
  }

  return data;
}

export { API_BASE };

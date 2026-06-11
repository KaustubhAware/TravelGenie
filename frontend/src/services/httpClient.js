import { env } from "../config/env";
import {
  buildAuthHeaders,
  clearAdminAuth,
  clearUserAuth,
  debugAuth,
  getLoginRedirectPath,
  getTokenForRequest,
  isAdminApiPath,
  isInvalidTokenDetail,
} from "../utils/authToken";

const API_BASE = env.API_BASE_URL;

const redirectUnauthorized = (apiPath = "") => {
  if (isAdminApiPath(apiPath)) {
    clearAdminAuth();
    window.location.href = "/admin/login";
    return;
  }

  clearUserAuth();
  window.location.href = getLoginRedirectPath();
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

  const token = getTokenForRequest(path);

  if (auth && !token) {
    debugAuth("api:missing-token", {
      path,
      tokenType: isAdminApiPath(path) ? "admin" : "user",
    });
    throw new Error("Not authenticated");
  }

  const headers = buildAuthHeaders(optionHeaders || {}, path);

  if (!token && headers.Authorization) {
    delete headers.Authorization;
  }

  debugAuth("api:request", {
    path,
    tokenType: isAdminApiPath(path) ? "admin" : "user",
    hasToken: Boolean(token),
    authorization: headers.Authorization
      ? `${headers.Authorization.slice(0, 24)}...`
      : null,
  });

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...fetchOptions,
      headers,
    });
  } catch {
    throw new Error("Network error. Check your connection and try again.");
  }

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : null;

  debugAuth("api:response", {
    path,
    status: res.status,
    tokenType: isAdminApiPath(path) ? "admin" : "user",
    detail: typeof data?.detail === "string" ? data.detail : null,
    body: data,
  });

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

    const errorMessage =
      typeof message === "string" ? message : "Request failed";

    if (res.status === 401 && token) {
      const detail =
        typeof data?.detail === "string"
          ? data.detail
          : "";

      const shouldLogout = isInvalidTokenDetail(detail);

      if (shouldLogout && !skipAuthRedirect) {
        redirectUnauthorized(path);
      }

      const authError = new Error(errorMessage);
      authError.status = 401;
      authError.detail = detail;
      authError.isAuthError = shouldLogout;
      throw authError;
    }

    const requestError = new Error(errorMessage);
    requestError.status = res.status;
    throw requestError;
  }

  return data;
}

export { API_BASE };

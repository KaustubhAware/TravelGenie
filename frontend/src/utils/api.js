import { apiRequest } from "../services/httpClient";
import { buildAuthHeaders, getAuthToken } from "./authToken";
import { env } from "../config/env";

export const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${env.API_BASE_URL}${url}`, {
    ...options,
    headers: buildAuthHeaders(options.headers || {}),
  });

  if (res.status === 401) {
  console.error("401 Unauthorized");

  const data = await res.clone().json().catch(() => null);

  console.log("AUTH ERROR RESPONSE:", data);

  // ONLY logout if token truly invalid
  if (
    data?.detail === "Invalid token" ||
    data?.message === "Token expired"
  ) {
    localStorage.removeItem("token");

    const isAdminArea =
      window.location.pathname.startsWith("/admin");

    window.location.href = isAdminArea
      ? "/admin/login"
      : "/login";
  }
}

  return res;
};

export { apiRequest };

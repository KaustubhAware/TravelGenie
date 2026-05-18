import { apiRequest } from "../services/httpClient";

import { env } from "../config/env";

export const fetchWithAuth = async (
  url,
  options = {}
) => {

  const token =
    localStorage.getItem("token");

  const res = await fetch(
    env.API_BASE_URL + url,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,

        ...(options.headers || {}),
      },
    }
  );

  // =========================================
  // HANDLE UNAUTHORIZED
  // =========================================

  if (res.status === 401) {

    localStorage.removeItem("token");

    const isAdminArea =
      window.location.pathname.startsWith("/admin");

    window.location.href = isAdminArea
      ? "/admin/login"
      : "/login";
  }

  return res;
};

export { apiRequest };
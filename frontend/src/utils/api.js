import { apiRequest } from "../services/httpClient";

import {
  buildAuthHeaders,
  clearAdminAuth,
  clearUserAuth,
  getLoginRedirectPath,
  getTokenForRequest,
  isAdminApiPath,
  isInvalidTokenDetail,
} from "./authToken";

import { env } from "../config/env";

export const fetchWithAuth = async (
  url,
  options = {}
) => {
  try {
    const token = getTokenForRequest(url);

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(
      `${env.API_BASE_URL}${url}`,
      {
        ...options,
        headers: buildAuthHeaders(
          options.headers || {},
          url
        ),
      }
    );

    if (response.status === 401) {
      let errorData = null;

      try {
        errorData = await response.clone().json();
      } catch {
        errorData = null;
      }

      const detail =
        errorData?.detail ||
        errorData?.message ||
        "";

      const shouldLogout = isInvalidTokenDetail(detail);

      if (shouldLogout) {
        if (isAdminApiPath(url)) {
          clearAdminAuth();
          window.location.href = "/admin/login";
        } else {
          clearUserAuth();
          window.location.href = getLoginRedirectPath();
        }
      }
    }

    const contentType = response.headers.get("content-type");

    if (
      contentType &&
      contentType.includes("application/json")
    ) {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
          data?.message ||
          "Request failed"
        );
      }

      return data;
    }

    return response;
  } catch (error) {
    console.error("fetchWithAuth Error:", error);
    throw error;
  }
};

export { apiRequest };

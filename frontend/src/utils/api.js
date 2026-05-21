import { apiRequest } from "../services/httpClient";

import {
  buildAuthHeaders,
  getAuthToken,
} from "./authToken";

import { env } from "../config/env";

// =====================================================
// FETCH WITH AUTH
// =====================================================

export const fetchWithAuth = async (
  url,
  options = {}
) => {

  try {

    // =====================================================
    // GET TOKEN
    // =====================================================

    const token =
      getAuthToken();

    if (!token) {

      throw new Error(
        "Not authenticated"
      );

    }

    // =====================================================
    // API REQUEST
    // =====================================================

    const response = await fetch(
      `${env.API_BASE_URL}${url}`,
      {

        ...options,

        headers:
          buildAuthHeaders(
            options.headers || {}
          ),

      }
    );

    // =====================================================
    // HANDLE 401
    // =====================================================

    if (response.status === 401) {

      console.error(
        "401 Unauthorized"
      );

      let errorData = null;

      try {

        errorData =
          await response
            .clone()
            .json();

      } catch {

        errorData = null;

      }

      console.log(
        "AUTH ERROR RESPONSE:",
        errorData
      );

      const detail =
        errorData?.detail ||
        errorData?.message ||
        "";

      // =====================================================
      // LOGOUT ONLY FOR REAL TOKEN ISSUES
      // =====================================================

      const shouldLogout = [

        "Invalid token",
        "Token expired",
        "Could not validate credentials",
        "Signature has expired",

      ].includes(detail);

      if (shouldLogout) {

        console.warn(
          "Session expired. Logging out..."
        );

        localStorage.removeItem(
          "token"
        );

        // =====================================================
        // CHECK AREA
        // =====================================================

        const isAdminArea =
          window.location.pathname.startsWith(
            "/admin"
          );

        window.location.href =
          isAdminArea
            ? "/admin/login"
            : "/login";

      }

    }

    // =====================================================
    // HANDLE NON-JSON RESPONSE
    // =====================================================

    const contentType =
      response.headers.get(
        "content-type"
      );

    if (
      contentType &&
      contentType.includes(
        "application/json"
      )
    ) {

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data?.detail ||
          data?.message ||
          "Request failed"
        );

      }

      return data;

    }

    // =====================================================
    // RETURN RAW RESPONSE
    // =====================================================

    return response;

  } catch (error) {

    console.error(
      "fetchWithAuth Error:",
      error
    );

    throw error;

  }

};

// =====================================================
// EXPORT API REQUEST
// =====================================================

export { apiRequest };
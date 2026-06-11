import { hasUserAuthToken } from "../utils/authToken";
import { apiRequest } from "./httpClient";

export const authService = {
  saveCurrentUser: () => {
    if (!hasUserAuthToken()) {
      return Promise.reject(new Error("Not authenticated"));
    }

    return apiRequest("/auth/me", {
      skipAuthRedirect: true,
    });
  },
};

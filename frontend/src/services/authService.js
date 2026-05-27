import { hasAuthToken } from "../utils/authToken";
import { apiRequest } from "./httpClient";

export const authService = {
  saveCurrentUser: () => {
    if (!hasAuthToken()) {
      return Promise.reject(new Error("Not authenticated"));
    }

    return apiRequest("/auth/me");
  },
};

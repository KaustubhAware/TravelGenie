import { hasAuthToken } from "../utils/authToken";
import { apiRequest } from "./httpClient";

export const authService = {
  saveFirebaseUser: () => {
    if (!hasAuthToken()) {
      return Promise.reject(new Error("Not authenticated"));
    }

    return apiRequest("/admin/save-user", {
      method: "POST",
    });
  },
};

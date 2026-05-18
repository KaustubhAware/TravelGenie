import { apiRequest } from "./httpClient";

export const authService = {
  saveFirebaseUser: () =>
    apiRequest("/admin/save-user", {
      method: "POST",
    }),
};

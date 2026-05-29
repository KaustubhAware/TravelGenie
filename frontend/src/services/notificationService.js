import { apiRequest } from "./httpClient";

export const notificationService = {
  list() {
    return apiRequest("/notifications");
  },

  markRead(id) {
    return apiRequest(`/notifications/${id}/read`, {
      method: "POST",
    });
  },

  markAllRead() {
    return apiRequest("/notifications/read-all", {
      method: "POST",
    });
  },
};

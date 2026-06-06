import { apiRequest } from "./httpClient";

let listRequest = null;

export const notificationService = {
  list() {
    if (!listRequest) {
      listRequest = apiRequest("/notifications").finally(() => {
        listRequest = null;
      });
    }
    return listRequest;
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

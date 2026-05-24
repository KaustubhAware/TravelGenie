import { apiRequest } from "./httpClient";

export const reviewService = {
  list(packageId) {
    const query = packageId ? `?package_id=${packageId}` : "";
    return apiRequest(`/reviews${query}`, { auth: false });
  },

  create(payload) {
    return apiRequest("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(reviewId, payload) {
    return apiRequest(`/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  remove(reviewId) {
    return apiRequest(`/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },

  adminList() {
    return apiRequest("/admin/reviews");
  },

  adminAnalytics() {
    return apiRequest("/admin/reviews/analytics");
  },

  moderate(reviewId, payload) {
    return apiRequest(`/admin/reviews/${reviewId}/moderate`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

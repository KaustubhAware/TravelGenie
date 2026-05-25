import { apiRequest } from "./httpClient";

export const vendorService = {
  register(payload) {
    return apiRequest("/vendors/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getProfile() {
    return apiRequest("/vendors/me");
  },

  updateProfile(payload) {
    return apiRequest("/vendors/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  getPackages() {
    return apiRequest("/vendors/packages");
  },

  createPackage(payload) {
    return apiRequest("/vendors/packages", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getAnalytics() {
    return apiRequest("/vendors/analytics");
  },

  getBatches() {
    return apiRequest("/vendors/batches");
  },

  createBatch(payload) {
    return apiRequest("/vendors/batches", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getBookings() {
    return apiRequest("/vendors/bookings");
  },

  marketplace() {
    return apiRequest("/vendors/marketplace", { auth: false });
  },

  adminList() {
    return apiRequest("/admin/vendors");
  },

  verify(vendorId, payload) {
    return apiRequest(`/admin/vendors/${vendorId}/verify`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

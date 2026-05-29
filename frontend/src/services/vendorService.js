import { apiRequest, API_BASE } from "./httpClient";

export const vendorService = {
  async apply(formData) {
    const response = await fetch(`${API_BASE}/vendors/apply`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.detail || data?.message || "Vendor application failed");
    }

    return data;
  },

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

import { hasAuthToken } from "../utils/authToken";
import { apiRequest } from "./httpClient";

const requireAuth = () => {
  if (!hasAuthToken()) {
    throw new Error("Not authenticated");
  }
};

export const bookingService = {
  getAdminBookings: () => {
    requireAuth();
    return apiRequest("/get-bookings");
  },

  updateStatus: (booking_id, status) => {
    requireAuth();
    return apiRequest("/admin/update-status", {
      method: "POST",
      body: JSON.stringify({ booking_id, status }),
    });
  },

  reviewBooking: (payload) => {
    requireAuth();
    return apiRequest("/admin/review-booking", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  cancelBooking: (booking_id) => {
    requireAuth();
    return apiRequest("/admin/cancel-booking", {
      method: "POST",
      body: JSON.stringify({ booking_id }),
    });
  },

  getMyBookings: () => {
    requireAuth();
    return apiRequest("/my-bookings");
  },
};

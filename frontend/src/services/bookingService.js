import {
  hasAdminAuthToken,
  hasUserAuthToken,
} from "../utils/authToken";
import { apiRequest } from "./httpClient";

const requireAdminAuth = () => {
  if (!hasAdminAuthToken()) {
    throw new Error("Not authenticated");
  }
};

const requireUserAuth = () => {
  if (!hasUserAuthToken()) {
    throw new Error("Not authenticated");
  }
};

export const bookingService = {
  getAdminBookings: () => {
    requireAdminAuth();
    return apiRequest("/admin/bookings");
  },

  updateStatus: (booking_id, status) => {
    requireAdminAuth();
    return apiRequest("/admin/update-status", {
      method: "POST",
      body: JSON.stringify({ booking_id, status }),
    });
  },

  reviewBooking: (payload) => {
    requireAdminAuth();
    return apiRequest("/admin/review-booking", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  cancelBooking: (booking_id) => {
    requireAdminAuth();
    return apiRequest("/admin/cancel-booking", {
      method: "POST",
      body: JSON.stringify({ booking_id }),
    });
  },

  getMyBookings: () => {
    requireUserAuth();
    return apiRequest("/my-bookings");
  },
};

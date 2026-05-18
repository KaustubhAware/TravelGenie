import { apiRequest } from "./httpClient";

export const bookingService = {
  getAdminBookings: () =>
    apiRequest("/get-bookings"),

  updateStatus: (booking_id, status) =>
    apiRequest("/admin/update-status", {
      method: "POST",
      body: JSON.stringify({
        booking_id,
        status,
      }),
    }),

  reviewBooking: (payload) =>
    apiRequest("/admin/review-booking", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  cancelBooking: (booking_id) =>
    apiRequest("/admin/cancel-booking", {
      method: "POST",
      body: JSON.stringify({
        booking_id,
      }),
    }),

  getMyBookings: () =>
    apiRequest("/my-bookings"),
};

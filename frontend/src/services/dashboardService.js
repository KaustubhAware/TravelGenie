import { apiRequest } from "./httpClient";

export const dashboardService = {

  /* ===================================================== */
  /* PACKAGES */
  /* ===================================================== */

  async getTrendingPackages() {

    const response = await apiRequest(
      "/packages",
      { auth: false }
    );

    return {
      data: response.packages || response.data?.packages || []
    };

  },

  /* ===================================================== */
  /* BOOKINGS */
  /* ===================================================== */

  async getUserBookings() {

    const response = await apiRequest(
      "/my-bookings"
    );

    return {
      data: response.bookings || response.data?.bookings || []
    };

  },

  async getSavedTrips() {

    const response = await apiRequest(
      "/my-itineraries"
    );

    return {
      data: response.trips || response.data?.trips || []
    };

  },

  async getNotifications() {

    const response = await apiRequest(
      "/notifications"
    );

    return {
      data: response.data?.notifications || [],
      unreadCount: response.data?.unread_count || 0,
    };

  },

};

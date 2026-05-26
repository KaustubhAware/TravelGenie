import api from "./api";

export const dashboardService = {

  /* ===================================================== */
  /* PACKAGES */
  /* ===================================================== */

  async getTrendingPackages() {

    return api.get(
      "/packages"
    );

  },

  /* ===================================================== */
  /* BOOKINGS */
  /* ===================================================== */

  async getUserBookings() {

    return api.get(
      "/bookings/my-bookings"
    );

  },

};
import { apiRequest } from "./httpClient";

export const analyticsService = {
  getStats: () =>
    apiRequest("/admin/stats"),

  getRevenueByDate: () =>
    apiRequest("/admin/revenue-by-date"),

  getTopDestinations: () =>
    apiRequest("/admin/top-destinations"),

  getAdvanced: () =>
    apiRequest("/admin/advanced-analytics"),

  getActivityLogs: () =>
    apiRequest("/admin/activity-logs"),
};

import { apiRequest } from "./httpClient";

export const savedTripService = {
  async list() {
    const response = await apiRequest("/my-itineraries");
    return response.trips || response.data?.trips || [];
  },

  async detail(id) {
    const response = await apiRequest(`/my-itineraries/${id}`);
    return response.trip || response.data?.trip || null;
  },

  rename(id, title) {
    return apiRequest(`/my-itineraries/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title }),
    });
  },

  remove(id) {
    return apiRequest(`/my-itineraries/${id}`, {
      method: "DELETE",
    });
  },
};

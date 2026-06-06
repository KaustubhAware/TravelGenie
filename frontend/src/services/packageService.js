import { apiRequest } from "./httpClient";

export const packageService = {
  list: () =>
    apiRequest("/packages", { auth: false }),

  getBatches: (slug) =>
    apiRequest(`/packages/${slug}/batches`, { auth: false }),

  create: (payload) =>
    apiRequest("/packages", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiRequest(`/packages/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    apiRequest(`/packages/${id}`, {
      method: "DELETE",
    }),
};

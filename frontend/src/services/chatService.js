import { apiRequest } from "./httpClient";

export const chatService = {
  sendMessage(message, history = []) {
    return apiRequest("/chat", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    });
  },
};

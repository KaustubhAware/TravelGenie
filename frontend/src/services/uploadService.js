import { env } from "../config/env";
import { getAuthToken } from "../utils/authToken";

export const uploadService = {
  async packageImage(file) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file?.type)) {
      throw new Error("Upload JPG, PNG, or WEBP images only");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${env.API_BASE_URL}/uploads/package-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.detail || data?.message || "Upload failed");
    }

    return data.data;
  },
};

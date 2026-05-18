import { env } from "../config/env";

const API_BASE = env.API_BASE_URL;

const getToken = () =>
  localStorage.getItem("token");

const redirectUnauthorized = () => {
  localStorage.removeItem("token");

  const isAdminArea =
    window.location.pathname.startsWith("/admin") ||
    window.location.pathname.startsWith("/agent");

  window.location.href = isAdminArea
    ? "/admin/login"
    : "/login";
};

export async function apiRequest(
  path,
  options = {}
) {
  const res = await fetch(
    `${API_BASE}${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        ...(options.headers || {}),
      },
    }
  );

  if (res.status === 401) {
    redirectUnauthorized();
    throw new Error("Unauthorized");
  }

  const contentType =
    res.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) {
    throw new Error(
      data?.detail ||
      data?.error ||
      "Request failed"
    );
  }

  return data;
}

export { API_BASE };

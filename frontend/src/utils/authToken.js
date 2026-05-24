export const getAuthToken = () => {
  const isAdminArea =
    typeof window !== "undefined" &&
    (window.location.pathname.startsWith("/admin") ||
      window.location.pathname.startsWith("/agent"));

  const token = isAdminArea
    ? localStorage.getItem("adminToken") ||
      localStorage.getItem("token")
    : localStorage.getItem("token");

  if (!token || token === "null" || token === "undefined") {
    return null;
  }
  return token;
};

export const hasAuthToken = () => Boolean(getAuthToken());

export const buildAuthHeaders = (extra = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...extra,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const clearAdminAuth = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("token");
};

export const getAuthToken = () => {
  const token = localStorage.getItem("token");
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

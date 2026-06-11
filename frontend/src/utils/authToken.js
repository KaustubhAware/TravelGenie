export const isAdminPath = (pathname = "") =>
  pathname.startsWith("/admin");

export const isVendorPath = (pathname = "") =>
  pathname.startsWith("/vendor");

export const isUserAppPath = (pathname = "") =>
  pathname.startsWith("/dashboard") ||
  (isVendorPath(pathname) &&
    !pathname.startsWith("/vendor/login") &&
    !pathname.startsWith("/vendor/register"));

export const getAuthScopeFromPath = (pathname = "") => {
  if (isAdminPath(pathname)) {
    return "admin";
  }

  if (isUserAppPath(pathname)) {
    return "user";
  }

  return "public";
};

const AUTH_DEBUG =
  typeof import.meta !== "undefined" &&
  import.meta.env?.DEV;

export const debugAuth = (...args) => {
  if (AUTH_DEBUG) {
    console.debug("[auth]", {
      token: Boolean(getUserToken()),
      adminToken: Boolean(getAdminToken()),
      userRole: getPersistedRole(),
      adminRole: getPersistedAdminRole(),
      ...args,
    });
  }
};

const readStoredToken = (key) => {
  const token = localStorage.getItem(key);
  if (!token || token === "null" || token === "undefined") {
    return null;
  }
  return token;
};

export const getUserToken = () => readStoredToken("token");

export const getAdminToken = () => readStoredToken("adminToken");

export const INVALID_TOKEN_MESSAGES = [
  "Invalid token",
  "Token expired",
  "Invalid or expired token",
  "Could not validate credentials",
  "Signature has expired",
  "Invalid token format",
  "Invalid token identity",
  "User no longer exists",
];

export const isInvalidTokenDetail = (detail = "") => {
  const message =
    typeof detail === "string" ? detail.trim() : "";

  if (!message) {
    return false;
  }

  return INVALID_TOKEN_MESSAGES.some(
    (item) => message === item || message.includes(item)
  );
};

export const notifyUserAuthChange = () => {
  if (typeof window !== "undefined") {
    debugAuth("event:user-auth-changed");
    window.dispatchEvent(new Event("user-auth-changed"));
  }
};

export const notifyAdminAuthChange = () => {
  if (typeof window !== "undefined") {
    debugAuth("event:admin-auth-changed");
    window.dispatchEvent(new Event("admin-auth-changed"));
  }
};

export const notifyAuthChange = () => {
  notifyUserAuthChange();
  notifyAdminAuthChange();
};

const normalizeApiPath = (apiPath = "") => {
  const path = String(apiPath || "").trim();
  if (!path) {
    return "";
  }

  const withoutQuery = path.split("?")[0];
  return withoutQuery.startsWith("/")
    ? withoutQuery
    : `/${withoutQuery}`;
};

export const isAdminApiPath = (apiPath = "") =>
  normalizeApiPath(apiPath).startsWith("/admin");

export const getTokenForRequest = (apiPath = "") => {
  if (isAdminApiPath(apiPath)) {
    return getAdminToken();
  }

  return getUserToken();
};

export const getAuthToken = () => {
  const isAdminArea =
    typeof window !== "undefined" &&
    isAdminPath(window.location.pathname);

  return isAdminArea ? getAdminToken() : getUserToken();
};

export const hasAuthToken = () => Boolean(getAuthToken());

export const hasAdminAuthToken = () => Boolean(getAdminToken());

export const hasUserAuthToken = () => Boolean(getUserToken());

export const buildAuthHeaders = (extra = {}, apiPath = "") => {
  const token = apiPath
    ? getTokenForRequest(apiPath)
    : getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...extra,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const clearAdminAuth = (options = {}) => {
  const { notify = true } = options;

  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRole");

  if (notify) {
    notifyAdminAuthChange();
  }
};

export const clearUserAuth = (options = {}) => {
  const { notify = true } = options;

  localStorage.removeItem("token");
  localStorage.removeItem("authUser");
  localStorage.removeItem("userRole");

  if (notify) {
    notifyUserAuthChange();
  }
};

export const getLoginRedirectPath = () => {
  if (typeof window === "undefined") return "/login";
  return window.location.pathname.startsWith("/vendor")
    ? "/vendor/login"
    : "/login";
};

export const persistAuthUser = (user = {}, options = {}) => {
  const { notify = false } = options;

  if (!user || typeof user !== "object") return;

  localStorage.setItem("authUser", JSON.stringify(user));
  localStorage.setItem("userRole", user.role || "customer");

  if (notify) {
    notifyUserAuthChange();
  }
};

export const getPersistedAuthUser = () => {
  try {
    const raw = localStorage.getItem("authUser");
    if (!raw || raw === "null" || raw === "undefined") {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getPersistedRole = () => {
  const role = localStorage.getItem("userRole");
  return role && role !== "null" && role !== "undefined"
    ? role
    : "";
};

export const getPersistedAdminRole = () => {
  const role = localStorage.getItem("adminRole");
  return role && role !== "null" && role !== "undefined"
    ? role
    : "";
};

/** Public marketing site */
export const PUBLIC_ROUTES = {
  home: "/",
  treks: "/treks",
  trekDetail: (slug) => `/treks/${slug}`,
  destinations: "/destinations",
  blog: "/blog",
  login: "/login",
  register: "/register",
};

/** Authenticated customer workspace */
export const DASHBOARD_ROUTES = {
  root: "/dashboard",
  bookings: "/dashboard/bookings",
  bookingDetail: (id) => `/dashboard/bookings/${id}`,
  saved: "/dashboard/saved",
  aiPlanner: "/dashboard/ai-planner",
  aiChat: "/dashboard/ai-chat",
  vendor: "/dashboard/vendor",
  
  profile: "/dashboard/profile",
  booking: "/dashboard/booking",
  bookingSuccess: "/dashboard/booking-success",
};

/** Admin operations */
export const ADMIN_ROUTES = {
  login: "/admin/login",
  root: "/admin",
  dashboard: "/admin/dashboard",
  bookings: "/admin/bookings",
  analytics: "/admin/analytics",
  clients: "/admin/clients",
  packages: "/admin/packages",
  vendors: "/admin/vendors",
};

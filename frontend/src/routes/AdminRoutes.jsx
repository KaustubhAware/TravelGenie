import { lazy, Suspense } from "react";

import AdminLayout from "../layouts/AdminLayout";

import AdminProtectedRoute from "./guards/AdminProtectedRoute";

import RouteLoader from "../components/RouteLoader";
import ErrorBoundary from "../components/ErrorBoundary";

/* ===================================================== */
/* PAGES */
/* ===================================================== */

const AdminLogin = lazy(() =>
  import("../pages/auth/AdminLogin")
);

const AdminDashboard = lazy(() =>
  import("../pages/admin/AdminDashboard")
);

const AdminPackages = lazy(() =>
  import("../pages/admin/AdminPackages")
);

const AdminClients = lazy(() =>
  import("../pages/admin/AdminClients")
);

const AgentDashboard = lazy(() =>
  import("../pages/admin/AgentDashboard")
);

const AdminVendors = lazy(() =>
  import("../pages/admin/AdminVendors")
);

const AdminReviews = lazy(() =>
  import("../pages/admin/AdminReviews")
);

/* ===================================================== */
/* SUSPENSE */
/* ===================================================== */

const withSuspense = (
  element,
  label
) => (
  <ErrorBoundary>
    <Suspense
      fallback={
        <RouteLoader label={label} />
      }
    >
      {element}
    </Suspense>
  </ErrorBoundary>
);

/* ===================================================== */
/* ROUTES */
/* ===================================================== */

const adminRoutes = [

  /* LOGIN */

  {
    path: "/admin/login",

    element: withSuspense(
      <AdminLogin />,
      "Loading admin login..."
    ),
  },

  /* PROTECTED */

  {
    path: "/admin",

    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),

    children: [

      {
        index: true,

        element: withSuspense(
          <AdminDashboard />,
          "Loading dashboard..."
        ),
      },

      {
        path: "dashboard",

        element: withSuspense(
          <AdminDashboard />,
          "Loading dashboard..."
        ),
      },

      {
        path: "packages",

        element: withSuspense(
          <AdminPackages />,
          "Loading packages..."
        ),
      },

      {
        path: "clients",

        element: withSuspense(
          <AdminClients />,
          "Loading clients..."
        ),
      },

      {
        path: "bookings",

        element: withSuspense(
          <AdminDashboard />,
          "Loading bookings..."
        ),
      },

      {
        path: "analytics",

        element: withSuspense(
          <AdminDashboard />,
          "Loading analytics..."
        ),
      },

      {
        path: "guides",

        element: withSuspense(
          <AgentDashboard />,
          "Loading guides..."
        ),
      },

      {
        path: "vendors",

        element: withSuspense(
          <AdminVendors />,
          "Loading vendors..."
        ),
      },

      {
        path: "reviews",

        element: withSuspense(
          <AdminReviews />,
          "Loading reviews..."
        ),
      },

    ],
  },
];

export default adminRoutes;

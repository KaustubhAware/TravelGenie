import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import UserProtectedRoute from "./guards/UserProtectedRoute";

import RouteLoader from "../components/RouteLoader";

import ErrorBoundary from "../components/ErrorBoundary";

/* ===================================================== */
/* DASHBOARD PAGES */
/* ===================================================== */

const CustomerDashboard = lazy(() =>
  import("../pages/dashboard/CustomerDashboard")
);

const DashboardPackages = lazy(() =>
  import("../pages/dashboard/DashboardPackages")
);

const DashboardPackageDetail = lazy(() =>
  import("../pages/dashboard/DashboardPackageDetail")
);

const MyBookings = lazy(() =>
  import("../pages/dashboard/MyBookings")
);

/* ===================================================== */
/* PUBLIC PAGES */
/* ===================================================== */

const Booking = lazy(() =>
  import("../pages/public/Booking")
);

const BookingSuccess = lazy(() =>
  import("../pages/public/BookingSuccess")
);

const BookingDetails = lazy(() =>
  import("../pages/public/BookingDetails")
);

/* ===================================================== */
/* PROFILE */
/* ===================================================== */

const ProfileComplete = lazy(() =>
  import("../pages/ProfileComplete")
);

/* ===================================================== */
/* AI PLANNER */
/* ===================================================== */

const NextPage = lazy(() =>
  import("../pages/NextPage")
);

const SaraAIPlanner = lazy(() =>
  import("../pages/dashboard/SaraAIPlanner")
);

const VendorDashboard = lazy(() =>
  import("../pages/dashboard/VendorDashboard")
);

/* ===================================================== */
/* HELPERS */
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
/* DASHBOARD ROUTES */
/* ===================================================== */

const dashboardRoutes = [

  {
    path: "/vendor",
    element: (
      <UserProtectedRoute roles={["vendor"]}>
        <DashboardLayout />
      </UserProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/vendor/dashboard"
            replace
          />
        ),
      },
      {
        path: "dashboard",
        element: withSuspense(
          <VendorDashboard />,
          "Loading vendor dashboard..."
        ),
      },
      {
        path: "profile",
        element: withSuspense(
          <ProfileComplete />,
          "Loading profile..."
        ),
      },
    ],
  },

  {
    path: "/dashboard",

    element: (
      <UserProtectedRoute roles={["customer", "user"]}>
        <DashboardLayout />
      </UserProtectedRoute>
    ),

    children: [

      /* ===================================================== */
      /* DASHBOARD HOME */
      /* ===================================================== */

      {
        index: true,

        element: withSuspense(
          <CustomerDashboard />,
          "Loading dashboard..."
        ),
      },

      /* ===================================================== */
      /* PACKAGES */
      /* ===================================================== */

      {
        path: "packages",

        element: withSuspense(
          <DashboardPackages />,
          "Loading packages..."
        ),
      },

      {
        path: "packages/:slug",

        element: withSuspense(
          <DashboardPackageDetail />,
          "Loading package details..."
        ),
      },

      /* ===================================================== */
      /* BOOKINGS */
      /* ===================================================== */

      {
        path: "bookings",

        element: withSuspense(
          <MyBookings />,
          "Loading bookings..."
        ),
      },

      {
        path: "bookings/:bookingId",

        element: withSuspense(
          <BookingDetails />,
          "Loading booking details..."
        ),
      },

      /* ===================================================== */
      /* AI PLANNER */
      /* ===================================================== */

      {
        path: "ai-planner",

        element: withSuspense(
          <NextPage />,
          "Loading AI planner..."
        ),
      },

      {
        path: "ai-chat",

        element: withSuspense(
          <SaraAIPlanner />,
          "Loading Sara..."
        ),
      },

      /* ===================================================== */
      /* PROFILE */
      /* ===================================================== */

      {
        path: "profile",

        element: withSuspense(
          <ProfileComplete />,
          "Loading profile..."
        ),
      },

      /* ===================================================== */
      /* BOOKING FLOW */
      /* ===================================================== */

      {
        path: "booking",

        element: withSuspense(
          <Booking />,
          "Loading booking..."
        ),
      },

      {
        path: "booking-success",

        element: withSuspense(
          <BookingSuccess />,
          "Loading booking confirmation..."
        ),
      },

    ],

  },

];

export default dashboardRoutes;

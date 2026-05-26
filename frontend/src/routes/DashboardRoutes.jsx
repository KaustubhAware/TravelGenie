import { lazy, Suspense } from "react";

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

const SavedTrips = lazy(() =>
  import("../pages/dashboard/SavedTrips")
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
    path: "/dashboard",

    element: (
      <UserProtectedRoute>
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
      /* SAVED */
      /* ===================================================== */

      {
        path: "saved",

        element: withSuspense(
          <SavedTrips />,
          "Loading saved trips..."
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

      {
        path: "vendor",

        element: withSuspense(
          <VendorDashboard />,
          "Loading vendor dashboard..."
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
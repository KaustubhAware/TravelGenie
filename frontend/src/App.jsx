import { lazy, Suspense } from "react";

import {
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";

import LandingLayout from "./layouts/LandingLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import AdminProtectedRoute from "./components/AdminProtectedRoute";

import RouteLoader from "./components/RouteLoader";

import ErrorBoundary from "./components/ErrorBoundary";

import DashboardPackages from "./pages/DashboardPackages";

import DashboardPackageDetail from "./pages/DashboardPackageDetail";

/* ===================================================== */
/* PUBLIC PAGES */
/* ===================================================== */

const Home = lazy(() => import("./pages/Home"));

const Login = lazy(() =>
  import("./pages/auth/Login")
);

const Register = lazy(() =>
  import("./pages/auth/Register")
);

/* ===================================================== */
/* USER DASHBOARD */
/* ===================================================== */

const CustomerDashboard = lazy(() =>
  import("./pages/CustomerDashboard")
);

const MyBookings = lazy(() =>
  import("./pages/MyBookings")
);

const SavedTrips = lazy(() =>
  import("./pages/SavedTrips")
);

const ProfileComplete = lazy(() =>
  import("./pages/ProfileComplete")
);

const Booking = lazy(() =>
  import("./pages/Booking")
);

const Payment = lazy(() =>
  import("./pages/Payment")
);

const BookingSuccess = lazy(() =>
  import("./pages/BookingSuccess")
);

const BookingDetails = lazy(() =>
  import("./pages/BookingDetails")
);

const NextPage = lazy(() =>
  import("./pages/NextPage")
);

/* ===================================================== */
/* ADMIN */
/* ===================================================== */

const AdminLogin = lazy(() =>
  import("./pages/AdminLogin")
);

const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard")
);

const AdminClients = lazy(() =>
  import("./pages/AdminClients")
);

const AdminPackages = lazy(() =>
  import("./pages/AdminPackages")
);

const AgentDashboard = lazy(() =>
  import("./pages/AgentDashboard")
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

const LegacyRedirect = ({
  to,
}) => (
  <Navigate
    to={to}
    replace
  />
);

const LegacyBookingDetailRedirect =
  () => {
    const { bookingId } =
      useParams();

    return (
      <Navigate
        to={`/dashboard/bookings/${bookingId}`}
        replace
      />
    );
  };

/* ===================================================== */
/* APP */
/* ===================================================== */

function App() {
  return (
    <Routes>

      {/* ===================================================== */}
      {/* LANDING WEBSITE */}
      {/* ===================================================== */}

      <Route
        element={<LandingLayout />}
      >

        <Route
          path="/"
          element={withSuspense(
            <Home />,
            "Loading TravelGenie..."
          )}
        />

        <Route
          path="/login"
          element={withSuspense(
            <Login />,
            "Loading login..."
          )}
        />

        <Route
          path="/register"
          element={withSuspense(
            <Register />,
            "Loading registration..."
          )}
        />

      </Route>

      {/* ===================================================== */}
      {/* USER DASHBOARD */}
      {/* ===================================================== */}

      <Route
        element={<DashboardLayout />}
      >

        <Route
          path="/dashboard"
          element={withSuspense(
            <CustomerDashboard />,
            "Loading dashboard..."
          )}
        />

        <Route
          path="/dashboard/packages"
          element={
            <DashboardPackages />
          }
        />

        <Route
          path="/dashboard/packages/:slug"
          element={
            <DashboardPackageDetail />
          }
        />

        <Route
          path="/dashboard/bookings"
          element={withSuspense(
            <MyBookings />,
            "Loading bookings..."
          )}
        />

        <Route
          path="/dashboard/bookings/:bookingId"
          element={withSuspense(
            <BookingDetails />,
            "Loading booking details..."
          )}
        />

        <Route
          path="/dashboard/saved"
          element={withSuspense(
            <SavedTrips />,
            "Loading saved trips..."
          )}
        />

        <Route
          path="/dashboard/ai-planner"
          element={withSuspense(
            <NextPage />,
            "Loading AI planner..."
          )}
        />

        <Route
          path="/dashboard/payments"
          element={withSuspense(
            <Payment />,
            "Loading payments..."
          )}
        />

        <Route
          path="/dashboard/profile"
          element={withSuspense(
            <ProfileComplete />,
            "Loading profile..."
          )}
        />

        <Route
          path="/dashboard/booking"
          element={withSuspense(
            <Booking />,
            "Loading booking..."
          )}
        />

        <Route
          path="/dashboard/booking-success"
          element={withSuspense(
            <BookingSuccess />,
            "Loading confirmation..."
          )}
        />

      </Route>

      {/* ===================================================== */}
      {/* LEGACY REDIRECTS */}
      {/* ===================================================== */}

      <Route
        path="/plan"
        element={
          <LegacyRedirect
            to="/dashboard/ai-planner"
          />
        }
      />

      <Route
        path="/ai-planner"
        element={
          <LegacyRedirect
            to="/dashboard/ai-planner"
          />
        }
      />

      <Route
        path="/my-bookings"
        element={
          <LegacyRedirect
            to="/dashboard/bookings"
          />
        }
      />

      <Route
        path="/saved"
        element={
          <LegacyRedirect
            to="/dashboard/saved"
          />
        }
      />

      <Route
        path="/profile"
        element={
          <LegacyRedirect
            to="/dashboard/profile"
          />
        }
      />

      <Route
        path="/payment"
        element={
          <LegacyRedirect
            to="/dashboard/payments"
          />
        }
      />

      <Route
        path="/booking"
        element={
          <LegacyRedirect
            to="/dashboard/booking"
          />
        }
      />

      <Route
        path="/booking-success"
        element={
          <LegacyRedirect
            to="/dashboard/booking-success"
          />
        }
      />

      <Route
        path="/booking/:bookingId"
        element={
          <LegacyBookingDetailRedirect />
        }
      />

      <Route
        path="/complete-profile"
        element={
          <LegacyRedirect
            to="/dashboard/profile"
          />
        }
      />

      {/* ===================================================== */}
      {/* ADMIN */}
      {/* ===================================================== */}

      <Route
        path="/admin/login"
        element={withSuspense(
          <AdminLogin />,
          "Loading admin login..."
        )}
      />

      <Route
        path="/admin"
        element={withSuspense(
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>,
          "Loading admin..."
        )}
      />

      <Route
        path="/admin/dashboard"
        element={withSuspense(
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>,
          "Loading dashboard..."
        )}
      />

      <Route
        path="/admin/bookings"
        element={withSuspense(
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>,
          "Loading bookings..."
        )}
      />

      <Route
        path="/admin/analytics"
        element={withSuspense(
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>,
          "Loading analytics..."
        )}
      />

      <Route
        path="/admin/clients"
        element={withSuspense(
          <AdminProtectedRoute>
            <AdminClients />
          </AdminProtectedRoute>,
          "Loading clients..."
        )}
      />

      <Route
        path="/admin/packages"
        element={withSuspense(
          <AdminProtectedRoute>
            <AdminPackages />
          </AdminProtectedRoute>,
          "Loading packages..."
        )}
      />

      <Route
        path="/agent"
        element={withSuspense(
          <AdminProtectedRoute>
            <AgentDashboard />
          </AdminProtectedRoute>,
          "Loading agent dashboard..."
        )}
      />

      {/* ===================================================== */}
      {/* FALLBACK */}
      {/* ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;
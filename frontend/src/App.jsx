// src/App.jsx

import {
  lazy,
  Suspense,
} from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import UserProtectedRoute from "./components/UserProtectedRoute";

import AppLayout from "./layouts/AppLayout";

import AdminProtectedRoute from "./components/AdminProtectedRoute";
import RouteLoader from "./components/RouteLoader";
import ErrorBoundary from "./components/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const NextPage = lazy(() => import("./pages/NextPage"));
const Booking = lazy(() => import("./pages/Booking"));
const Payment = lazy(() => import("./pages/Payment"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const SavedTrips = lazy(() => import("./pages/SavedTrips"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const ProfileComplete = lazy(() => import("./pages/ProfileComplete"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const BookingDetails = lazy(() => import("./pages/BookingDetails"));
const AdminClients = lazy(() => import("./pages/AdminClients"));
const AdminPackages = lazy(() => import("./pages/AdminPackages"));
const AgentDashboard = lazy(() => import("./pages/AgentDashboard"));

const withSuspense = (element, label) => (
  <ErrorBoundary>
    <Suspense fallback={<RouteLoader label={label} />}>
      {element}
    </Suspense>
  </ErrorBoundary>
);


function App() {

  return (

    <Routes>

      {/* ============================================ */}
      {/* ================= PUBLIC =================== */}
      {/* ============================================ */}

      <Route
        path="/"
        element={withSuspense(<Home />, "Loading TravelGenie...")}
      />

      <Route
        path="/login"
        element={withSuspense(<Login />, "Loading login...")}
      />

      <Route
        path="/register"
        element={withSuspense(<Register />, "Loading registration...")}
      />

      {/* ============================================ */}
      {/* ================= ADMIN ==================== */}
      {/* ============================================ */}

      <Route
        path="/admin/login"
        element={withSuspense(<AdminLogin />, "Loading admin login...")}
      />

      <Route
        path="/admin"
        element={
          withSuspense(
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>,
            "Loading admin dashboard..."
          )
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          withSuspense(
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>,
            "Loading admin dashboard..."
          )
        }
      />

      <Route
        path="/admin/bookings"
        element={
          withSuspense(
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>,
            "Loading booking operations..."
          )
        }
      />

      <Route
        path="/admin/analytics"
        element={
          withSuspense(
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>,
            "Loading analytics..."
          )
        }
      />

      <Route
        path="/admin/clients"
        element={
          withSuspense(
            <AdminProtectedRoute>
              <AdminClients />
            </AdminProtectedRoute>,
            "Loading clients..."
          )
        }
      />

      <Route
         path="/admin/packages"
        element={
          withSuspense(
            <AdminProtectedRoute>
              <AdminPackages />
            </AdminProtectedRoute>,
            "Loading packages..."
          )
        }
      />

      <Route
        path="/agent"
        element={
          withSuspense(
            <AdminProtectedRoute>
              <AgentDashboard />
            </AdminProtectedRoute>,
            "Loading agent workspace..."
          )
        }
      />
      
      {/* ============================================ */}
      {/* ============ PROFILE COMPLETE ============== */}
      {/* ============================================ */}

      <Route
        path="/complete-profile"
        element={
          withSuspense(
            <UserProtectedRoute>
              <ProfileComplete />
            </UserProtectedRoute>,
            "Loading profile..."
          )
        }
      />

      {/* ============================================ */}
      {/* =============== USER LAYOUT ================ */}
      {/* ============================================ */}

      <Route element={<AppLayout />}>

  <Route
    path="/plan"
    element={
      withSuspense(
        <UserProtectedRoute>
          <NextPage />
        </UserProtectedRoute>,
        "Loading AI planner..."
      )
    }
  />

  <Route
    path="/saved"
    element={
      withSuspense(
        <UserProtectedRoute>
          <SavedTrips />
        </UserProtectedRoute>,
        "Loading saved trips..."
      )
    }
  />

  <Route
    path="/profile"
    element={
      withSuspense(
        <UserProtectedRoute>
          <ProfileComplete />
        </UserProtectedRoute>,
        "Loading profile..."
      )
    }
  />

  <Route
    path="/booking"
    element={
      withSuspense(
        <UserProtectedRoute>
          <Booking />
        </UserProtectedRoute>,
        "Loading booking request..."
      )
    }
  />

  <Route
    path="/payment"
    element={
      withSuspense(
        <UserProtectedRoute>
          <Payment />
        </UserProtectedRoute>,
        "Loading payment..."
      )
    }
  />

  <Route
    path="/booking-success"
    element={
      withSuspense(
        <UserProtectedRoute>
          <BookingSuccess />
        </UserProtectedRoute>,
        "Loading confirmation..."
      )
    }
  />

  {/* ============================================ */}
  {/* ============== MY BOOKINGS ================= */}
  {/* ============================================ */}

  <Route
    path="/my-bookings"
    element={
      withSuspense(
        <UserProtectedRoute>
          <MyBookings />
        </UserProtectedRoute>,
        "Loading bookings..."
      )
    }
  />

  <Route
    path="/booking/:bookingId"
    element={
      withSuspense(
        <UserProtectedRoute>
          <BookingDetails />
        </UserProtectedRoute>,
        "Loading booking details..."
      )
    }
  />

</Route>
      {/* ============================================ */}
      {/* ================== 404 ===================== */}
      {/* ============================================ */}

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>

    

  );
  

}

export default App;

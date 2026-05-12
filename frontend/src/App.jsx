// src/App.jsx

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";

import NextPage from "./pages/NextPage";

import Booking from "./pages/Booking";

import Payment from "./pages/Payment";

import BookingSuccess from "./pages/BookingSuccess";

import Login from "./pages/auth/Login";

import Register from "./pages/auth/Register";

import SavedTrips from "./pages/SavedTrips";

import AdminDashboard from "./pages/AdminDashboard";

import AdminLogin from "./pages/AdminLogin";

import ProfileComplete from "./pages/ProfileComplete";

import MyBookings from "./pages/MyBookings";

import UserProtectedRoute from "./components/UserProtectedRoute";

import AppLayout from "./layouts/AppLayout";

function App() {

  return (

    <Routes>

      {/* ============================================ */}
      {/* ================= PUBLIC =================== */}
      {/* ============================================ */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ============================================ */}
      {/* ================= ADMIN ==================== */}
      {/* ============================================ */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      {/* ============================================ */}
      {/* ============ PROFILE COMPLETE ============== */}
      {/* ============================================ */}

      <Route
        path="/complete-profile"
        element={
          <UserProtectedRoute>
            <ProfileComplete />
          </UserProtectedRoute>
        }
      />

      {/* ============================================ */}
      {/* =============== USER LAYOUT ================ */}
      {/* ============================================ */}

      <Route element={<AppLayout />}>

  <Route
    path="/plan"
    element={
      <UserProtectedRoute>
        <NextPage />
      </UserProtectedRoute>
    }
  />

  <Route
    path="/saved"
    element={
      <UserProtectedRoute>
        <SavedTrips />
      </UserProtectedRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <UserProtectedRoute>
        <ProfileComplete />
      </UserProtectedRoute>
    }
  />

  <Route
    path="/booking"
    element={
      <UserProtectedRoute>
        <Booking />
      </UserProtectedRoute>
    }
  />

  <Route
    path="/payment"
    element={
      <UserProtectedRoute>
        <Payment />
      </UserProtectedRoute>
    }
  />

  <Route
    path="/booking-success"
    element={
      <UserProtectedRoute>
        <BookingSuccess />
      </UserProtectedRoute>
    }
  />

  {/* ============================================ */}
  {/* ============== MY BOOKINGS ================= */}
  {/* ============================================ */}

  <Route
    path="/my-bookings"
    element={
      <UserProtectedRoute>
        <MyBookings />
      </UserProtectedRoute>
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
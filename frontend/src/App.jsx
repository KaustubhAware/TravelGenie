import { Routes, Route, Navigate } from "react-router-dom";

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

import UserProtectedRoute from "./components/UserProtectedRoute";
import AppLayout from "./layouts/AppLayout";

function App() {

  return (

    <Routes>

      {/* PUBLIC */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* ADMIN */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      {/* USER LAYOUT */}

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

      </Route>

      {/* 404 */}

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>

  );

}

export default App;
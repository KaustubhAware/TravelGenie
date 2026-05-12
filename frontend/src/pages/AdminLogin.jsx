import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUserShield,
  FaLock,
  FaArrowRight,
  FaGlobeAsia,
} from "react-icons/fa";

/* ================= API ================= */

const API = "http://127.0.0.1:8000/api";

export default function AdminLogin() {

  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* ================= LOGIN ================= */

  const handleLogin = async () => {

    if (!form.username || !form.password) {

      setError("Please enter username and password");

      return;

    }

    try {

      setLoading(true);

      setError("");

      /* ✅ FIXED ROUTE */

      const res = await fetch(`${API}/admin/login`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),

      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (res.ok && data.access_token) {

        localStorage.setItem(
          "token",
          data.access_token
        );

        /* ✅ REDIRECT */

        window.location.href = "/admin";

      } else {

        setError(
          data.detail || "Invalid credentials"
        );

      }

    } catch (err) {

      console.error(err);

      setError("Server error. Try again.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#f5f9ff] flex items-center justify-center px-4 py-8 overflow-hidden relative">

      {/* ================================================= */}
      {/* ================= BACKGROUND ==================== */}
      {/* ================================================= */}

      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-200 rounded-full blur-3xl opacity-40"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-cyan-200 rounded-full blur-3xl opacity-40"></div>

      {/* ================================================= */}
      {/* ================= LOGIN CARD ==================== */}
      {/* ================================================= */}

      <div className="relative z-10 w-full max-w-[1100px] grid lg:grid-cols-2 bg-white rounded-[36px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100">

        {/* ================================================= */}
        {/* ================= LEFT PANEL ==================== */}
        {/* ================================================= */}

        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-cyan-500 p-12 text-white relative overflow-hidden">

          {/* OVERLAY */}

          <div className="absolute inset-0 bg-black/10"></div>

          {/* CONTENT */}

          <div className="relative z-10">

            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8">

              <FaGlobeAsia className="text-4xl" />

            </div>

            <h1 className="text-5xl font-bold leading-tight">

              TravelGenie <br />

              Admin Panel

            </h1>

            <p className="mt-6 text-blue-100 text-lg leading-relaxed max-w-md">

              Manage bookings, monitor revenue analytics,
              track destination performance, and control
              the entire AI travel platform from one place.

            </p>

          </div>

          {/* FEATURES */}

          <div className="relative z-10 space-y-5">

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5">

              <h3 className="font-semibold text-lg">
                Booking Management
              </h3>

              <p className="text-sm text-blue-100 mt-2">

                Track and manage all customer bookings.

              </p>

            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5">

              <h3 className="font-semibold text-lg">
                Revenue Analytics
              </h3>

              <p className="text-sm text-blue-100 mt-2">

                Analyze revenue trends and travel insights.

              </p>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* ================= RIGHT PANEL =================== */}
        {/* ================================================= */}

        <div className="flex items-center justify-center p-8 md:p-12">

          <div className="w-full max-w-md">

            {/* TOP */}

            <div className="text-center mb-10">

              <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 flex items-center justify-center mb-6">

                <FaUserShield className="text-3xl text-blue-600" />

              </div>

              <h2 className="text-4xl font-bold text-gray-900">

                Admin Login

              </h2>

              <p className="text-gray-500 mt-3 text-lg">

                Sign in to access the dashboard

              </p>

            </div>

            {/* ERROR */}

            {error && (

              <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 mb-6 text-sm">

                {error}

              </div>

            )}

            {/* FORM */}

            <div className="space-y-6">

              {/* USERNAME */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-3">

                  Username

                </label>

                <div className="relative">

                  <FaUserShield className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    placeholder="Enter username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        username: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-14 pr-5 py-4 text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-3">

                  Password

                </label>

                <div className="relative">

                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-14 pr-5 py-4 text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                  />

                </div>

              </div>

              {/* LOGIN BUTTON */}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center gap-3"
              >

                {loading
                  ? "Logging in..."
                  : "Access Dashboard"}

                {!loading && <FaArrowRight />}

              </button>

            </div>

            {/* FOOTER */}

            <div className="mt-8 text-center text-sm text-gray-500">

              Secure admin authentication system

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}
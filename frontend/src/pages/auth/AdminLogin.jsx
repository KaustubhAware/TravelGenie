import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { env } from "../../config/env";
import logo from "../../assets/logo.svg";

import {
  FaUserShield,
  FaLock,
  FaArrowRight,
  FaGlobeAsia,
} from "react-icons/fa";

/* ===================================================== */
/* API */
/* ===================================================== */

const API = env.API_BASE_URL;

/* ===================================================== */
/* COMPONENT */
/* ===================================================== */

export default function AdminLogin() {

  const navigate =
    useNavigate();

  /* ===================================================== */
  /* STATE */
  /* ===================================================== */

  const [form, setForm] =
    useState({

      username: "",

      password: "",

    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ===================================================== */
  /* LOGIN */
  /* ===================================================== */

  const handleLogin =
    async () => {

      if (
        !form.username ||

        !form.password
      ) {

        setError(
          "Please enter username and password"
        );

        return;

      }

      try {

        setLoading(true);

        setError("");

        const payload = {
          username: form.username.trim(),
          password: form.password.trim(),
        };

        const res =
          await fetch(`${API}/admin/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

        const data = await res.json();

        if (!res.ok) {
          setError(
            data.detail ||
              data.message ||
              "Invalid username or password"
          );
          return;
        }

        const token =
          data.access_token ||
          data.data?.access_token;

        if (!token) {
          setError("Login succeeded but no token was returned.");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("adminToken", token);
        navigate("/admin", { replace: true });

      } catch (err) {

        console.error(err);

        setError(
          "Server error. Try again."
        );

      } finally {

        setLoading(false);

      }

    };

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8 overflow-hidden relative">

      {/* BACKGROUND */}

      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-orange-200 rounded-full blur-3xl opacity-30" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-blue-200 rounded-full blur-3xl opacity-30" />

      {/* CARD */}

      <div className="relative z-10 w-full max-w-[1150px] grid lg:grid-cols-2 bg-white rounded-[36px] overflow-hidden border border-slate-200 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">

        {/* LEFT */}

        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-black p-12 text-white relative overflow-hidden">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.25),transparent_40%)]" />

          <div className="relative z-10">

            <div className="flex items-center gap-4 mb-10">

              <div className="w-16 h-16 rounded-3xl bg-orange-500 flex items-center justify-center shadow-lg">

                <img
                  src={logo}
                  alt="TravelGenie"
                  className="w-8 h-8 brightness-0 invert"
                />

              </div>

              <div>

                <h1 className="text-3xl font-black">

                  TravelGenie

                </h1>

                <p className="text-white/60 mt-1">

                  Admin Operations Panel

                </p>

              </div>

            </div>

            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center mb-8">

              <FaGlobeAsia className="text-4xl text-orange-400" />

            </div>

            <h2 className="text-5xl font-black leading-tight">

              Manage the
              complete travel
              ecosystem

            </h2>

            <p className="mt-6 text-white/70 text-lg leading-relaxed max-w-md">

              Access bookings,
              clients,
              packages,
              analytics,
              and AI travel operations from one workspace.

            </p>

          </div>

          <div className="relative z-10 space-y-4">

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5">

              <h3 className="font-semibold text-lg">

                Booking Operations

              </h3>

              <p className="text-sm text-white/60 mt-2">

                Manage customer bookings and trip approvals.

              </p>

            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5">

              <h3 className="font-semibold text-lg">

                Revenue Insights

              </h3>

              <p className="text-sm text-white/60 mt-2">

                Track platform analytics and performance metrics.

              </p>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center justify-center p-8 md:p-12">

          <div className="w-full max-w-md">

            <div className="text-center mb-10">

              <div className="w-20 h-20 mx-auto rounded-3xl bg-orange-50 flex items-center justify-center mb-6">

                <FaUserShield className="text-3xl text-orange-500" />

              </div>

              <h2 className="text-4xl font-black text-slate-900">

                Admin Login

              </h2>

              <p className="text-slate-500 mt-3 text-lg">

                Sign in to access dashboard

              </p>

            </div>

            {/* ERROR */}

            {error && (

              <div className="bg-red-50 border border-red-100 text-red-500 rounded-2xl px-5 py-4 mb-6 text-sm">

                {error}

              </div>

            )}

            {/* FORM */}

            <div className="space-y-6">

              {/* USERNAME */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">

                  Username

                </label>

                <div className="relative">

                  <FaUserShield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    placeholder="admin"
                    autoComplete="username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({

                        ...form,

                        username:
                          e.target.value,

                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 py-4 text-slate-800 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:bg-white"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">

                  Password

                </label>

                <div className="relative">

                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    placeholder="admin123"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({

                        ...form,

                        password:
                          e.target.value,

                      })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 py-4 text-slate-800 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:bg-white"
                  />

                </div>

              </div>

              {/* BUTTON */}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >

                {loading

                  ? "Logging in..."

                  : "Access Dashboard"}

                {!loading && (

                  <FaArrowRight />

                )}

              </button>

            </div>

            <div className="mt-8 text-center text-sm text-slate-500 space-y-1">
              <p>Secure admin authentication system</p>
              <p className="text-xs text-slate-400">
                Local dev default: username <strong>admin</strong>, password{" "}
                <strong>admin123</strong>
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
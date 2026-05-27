import { useState } from "react";

import {
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaUserPlus,
} from "react-icons/fa";

import { apiRequest } from "../../services/httpClient";

import logo from "../../assets/logo.svg";

import registerImage from "../../assets/register.svg";

export default function Register() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const from =
    location.state?.from?.pathname ||
    "/dashboard";

  /* ===================================================== */
  /* REGISTER */
  /* ===================================================== */

  const handleRegister = async () => {

    if (!email || !password) {

      alert("Please fill all fields");

      return;

    }

    if (password.length < 6) {

      alert(
        "Password must be at least 6 characters"
      );

      return;

    }

    setLoading(true);

    try {

      const data = await apiRequest("/auth/register", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem(
        "token",
        data.access_token || data.data?.access_token
      );

      navigate(from, {
        replace: true,
      });

    } catch (err) {

      console.error(err);

      alert(err.message || "Registration failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#ececec] flex items-center justify-center px-5 py-8">

      <div className="w-full max-w-7xl bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden grid lg:grid-cols-2">

        {/* ===================================================== */}
        {/* LEFT */}
        {/* ===================================================== */}

        <div className="flex items-center justify-center px-8 md:px-14 py-14">

          <div className="w-full max-w-md">

            {/* MOBILE BRAND */}

            <div className="lg:hidden flex items-center justify-center gap-2 mb-10">

              <img
                src={logo}
                alt="logo"
                className="w-12 h-12"
              />

              <h2
                className="text-[32px]"
                style={{
                  fontFamily: "'Lobster Two', cursive",
                }}
              >

                <span className="text-[#08112b]">

                  Travel

                </span>

                <span className="text-orange-500">

                  Genie

                </span>

              </h2>

            </div>

            {/* TITLE */}

            <div>

              <h2 className="text-4xl font-black text-[#08112b]">

                Create Account

              </h2>

              <p className="mt-3 text-slate-500">

                Start your trekking journey

              </p>

            </div>

            {/* FORM */}

            <div className="mt-10 space-y-6">

              {/* EMAIL */}

              <div>

                <label className="text-sm font-semibold text-slate-700">

                  Email Address

                </label>

                <div className="relative mt-3">

                  <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full bg-[#f6f6f6] border border-slate-200 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-orange-400 transition"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="text-sm font-semibold text-slate-700">

                  Password

                </label>

                <div className="relative mt-3">

                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full bg-[#f6f6f6] border border-slate-200 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-orange-400 transition"
                  />

                </div>

              </div>

            </div>

            {/* INFO */}

            <p className="mt-5 text-sm text-slate-500">

              Password should contain at least
              6 characters.

            </p>

            {/* BUTTON */}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full mt-8 bg-[#08112b] hover:bg-[#12204a] text-white rounded-2xl py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-3"
            >

              {loading
                ? "Creating Account..."
                : (
                  <>
                    Create Account
                    <FaArrowRight />
                  </>
                )}

            </button>

            {/* FOOTER */}

            <p className="text-center text-slate-500 mt-8">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-orange-500 hover:text-orange-600"
              >

                Login

              </Link>

            </p>

          </div>

        </div>

        {/* ===================================================== */}
        {/* RIGHT */}
        {/* ===================================================== */}

        <div className="hidden lg:flex flex-col justify-between bg-[#f8f8f8] p-14 relative overflow-hidden">

          {/* BRAND */}

          <div className="flex items-center gap-2">

            <div className="w-14 h-14 rounded-3xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">

              <img
                src={logo}
                alt="logo"
                className="w-9 h-9"
              />

            </div>

            <div>

              <h2
                className="text-[34px] leading-none"
                style={{
                  fontFamily: "'Lobster Two', cursive",
                  fontWeight: 700,
                }}
              >

                <span className="text-[#08112b]">

                  Travel

                </span>

                <span className="text-orange-500">

                  Genie

                </span>

              </h2>

              

            </div>

          </div>

          {/* CONTENT */}

          <div className="mt-10">

            <h1 className="text-6xl font-black leading-[1] tracking-[-0.05em] text-[#08112b]">

              Start Your Journey.

            </h1>

          </div>

          {/* IMAGE */}

          <div className="flex items-center justify-center mt-10">

            <img
              src={registerImage}
              alt="register"
              className="w-full max-w-xl object-contain"
            />

          </div>

          

        </div>

      </div>

    </div>

  );

}

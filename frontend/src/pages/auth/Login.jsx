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
} from "react-icons/fa";

import { apiRequest } from "../../services/httpClient";

import logo from "../../assets/logo.svg";

import loginImage from "../../assets/login.svg";

export default function Login() {

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

  const handleLogin = async () => {

    if (!email || !password) {

      alert("Please fill all fields");

      return;

    }

    setLoading(true);

    try {

      const data = await apiRequest("/auth/login", {
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

      alert(err.message || "Login failed");

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

        <div className="hidden lg:flex flex-col justify-between bg-[#f8f8f8] p-14 relative overflow-hidden">

          {/* BRAND */}

          <div className="flex items-center gap-2">

           
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

              Welcome
              Back.

            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-600 max-w-lg">

              Continue planning 
              trekking adventures, camping
              experiences and AI-powered
              journeys with TravelGenie.

            </p>

          </div>

          {/* IMAGE */}

          <div className="flex items-center justify-center mt-10">

            <img
              src={loginImage}
              alt="login"
              className="w-full max-w-xl object-contain"
            />

          </div>

        </div>

        {/* ===================================================== */}
        {/* RIGHT */}
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

                Sign In

              </h2>

              <p className="mt-3 text-slate-500">

                Access your trekking dashboard

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
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full bg-[#f6f6f6] border border-slate-200 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-orange-400 transition"
                  />

                </div>

              </div>

            </div>

            {/* BUTTON */}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-8 bg-[#08112b] hover:bg-[#12204a] text-white rounded-2xl py-4 font-semibold transition-all duration-300 flex items-center justify-center gap-3"
            >

              {loading
                ? "Signing In..."
                : (
                  <>
                    Continue
                    <FaArrowRight />
                  </>
                )}

            </button>

            {/* FOOTER */}

            <p className="text-center text-slate-500 mt-8">

              Don’t have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-orange-500 hover:text-orange-600"
              >

                Register

              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

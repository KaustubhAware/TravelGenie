import { useState } from "react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

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

import { auth } from "../../firebase";

import logo from "../../assets/logo.svg";

export default function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const from =
    location.state?.from?.pathname ||
    "/plan";

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async () => {

    if (!email || !password) {

      alert("Please fill all fields");

      return;

    }

    setLoading(true);

    try {

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const token =
        await userCredential.user.getIdToken();

      await fetch(
        "http://127.0.0.1:8000/api/admin/save-user",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(from, {
        replace: true,
      });

    } catch (err) {

      if (
        err.code ===
        "auth/user-not-found"
      ) {

        alert("User not found");

      } else if (
        err.code ===
        "auth/wrong-password"
      ) {

        alert("Incorrect password");

      } else if (
        err.code ===
        "auth/invalid-email"
      ) {

        alert("Invalid email");

      } else {

        alert("Login failed");

      }

    }

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#eef5ff] to-[#f8fbff] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-6xl bg-white rounded-[40px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] grid lg:grid-cols-2">

        {/* ================================================= */}
        {/* LEFT SIDE IMAGE */}
        {/* ================================================= */}

        <div className="relative hidden lg:block">

          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop"
            alt="travel"
            className="w-full h-full object-cover"
          />

          {/* OVERLAY */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* CONTENT */}

          <div className="absolute bottom-10 left-10 text-white max-w-md">

            <div className="flex items-center gap-3 mb-6">

              <img
                src={logo}
                alt="logo"
                className="w-14 h-14 bg-white rounded-2xl p-2"
              />

              <h1 className="text-3xl font-bold">

                TravelGenie

              </h1>

            </div>

            <h2 className="text-5xl font-bold leading-tight mb-5">

              Explore The World With AI

            </h2>

            <p className="text-lg text-gray-200 leading-relaxed">

              Smart travel planning,
              AI recommendations,
              trip management and
              unforgettable journeys.

            </p>

          </div>

        </div>

        {/* ================================================= */}
        {/* RIGHT SIDE FORM */}
        {/* ================================================= */}

        <div className="flex items-center justify-center px-8 py-12 lg:px-16">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}

            <div className="lg:hidden flex justify-center mb-8">

              <img
                src={logo}
                alt="logo"
                className="w-16 h-16"
              />

            </div>

            {/* TITLE */}

            <div className="mb-10">

              <h1 className="text-4xl font-bold text-gray-900">

                Welcome Back

              </h1>

              <p className="text-gray-500 mt-3 text-lg">

                Login to continue your journey

              </p>

            </div>

            {/* EMAIL */}

            <div className="mb-6">

              <label className="block text-sm font-semibold text-gray-700 mb-3">

                Email Address

              </label>

              <div className="relative">

                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full bg-[#f8fbff] border border-gray-200 pl-14 pr-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="mb-8">

              <label className="block text-sm font-semibold text-gray-700 mb-3">

                Password

              </label>

              <div className="relative">

                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full bg-[#f8fbff] border border-gray-200 pl-14 pr-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />

              </div>

            </div>

            {/* LOGIN BUTTON */}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition duration-300 flex items-center justify-center gap-3"
            >

              {loading ? (
                "Logging In..."
              ) : (
                <>
                  Login
                  <FaArrowRight />
                </>
              )}

            </button>

            {/* REGISTER */}

            <p className="text-center text-gray-500 mt-8">

              Don’t have an account?{" "}

              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
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
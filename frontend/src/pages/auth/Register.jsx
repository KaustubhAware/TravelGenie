import { useState } from "react";

import {
  createUserWithEmailAndPassword,
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
  FaUserPlus,
} from "react-icons/fa";

import { auth } from "../../firebase";

import logo from "../../assets/logo.svg";

export default function Register() {

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
  // REGISTER
  // =====================================================

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

    // =====================================
    // FIREBASE REGISTER
    // =====================================

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    // =====================================
    // GET FIREBASE TOKEN
    // =====================================

    const token =
      await userCredential.user.getIdToken();

    // =====================================
    // SAVE TOKEN
    // =====================================

    localStorage.setItem(
      "token",
      token
    );

    // =====================================
    // SAVE USER TO DATABASE
    // =====================================

    const response = await fetch(
      "http://127.0.0.1:8000/api/admin/save-user",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    // =====================================
    // HANDLE BACKEND ERROR
    // =====================================

    if (!response.ok) {

      throw new Error(
        "Failed to save user"
      );
    }

    // =====================================
    // NAVIGATE
    // =====================================

    navigate(from, {
      replace: true,
    });

  } catch (err) {

    console.error(err);

    if (
      err.code ===
      "auth/email-already-in-use"
    ) {

      alert(
        "Email already registered"
      );

    } else if (
      err.code ===
      "auth/invalid-email"
    ) {

      alert("Invalid email");

    } else if (
      err.code ===
      "auth/weak-password"
    ) {

      alert("Weak password");

    } else {

      alert("Something went wrong");
    }

  } finally {

    setLoading(false);
  }
};
  return (

    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#eef5ff] to-[#f8fbff] flex items-center justify-center px-6 py-4">

      {/* MAIN CARD */}

      <div className="w-full max-w-6xl h-[92vh] bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] grid lg:grid-cols-2 p-5 gap-5 overflow-hidden">

        {/* ================================================= */}
        {/* LEFT SIDE FORM */}
        {/* ================================================= */}

        <div className="flex items-center justify-center px-8 py-8 lg:px-16 overflow-y-auto">

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

                Create Account

              </h1>

              <p className="text-gray-500 mt-3 text-lg">

                Start your AI travel journey

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

            <div className="mb-4">

              <label className="block text-sm font-semibold text-gray-700 mb-3">

                Password

              </label>

              <div className="relative">

                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full bg-[#f8fbff] border border-gray-200 pl-14 pr-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                />

              </div>

            </div>

            {/* INFO */}

            <p className="text-sm text-gray-500 mb-8">

              Password should contain at least
              6 characters

            </p>

            {/* BUTTON */}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition duration-300 flex items-center justify-center gap-3"
            >

              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Register
                  <FaArrowRight />
                </>
              )}

            </button>

            {/* LOGIN */}

            <p className="text-center text-gray-500 mt-8">

              Already have an account?{" "}

              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition"
              >

                Login

              </Link>

            </p>

          </div>

        </div>

        {/* ================================================= */}
        {/* RIGHT SIDE IMAGE */}
        {/* ================================================= */}

        <div className="relative hidden lg:block rounded-[32px] overflow-hidden h-full">

          <img
  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop"
  alt="travel"
  className="w-full h-full object-cover"
/>

          {/* OVERLAY */}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* CONTENT */}

          <div className="absolute bottom-10 left-10 right-10 text-white">

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

              Smart Travel Planning Starts Here

            </h2>

            <p className="text-lg text-gray-200 leading-relaxed max-w-md">

              AI-powered trip planning,
              destination discovery,
              itinerary management and
              intelligent travel assistance.

            </p>

            {/* FEATURE CARD */}

            <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-5 max-w-md">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center text-xl">

                  <FaUserPlus />

                </div>

                <div>

                  <h3 className="font-semibold text-lg">

                    Join TravelGenie

                  </h3>

                  <p className="text-sm text-gray-200 mt-1">

                    Create your account and
                    start exploring smarter travel

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
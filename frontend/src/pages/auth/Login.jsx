import { useState } from "react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../../firebase";

import {
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import logo from "../../assets/logo.svg";

export default function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const from =
    location.state?.from?.pathname ||
    "/plan";

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

    <div className="min-h-screen bg-[#f5f9ff] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-md bg-white rounded-[32px] border border-gray-200 shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-10">

        {/* LOGO */}

        <div className="flex justify-center mb-6">

          <img
            src={logo}
            alt="logo"
            className="h-14 w-14"
          />

        </div>

        {/* TITLE */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-900">

            Welcome Back

          </h1>

          <p className="text-gray-500 mt-2">

            Login to continue your journey

          </p>

        </div>

        {/* EMAIL */}

        <div className="mb-5">

          <label className="block text-sm font-medium text-gray-700 mb-2">

            Email Address

          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border border-gray-200 bg-gray-50 px-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition"
          />

        </div>

        {/* PASSWORD */}

        <div className="mb-6">

          <label className="block text-sm font-medium text-gray-700 mb-2">

            Password

          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border border-gray-200 bg-gray-50 px-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition"
          />

        </div>

        {/* BUTTON */}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition duration-300 shadow-sm"
        >

          {loading
            ? "Logging In..."
            : "Login"}

        </button>

        {/* REGISTER */}

        <p className="text-center text-sm text-gray-500 mt-6">

          Don’t have an account?{" "}

          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >

            Register

          </Link>

        </p>

      </div>

    </div>

  );

}
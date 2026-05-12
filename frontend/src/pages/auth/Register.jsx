import { useState } from "react";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../../firebase";

import {
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import logo from "../../assets/logo.svg";

export default function Register() {

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

      const userCredential =
  await createUserWithEmailAndPassword(
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

            Create Account

          </h1>

          <p className="text-gray-500 mt-2">

            Start planning your AI trips

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
            placeholder="Create password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border border-gray-200 bg-gray-50 px-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition"
          />

        </div>

        {/* BUTTON */}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition duration-300 shadow-sm"
        >

          {loading
            ? "Creating Account..."
            : "Register"}

        </button>

        {/* LOGIN */}

        <p className="text-center text-sm text-gray-500 mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >

            Login

          </Link>

        </p>

      </div>

    </div>

  );

}
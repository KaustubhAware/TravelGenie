import { useState } from "react";

import { auth } from "../firebase";

import { useNavigate } from "react-router-dom";

export default function ProfileComplete() {

  const navigate = useNavigate();

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [city, setCity] =
    useState("");

  const [country, setCountry] =
    useState("");

  const [preferences, setPreferences] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* ============================================ */
  /* =========== PROFILE COMPLETION ============= */
  /* ============================================ */

  const fields = [
    fullName,
    phone,
    city,
    country,
    preferences,
  ];

  const completion =
    Math.round(
      (
        fields.filter(Boolean).length /
        fields.length
      ) * 100
    );

  /* ============================================ */
  /* ================ SAVE PROFILE ============== */
  /* ============================================ */

  const handleSave = async () => {

    try {

      setLoading(true);

      const user =
        auth.currentUser;

      const token =
        await user.getIdToken();

      const res = await fetch(
        "http://127.0.0.1:8000/api/profile/save",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            full_name: fullName,
            phone,
            city,
            country,
            preferences,
          }),
        }
      );

      const data =
        await res.json();

      alert(
        data.message ||
        "Profile saved successfully"
      );

      navigate("/plan");

    } catch (err) {

      console.error(err);

      alert("Failed to save profile");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#f5f9ff] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-3xl bg-white rounded-[32px] border border-gray-200 shadow-sm p-10">

        {/* ============================================ */}
        {/* ================= HEADER =================== */}
        {/* ============================================ */}

        <h1 className="text-3xl font-bold text-gray-900 mb-2">

          Complete Your Profile

        </h1>

        <p className="text-gray-500 mb-8">

          Personalize your travel experience

        </p>

        {/* ============================================ */}
        {/* =========== PROFILE COMPLETION ============= */}
        {/* ============================================ */}

        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 mb-8">

          <div className="flex items-center justify-between mb-3">

            <h2 className="font-semibold text-gray-800">

              Profile Completion

            </h2>

            <span className="text-blue-600 font-bold text-lg">

              {completion}%

            </span>

          </div>

          <div className="w-full bg-white h-3 rounded-full overflow-hidden">

            <div
              style={{
                width: `${completion}%`,
              }}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-500"
            />

          </div>

        </div>

        {/* ============================================ */}
        {/* ================= FORM ===================== */}
        {/* ============================================ */}

        <div className="grid md:grid-cols-2 gap-5">

          {/* FULL NAME */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">

              Full Name

            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              placeholder="Enter full name"
              className="w-full border border-gray-200 bg-gray-50 px-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* PHONE */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">

              Phone

            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              placeholder="Enter phone"
              className="w-full border border-gray-200 bg-gray-50 px-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* CITY */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">

              City

            </label>

            <input
              type="text"
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
              placeholder="Enter city"
              className="w-full border border-gray-200 bg-gray-50 px-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          {/* COUNTRY */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">

              Country

            </label>

            <input
              type="text"
              value={country}
              onChange={(e) =>
                setCountry(
                  e.target.value
                )
              }
              placeholder="Enter country"
              className="w-full border border-gray-200 bg-gray-50 px-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

        </div>

        {/* PREFERENCES */}

        <div className="mt-5">

          <label className="block text-sm font-medium text-gray-700 mb-2">

            Travel Preferences

          </label>

          <textarea
            rows="5"
            value={preferences}
            onChange={(e) =>
              setPreferences(
                e.target.value
              )
            }
            placeholder="Adventure, beaches, luxury, trekking..."
            className="w-full border border-gray-200 bg-gray-50 px-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none"
          />

        </div>

        {/* SAVE BUTTON */}

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white py-4 rounded-2xl font-semibold transition"
        >

          {loading
            ? "Saving..."
            : "Save Profile"}

        </button>

      </div>

    </div>

  );

}
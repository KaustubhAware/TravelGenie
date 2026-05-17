import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";

import { auth } from "../firebase";

import GlobeComponent from "../components/GlobeComponent";

import AITripResult from "../components/ai/AITripResult";

import {
  FaArrowRight,
} from "react-icons/fa";

/* ================= API ================= */

const API =
  "http://127.0.0.1:8000/api";

export default function NextPage() {

  const navigate =
    useNavigate();

  /* ================= STATE ================= */

  const [form, setForm] =
    useState({

      destination: "",

      budget: "",

      days: "",

      travelers: "Friends",

      trip_type: "Adventure",

      preferences: "",

    });

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  /* ================= GENERATE TRIP ================= */

  const handleSubmit = async () => {

    if (!form.destination) {

      toast.error(
        "Please enter a destination"
      );

      return;

    }

    setLoading(true);

    setResult(null);

    try {

      /* ================= PAYLOAD ================= */

      const payload = {

        ...form,

        preferences:
          typeof form.preferences ===
          "string"

            ? form.preferences
                .split(",")

                .map((p) =>
                  p.trim()
                )

                .filter(Boolean)

            : [],

      };

      const res = await fetch(

        `${API}/generate-trip`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify(
            payload
          ),

        }

      );

      const data =
        await res.json();

      console.log(
        "AI RESPONSE:",
        data
      );

      if (!res.ok) {

        throw new Error(

          data.error ||
          "Failed"

        );

      }

      /* ================= FIXED RESULT ================= */

      setResult({

        itinerary:
          Array.isArray(
            data.itinerary
          )
            ? data.itinerary
            : [],

        recommendations:
          Array.isArray(
            data.recommended_places
          )
            ? data.recommended_places
            : [],

        hotel_recommendations:
          Array.isArray(
            data.hotel_recommendations
          )
            ? data.hotel_recommendations
            : [],

        restaurant_recommendations:
          Array.isArray(
            data.restaurant_recommendations
          )
            ? data.restaurant_recommendations
            : [],

        weather:
          data.weather || {},

        estimated_cost:
          data.estimated_cost || 0,

        sentiment:
          data.sentiment ||
          "Neutral",

        budget_breakdown:
          data.budget_breakdown ||
          {},

        travel_tips:
          Array.isArray(
            data.travel_tips
          )
            ? data.travel_tips
            : [],

      });

      toast.success(
        "Trip generated!"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to generate trip"
      );

    }

    setLoading(false);

  };

  /* ================= SAVE TRIP ================= */

  const saveTrip = async () => {

    if (!result) return;

    const user =
      auth.currentUser;

    if (!user) {

      toast.error(
        "Please login first"
      );

      navigate("/login");

      return;

    }

    setSaving(true);

    try {

      const token =
        await user.getIdToken();

      const res = await fetch(

        `${API}/save-itinerary`,

        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

          },

          body: JSON.stringify({

            destination:
              form.destination,

            budget:
              form.budget,

            days:
              form.days,

            preferences:
              form.preferences,

            itinerary:
              JSON.stringify(
                result.itinerary
              ),

          }),

        }

      );

      const data =
        await res.json();

      if (!res.ok) {

        throw new Error(

          data.detail ||
          "Save failed"

        );

      }

      toast.success(

        "Trip saved successfully!"

      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to save trip"
      );

    }

    setSaving(false);

  };

  return (

    <div className="h-screen overflow-hidden bg-[#f5f9ff] px-4 md:px-6 pt-4 pb-4">

      <div className="max-w-7xl mx-auto h-full">

        <div className="grid lg:grid-cols-[340px_1fr] gap-5 h-[calc(100vh-92px)]">

          {/* LEFT PANEL */}

          <div className="bg-white rounded-[26px] border border-gray-200 shadow-sm h-full overflow-hidden">

            <div className="p-5">

              <div className="space-y-4">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">

                    Destination

                  </label>

                  <input
                    name="destination"
                    placeholder="Where do you want to go?"
                    value={form.destination}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">

                    Budget

                  </label>

                  <div className="relative">

                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-medium">

                      ₹

                    </span>

                    <input
                      name="budget"
                      type="number"
                      value={form.budget}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-5 py-3"
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">

                    Number of Days

                  </label>

                  <input
                    name="days"
                    type="number"
                    value={form.days}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">

                    Travel Preferences

                  </label>

                  <textarea
                    name="preferences"
                    rows="4"
                    value={form.preferences}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3"
                  />

                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-3"
                >

                  {loading
                    ? "Generating..."
                    : "Generate AI Trip"}

                  {!loading && (
                    <FaArrowRight />
                  )}

                </button>

              </div>

            </div>

          </div>

          {/* RIGHT PANEL */}

          <div className="bg-white rounded-[26px] border border-gray-200 shadow-sm p-5 h-full overflow-hidden">

            {!result && !loading && (

              <div className="relative h-full overflow-hidden rounded-[28px] bg-[#071120]">

                <GlobeComponent />

              </div>

            )}

            {loading && (

              <div className="flex flex-col items-center justify-center h-full">

                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                <p className="text-gray-600 mt-8 text-lg">

                  Generating your itinerary...

                </p>

              </div>

            )}

            {result && (

              <AITripResult
                result={result}
                saveTrip={saveTrip}
                saving={saving}
                navigate={navigate}
                form={form}
              />

            )}

          </div>

        </div>

      </div>

    </div>

  );

}
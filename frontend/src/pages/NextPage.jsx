import {
  lazy,
  Suspense,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";

import { auth } from "../firebase";
import { API_BASE } from "../services/httpClient";

import {
  FaArrowRight,
} from "react-icons/fa";

const AITripResult = lazy(() =>
  import("../components/ai/AITripResult")
);

/* ================= API ================= */

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

        `${API_BASE}/generate-trip`,

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

        `${API_BASE}/save-itinerary`,

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

    <div className="min-h-screen bg-[#f4f7fb]">

      {/* PAGE CONTAINER */}

      <div className="max-w-[1700px] mx-auto px-4 md:px-6 py-6">

        {/* HERO */}

        {!result && !loading && (

          <div className="relative overflow-hidden rounded-[32px] bg-primary-dark mb-8 p-8 md:p-12">

            <img
              src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=80"
              alt="Himalayan expedition"
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/40" />

            <div className="relative z-10 max-w-4xl">

              <p className="text-accent font-semibold tracking-[0.2em] uppercase mb-4">

                AI Trek Assistant

              </p>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">

                Build intelligent itineraries
                for real agency workflows

              </h1>

              <p className="text-white/75 mt-6 text-lg leading-relaxed max-w-3xl">

                Customize preparation,
                route notes,
                weather guidance,
                and booking-ready trek
                context while curated
                packages remain primary.

              </p>

            </div>

          </div>

        )}

        {/* MAIN LAYOUT */}

        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 items-start">

          {/* LEFT PANEL */}

          <div className="xl:sticky xl:top-24 self-start">

            <div className="bg-white rounded-[26px] border border-gray-200 shadow-sm overflow-hidden">

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
                      rows="5"
                      value={form.preferences}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 resize-none"
                    />

                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition hover:bg-primary-dark"
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

          </div>

          {/* RIGHT PANEL */}

          <div className="min-w-0">

            <div className="bg-white rounded-[26px] border border-gray-200 shadow-sm overflow-hidden">

              <div className="p-4 md:p-6">

                {loading && (

                  <div className="flex flex-col items-center justify-center min-h-[500px]">

                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>

                    <p className="text-gray-600 mt-8 text-lg">

                      Generating your itinerary...

                    </p>

                  </div>

                )}

                {result && (

                  <Suspense
                    fallback={
                      <div className="h-[400px] flex items-center justify-center text-gray-500">
                        Preparing AI trip workspace...
                      </div>
                    }
                  >

                    <AITripResult
                      result={result}
                      saveTrip={saveTrip}
                      saving={saving}
                      navigate={navigate}
                      form={form}
                    />

                  </Suspense>

                )}

                {!result && !loading && (

                  <div className="min-h-[500px] flex items-center justify-center text-center px-6">

                    <div>

                      <h2 className="text-3xl md:text-4xl font-black text-gray-900">

                        Your AI itinerary
                        will appear here

                      </h2>

                      <p className="mt-4 text-gray-500 max-w-2xl">

                        Generate complete
                        trekking itineraries,
                        budgets,
                        hotels,
                        restaurants,
                        weather insights,
                        and booking-ready
                        travel plans.

                      </p>

                    </div>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
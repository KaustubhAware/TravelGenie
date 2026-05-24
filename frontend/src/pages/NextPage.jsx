import {
  lazy,
  Suspense,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "react-hot-toast";

import {
  auth,
} from "../firebase";

import {
  API_BASE,
} from "../services/httpClient";

import {
  FaArrowRight,
  FaMountain,
  FaWallet,
  FaCalendarAlt,
  FaRobot,
  FaUsers,
} from "react-icons/fa";

const AITripResult = lazy(() =>
  import("../components/ai/AITripResult")
);

/* ===================================================== */
/* PAGE */
/* ===================================================== */

export default function NextPage() {

  const navigate =
    useNavigate();

  /* ===================================================== */
  /* STATE */
  /* ===================================================== */

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

  /* ===================================================== */
  /* CHANGE */
  /* ===================================================== */

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

    };

  /* ===================================================== */
  /* GENERATE */
  /* ===================================================== */

  const handleSubmit =
    async () => {

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

        const res =
          await fetch(

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

  /* ===================================================== */
  /* SAVE */
  /* ===================================================== */

  const saveTrip =
    async () => {

      if (!result) {

        return;

      }

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

        const res =
          await fetch(

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

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <div className="min-h-screen bg-slate-50">

      {/* ===================================================== */}
      {/* PAGE CONTAINER */}
      {/* ===================================================== */}

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8 py-8">

        {/* ===================================================== */}
        {/* HERO */}
        {/* ===================================================== */}

        {!result && !loading && (

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 mb-8">

            {/* IMAGE */}

            <img
              src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80"
              alt="TravelGenie AI"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* OVERLAY */}

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />

            {/* CONTENT */}

            <div className="relative z-10 p-8 md:p-12 lg:p-16">

              <div className="max-w-4xl">

                <p className="uppercase tracking-[0.3em] text-orange-400 text-sm font-semibold mb-5">

                  AI Travel Planner

                </p>

                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">

                  Create intelligent
                  trekking itineraries
                  in seconds

                </h1>

                <p className="text-white/80 mt-6 text-lg leading-relaxed max-w-3xl">

                  Generate smart travel plans,
                  weather insights,
                  hotel recommendations,
                  budgets,
                  and day-wise experiences
                  powered by AI.

                </p>

                {/* FEATURES */}

                <div className="flex flex-wrap gap-5 mt-8">

                  <Feature
                    icon={<FaRobot />}
                    text="AI Powered"
                  />

                  <Feature
                    icon={<FaMountain />}
                    text="Adventure Ready"
                  />

                  <Feature
                    icon={<FaWallet />}
                    text="Budget Optimized"
                  />

                </div>

              </div>

            </div>

          </div>

        )}

        {/* ===================================================== */}
        {/* MAIN GRID */}
        {/* ===================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 items-start">

          {/* ===================================================== */}
          {/* LEFT SIDEBAR */}
          {/* ===================================================== */}

          <div className="xl:sticky xl:top-24">

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* HEADER */}

              <div className="p-6 border-b border-slate-200">

                <h2 className="text-2xl font-black text-slate-900">

                  Plan Your Trip

                </h2>

                <p className="text-slate-500 mt-2 text-sm">

                  Enter travel details to generate your AI itinerary.

                </p>

              </div>

              {/* FORM */}

              <div className="p-6 space-y-5">

                {/* DESTINATION */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">

                    Destination

                  </label>

                  <input
                    name="destination"
                    placeholder="Where do you want to go?"
                    value={form.destination}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 outline-none focus:border-orange-500 focus:bg-white transition"
                  />

                </div>

                {/* BUDGET */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">

                    Budget

                  </label>

                  <div className="relative">

                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">

                      ₹

                    </span>

                    <input
                      name="budget"
                      type="number"
                      value={form.budget}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-5 py-3 outline-none focus:border-orange-500 focus:bg-white transition"
                    />

                  </div>

                </div>

                {/* DAYS */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">

                    Number of Days

                  </label>

                  <input
                    name="days"
                    type="number"
                    value={form.days}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 outline-none focus:border-orange-500 focus:bg-white transition"
                  />

                </div>

                {/* TRAVELERS */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">

                    Travelers

                  </label>

                  <select
                    name="travelers"
                    value={form.travelers}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 outline-none focus:border-orange-500 focus:bg-white transition"
                  >

                    <option>

                      Solo

                    </option>

                    <option>

                      Friends

                    </option>

                    <option>

                      Family

                    </option>

                    <option>

                      Couple

                    </option>

                  </select>

                </div>

                {/* TRIP TYPE */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">

                    Trip Type

                  </label>

                  <select
                    name="trip_type"
                    value={form.trip_type}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 outline-none focus:border-orange-500 focus:bg-white transition"
                  >

                    <option>

                      Adventure

                    </option>

                    <option>

                      Trekking

                    </option>

                    <option>

                      Luxury

                    </option>

                    <option>

                      Budget

                    </option>

                  </select>

                </div>

                {/* PREFERENCES */}

                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">

                    Preferences

                  </label>

                  <textarea
                    name="preferences"
                    rows="5"
                    value={form.preferences}
                    onChange={handleChange}
                    placeholder="Mountains, camping, waterfalls..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 resize-none outline-none focus:border-orange-500 focus:bg-white transition"
                  />

                </div>

                {/* BUTTON */}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 transition text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-sm"
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

          {/* ===================================================== */}
          {/* RIGHT PANEL */}
          {/* ===================================================== */}

          <div className="min-w-0">

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[700px]">

              <div className="p-5 md:p-6">

                {/* LOADING */}

                {loading && (

                  <div className="flex flex-col items-center justify-center min-h-[600px]">

                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />

                    <p className="text-slate-500 mt-8 text-lg">

                      Generating your AI itinerary...

                    </p>

                  </div>

                )}

                {/* RESULT */}

                {result && (

                  <Suspense
                    fallback={

                      <div className="h-[400px] flex items-center justify-center text-slate-500">

                        Preparing AI workspace...

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

                {/* EMPTY */}

                {!result && !loading && (

                  <div className="min-h-[600px] flex items-center justify-center text-center px-6">

                    <div className="max-w-2xl">

                      <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center mx-auto mb-7">

                        <FaRobot className="text-3xl text-orange-500" />

                      </div>

                      <h2 className="text-4xl font-black text-slate-900">

                        Your AI itinerary
                        will appear here

                      </h2>

                      <p className="mt-5 text-slate-500 leading-relaxed text-lg">

                        Generate complete trekking plans,
                        budgets,
                        hotels,
                        restaurants,
                        weather insights,
                        and booking-ready travel experiences.

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

/* ===================================================== */
/* FEATURE */
/* ===================================================== */

function Feature({
  icon,
  text,
}) {

  return (

    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white">

      <div className="text-orange-400">

        {icon}

      </div>

      <span className="font-medium">

        {text}

      </span>

    </div>

  );

}
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
  API_BASE,
  apiRequest,
} from "../services/httpClient";

import {
  hasAuthToken,
} from "../utils/authToken";

import {
  FaArrowRight,
  FaRobot,
  FaWallet,
  FaMountain,
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
  /* HANDLE CHANGE */
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
  /* QUICK TAGS */
  /* ===================================================== */

  const addPreference =
    (value) => {

      setForm({

        ...form,

        preferences:
          form.preferences

            ? `${form.preferences}, ${value}`

            : value,

      });

    };

  /* ===================================================== */
  /* GENERATE */
  /* ===================================================== */

  const handleSubmit =
    async () => {

      if (!form.destination) {

        toast.error(
          "Please enter destination"
        );

        return;

      }

      if (form.budget && Number(form.budget) <= 0) {

        toast.error(
          "Enter a valid budget greater than 0"
        );

        return;

      }

      if (form.days && Number(form.days) <= 0) {

        toast.error(
          "Enter a valid trip duration"
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
              data.hotel_recommendations || data.hotels
            )
              ? data.hotel_recommendations || data.hotels
              : [],

          restaurant_recommendations:
            Array.isArray(
              data.restaurant_recommendations || data.restaurants
            )
              ? data.restaurant_recommendations || data.restaurants
              : [],

          trip_summary:
            data.trip_summary || {},

          packing_list:
            Array.isArray(data.packing_list)
              ? data.packing_list
              : [],

          safety_notes:
            Array.isArray(data.safety_notes)
              ? data.safety_notes
              : [],

          weather:
            data.weather || {},

          estimated_cost:
            data.estimated_cost || form.budget || null,

          requested_budget:
            data.requested_budget ||
            form.budget ||
            null,

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

          transport:
            data.transport ||
            data.transportation ||
            {},

          transport_recommendations:
            Array.isArray(data.transport_recommendations)
              ? data.transport_recommendations
              : [],

          nearby_attractions:
            Array.isArray(data.nearby_attractions)
              ? data.nearby_attractions
              : [],

          emergency_information:
            data.emergency_information ||
            data.emergency_info ||
            {},

          packing:
            data.packing ||
            {},

          best_season:
            data.best_season ||
            data.trip_summary?.best_season ||
            data.weather?.best_season ||
            "",

          package_image:
            data.package_image ||
            data.packageImage ||
            "",

          destination_image:
            data.destination_image ||
            data.destinationImage ||
            data.image ||
            "",

        });

        toast.success(
          "Premium AI itinerary generated."
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Unable to generate itinerary. Please try again."
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

      if (!hasAuthToken()) {

        toast.error(
          "Please login first"
        );

        navigate("/login");

        return;

      }

      setSaving(true);

      try {

        await apiRequest("/save-trip", {
          method: "POST",
          body: JSON.stringify({
            destination: form.destination,
            budget: form.budget,
            days: form.days,
            preferences: form.preferences,
            cost: result.estimated_cost,
            sentiment: result.sentiment,
            itinerary: result.itinerary,
            metadata: {
              title: `${form.destination} AI Trip`,
              budget_breakdown: result.budget_breakdown,
              estimated_cost: result.estimated_cost,
              requested_budget: result.requested_budget || form.budget,
              recommendations: result.recommendations,
              hotel_recommendations: result.hotel_recommendations,
              restaurant_recommendations: result.restaurant_recommendations,
              weather: result.weather,
              transport: result.transport,
              transport_recommendations: result.transport_recommendations,
              nearby_attractions: result.nearby_attractions,
              emergency_information: result.emergency_information,
              travel_tips: result.travel_tips,
              packing_list: result.packing_list,
              packing: result.packing,
              safety_notes: result.safety_notes,
              best_season: result.best_season,
              destination_image: result.destination_image,
              package_image: result.package_image,
            },
          }),
        });

        toast.success(
          "Trip saved to your AI itineraries."
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Unable to save trip. Please try again."
        );

      }

      setSaving(false);

    };

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <div className="bg-[#f8f8f8]">

      <div className="mx-auto max-w-[1500px] px-4 py-3 md:px-5">

        {/* ===================================================== */}
        {/* MAIN GRID */}
        {/* ===================================================== */}

        <div className="grid gap-5 xl:grid-cols-[330px_1fr]">

          {/* ===================================================== */}
          {/* LEFT FORM */}
          {/* ===================================================== */}

          <div className="xl:sticky xl:top-16">

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

              {/* TITLE */}

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">

                  AI Planner

                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-900">

                  Plan Your Trip

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  Generate smart AI itineraries.

                </p>

              </div>

              {/* FEATURES */}

              <div className="mt-5 flex flex-wrap gap-2">

                <Feature
                  icon={<FaRobot />}
                  text="AI Powered"
                />

                <Feature
                  icon={<FaMountain />}
                  text="Treks"
                />

                <Feature
                  icon={<FaWallet />}
                  text="Budget"
                />

              </div>

              {/* FORM */}

              <div className="mt-6 space-y-4">

                {/* DESTINATION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Destination

                  </label>

                  <input
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
                  />

                </div>

                {/* BUDGET */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Budget

                  </label>

                  <input
                    type="number"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    min="1"
                    inputMode="numeric"
                    placeholder=""
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
                  />

                </div>

                {/* DAYS */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Days

                  </label>

                  <input
                    type="number"
                    name="days"
                    value={form.days}
                    onChange={handleChange}
                    min="1"
                    inputMode="numeric"
                    placeholder=""
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
                  />

                </div>

                {/* TRAVELERS */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Travelers

                  </label>

                  <select
                    name="travelers"
                    value={form.travelers}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
                  >

                    <option>
                      Solo
                    </option>

                    <option>
                      Couple
                    </option>

                    <option>
                      Friends
                    </option>

                    <option>
                      Family
                    </option>

                  </select>

                </div>

                {/* TYPE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Trip Type

                  </label>

                  <select
                    name="trip_type"
                    value={form.trip_type}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
                  >

                    <option>
                      Adventure
                    </option>

                    <option>
                      Trekking
                    </option>

                    <option>
                      Camping
                    </option>

                    <option>
                      Luxury
                    </option>

                  </select>

                </div>

                {/* PREF */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">

                    Preferences

                  </label>

                  <textarea
                    rows="3"
                    name="preferences"
                    value={form.preferences}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
                  />

                  {/* TAGS */}

                  <div className="mt-3 flex flex-wrap gap-2">

                    {[
                      "Night Trek",
                      "Camping",
                      "Waterfalls",
                      "Photography",
                      "Weekend",
                      "Luxury",
                    ].map((item) => (

                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          addPreference(
                            item
                          )
                        }
                        className="rounded-full bg-orange-50 px-3 py-2 text-xs font-medium text-orange-600 transition hover:bg-orange-100"
                      >

                        {item}

                      </button>

                    ))}

                  </div>

                </div>

                {/* BTN */}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                >

                  {loading
                    ? "Building itinerary..."
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

          <div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="p-5">

                {/* LOADING */}

                {loading && (

                  <div className="flex min-h-[450px] flex-col items-center justify-center">

                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

                    <p className="mt-5 text-sm text-slate-500">

                      Building your premium AI travel plan...

                    </p>

                  </div>

                )}

                {/* RESULT */}

                {result && (

                  <Suspense
                    fallback={

                      <div className="flex h-[450px] items-center justify-center text-slate-500">

                        Loading result...

                      </div>

                    }
                  >

                    <AITripResult
                      result={result}
                      saveTrip={saveTrip}
                      saving={saving}
                      form={form}
                    />

                  </Suspense>

                )}

                {/* EMPTY */}

                {!result && !loading && (

                  <div className="flex min-h-[480px] items-center justify-center">

                    <div className="max-w-lg text-center">

                      <img
                        src="/maharashtra-map.png"
                        alt="Map"
                        className="mx-auto h-[180px] object-contain"
                      />

                      <h2 className="mt-5 text-2xl font-black text-slate-900">

                        Your AI itinerary
                        appears here

                      </h2>

                      <p className="mt-3 text-sm leading-relaxed text-slate-500">

                        Generate trekking plans,
                        budgets,
                        hotels,
                        weather insights,
                        and smart AI travel experiences.

                      </p>

                      {/* SUGGESTIONS */}

                      <div className="mt-6 flex flex-wrap justify-center gap-3">

                        <Suggestion
                          text="Rajmachi Trek"
                        />

                        <Suggestion
                          text="Lonavala Camping"
                        />

                        <Suggestion
                          text="Pawna Lake"
                        />

                        <Suggestion
                          text="Night Trek"
                        />

                      </div>

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

    <div className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-xs font-medium text-orange-600">

      {icon}

      {text}

    </div>

  );

}

/* ===================================================== */
/* SUGGESTION */
/* ===================================================== */

function Suggestion({
  text,
}) {

  return (

    <div className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">

      {text}

    </div>

  );

}

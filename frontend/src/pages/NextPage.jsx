import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { auth } from "../firebase";

import GlobeComponent from "../components/GlobeComponent";

import {
  FaPlaneArrival,
  FaHotel,
  FaUtensils,
  FaMapMarkedAlt,
  FaWallet,
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa";

/* ================= API ================= */

const API = "http://127.0.0.1:8000/api";

export default function NextPage() {

  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [form, setForm] = useState({
    destination: "",
    budget: "",
    days: "",
    preferences: "",
  });

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  /* ================= ICONS ================= */

  const getIcon = (text = "") => {

    text = text.toLowerCase();

    if (text.includes("arrival")) return <FaPlaneArrival />;

    if (text.includes("hotel")) return <FaHotel />;

    if (text.includes("food")) return <FaUtensils />;

    return <FaMapMarkedAlt />;

  };

  /* ================= GENERATE TRIP ================= */

  const handleSubmit = async () => {

    if (!form.destination) {

      toast.error("Please enter a destination");

      return;
    }

    setLoading(true);

    setResult(null);

    try {

      const res = await fetch(`${API}/generate-trip`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed");
      }

      setResult({
        recommendations: Array.isArray(data.recommended_places)
          ? data.recommended_places
          : [],

        cost: data.estimated_cost || 3000,

        sentiment: data.sentiment || "Neutral",

        itinerary: Array.isArray(data.itinerary)
          ? data.itinerary
          : [],
      });

      toast.success("Trip generated!");

    } catch (error) {

      console.error(error);

      toast.error("Failed to generate trip");

    }

    setLoading(false);

  };

  /* ================= SAVE TRIP ================= */

  const saveTrip = async () => {

    if (!result) return;

    const user = auth.currentUser;

    if (!user) {

      toast.error("Please login first");

      navigate("/login");

      return;
    }

    setSaving(true);

    try {

      const token = await user.getIdToken();

      const res = await fetch(`${API}/save-trip`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          destination: form.destination,
          budget: form.budget,
          days: form.days,
          preferences: form.preferences,
          cost: result.cost,
          sentiment: result.sentiment,
          itinerary: result.itinerary,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }

      toast.success("Trip saved!");

    } catch (err) {

      console.error(err);

      toast.error("Failed to save trip");

    }

    setSaving(false);

  };

  return (

<div className="h-screen overflow-hidden bg-[#f5f9ff] px-4 md:px-6 pt-4 pb-4">
      <div className="max-w-7xl mx-auto h-full">

        {/* ================= MAIN GRID ================= */}

        <div className="grid lg:grid-cols-[340px_1fr] gap-5 h-[calc(100vh-92px)]">

          {/* ================================================= */}
          {/* ================= LEFT PANEL =================== */}
          {/* ================================================= */}

         <div className="bg-white rounded-[26px] border border-gray-200 shadow-sm h-full overflow-hidden">

            {/* FORM SECTION */}

            <div className="p-5">

              <div className="space-y-4">

                {/* DESTINATION */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">

                    Destination

                  </label>

                  <input
                    name="destination"
                    placeholder="Where do you want to go?"
                    value={form.destination}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                  />

                </div>

                {/* BUDGET */}

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
                      placeholder="Enter your budget"
                      value={form.budget}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-10 pr-5 py-3 text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                    />

                  </div>

                </div>

                {/* DAYS */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">

                    Number of Days

                  </label>

                  <input
                    name="days"
                    type="number"
                    placeholder="How many days?"
                    value={form.days}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                  />

                </div>

                {/* PREFERENCES */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">

                    Travel Preferences

                  </label>

                  <textarea
                    name="preferences"
                    rows="4"
                    placeholder="Adventure, luxury, beaches, nightlife..."
                    value={form.preferences}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 text-gray-800 outline-none transition-all duration-300 resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                  />

                </div>

                {/* BUTTON */}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                >

                  {loading ? "Generating..." : "Generate AI Trip"}

                  {!loading && <FaArrowRight />}

                </button>

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* ================= RIGHT PANEL ================== */}
          {/* ================================================= */}

          <div className="bg-white rounded-[26px] border border-gray-200 shadow-sm p-5 h-full overflow-hidden">

            {/* EMPTY STATE */}

            {!result && !loading && (

              <div className="relative h-full overflow-hidden rounded-[28px] bg-[#071120]">

                {/* GLOBE */}

                <GlobeComponent />

                {/* OVERLAY */}

                <div className="absolute inset-0 bg-gradient-to-r from-[#071120]/95 via-[#071120]/70 to-transparent"></div>

                {/* CONTENT */}

                <div className="relative z-10 h-full flex items-center px-8 lg:px-10">

                  <div className="max-w-xl">

                    {/* BADGE */}

                    

                    {/* HEADING */}

                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-[1.1]">

                      Plan Your <br />

                      Next Journey <br />

                      <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">

                        Smarter

                      </span>

                    </h2>

                    {/* DESCRIPTION */}

                    <p className="text-base text-gray-300 mt-5 leading-relaxed max-w-lg">

                      Generate intelligent itineraries, optimize budgets,
                      discover destinations, and create seamless
                      AI-powered travel experiences.

                    </p>

                  </div>

                </div>

              </div>

            )}

            {/* LOADING */}

            {loading && (

              <div className="flex flex-col items-center justify-center h-full">

                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                <p className="text-gray-600 mt-8 text-lg">

                  Generating your itinerary...

                </p>

              </div>

            )}

            {/* RESULTS */}

            {result && (

              <div className="space-y-6 overflow-y-auto h-full pr-2">

                {/* TOP CARDS */}

                <div className="grid md:grid-cols-2 gap-5">

                  {/* COST */}

                  <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center">

                        <FaWallet className="text-blue-600 text-2xl" />

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Estimated Cost
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 mt-1">

                          ₹ {result.cost}

                        </h2>

                      </div>

                    </div>

                  </div>

                  {/* SENTIMENT */}

                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center">

                        <FaCalendarAlt className="text-gray-700 text-2xl" />

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Travel Mood
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-1">

                          {result.sentiment}

                        </h2>

                      </div>

                    </div>

                  </div>

                </div>

                {/* RECOMMENDATIONS */}

                <div>

                  <h3 className="text-2xl font-semibold text-gray-900 mb-5">

                    Recommended Places

                  </h3>

                  {result.recommendations.length > 0 ? (

                    <div className="flex flex-wrap gap-3">

                      {result.recommendations.map((place, i) => (

                        <span
                          key={i}
                          className="px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium"
                        >

                          {place}

                        </span>

                      ))}

                    </div>

                  ) : (

                    <p className="text-gray-500">
                      No recommendations available
                    </p>

                  )}

                </div>

                {/* ITINERARY */}

                <div>

                  <h3 className="text-2xl font-semibold text-gray-900 mb-5">

                    Day-wise Itinerary

                  </h3>

                  {result.itinerary.length > 0 ? (

                    <div className="space-y-5">

                      {result.itinerary.map((day, index) => (

                        <div
                          key={index}
                          className="border border-gray-200 rounded-3xl p-6 hover:border-blue-200 transition"
                        >

                          <h4 className="text-xl font-semibold text-blue-600 mb-5">

                            {day.title || `Day ${index + 1}`}

                          </h4>

                          <div className="space-y-4">

                            {Array.isArray(day.activities) &&
                              day.activities.map((act, i) => (

                                <div
                                  key={i}
                                  className="flex items-center gap-4 text-gray-700"
                                >

                                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">

                                    {getIcon(act)}

                                  </div>

                                  <p>{act}</p>

                                </div>

                              ))}

                          </div>

                        </div>

                      ))}

                    </div>

                  ) : (

                    <p className="text-gray-500">
                      No itinerary generated
                    </p>

                  )}

                </div>

                {/* ACTION BUTTONS */}

                <div className="grid md:grid-cols-2 gap-4 pt-4">

                  {/* SAVE */}

                  <button
                    onClick={saveTrip}
                    disabled={saving}
                    className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 py-3 rounded-2xl font-semibold transition duration-300"
                  >

                    {saving ? "Saving..." : "Save Trip"}

                  </button>

                  {/* BOOK */}

                  <button
                    onClick={() =>
                      navigate("/booking", {
                        state: {
                          destination: form.destination,
                          days: form.days,
                          budget: result.cost,
                          ...result,
                        },
                      })
                    }
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg transition duration-300"
                  >

                    Book Trip

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );
}
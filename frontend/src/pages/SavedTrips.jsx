import { useEffect, useState, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

import {
  FaTrash,
  FaEye,
  FaSyncAlt,
  FaMapMarkedAlt,
  FaWallet,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";

export default function SavedTrips() {

  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [maxBudget, setMaxBudget] = useState("");

  const API = "http://127.0.0.1:8000/api";

  /* ================= SAFE PARSE ================= */

  const parseItinerary = (data) => {

    try {
      return typeof data === "string"
        ? JSON.parse(data)
        : data || [];
    } catch {
      return [];
    }

  };

  /* ================= FETCH ================= */

  const fetchTrips = async () => {

    setLoading(true);

    const user = auth.currentUser;

    if (!user) {

      toast.error("Please login first");

      navigate("/login");

      setLoading(false);

      return;

    }

    try {

      const token = await user.getIdToken();

      const res = await fetch(
        `${API}/my-itineraries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error();

      const formatted = (data.trips || []).map((trip) => ({
        ...trip,
        destination: trip.destination || "Unknown",
        itinerary: parseItinerary(trip.itinerary),
        budget: Number(trip.budget) || 0,
      }));

      setTrips(formatted);

    } catch (err) {

      console.error(err);

      toast.error("Failed to load trips");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login first");
        navigate("/login");
        setLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const res = await fetch(
          `${API}/my-itineraries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error();
        const formatted = (data.trips || []).map((trip) => ({
          ...trip,
          destination: trip.destination || "Unknown",
          itinerary: parseItinerary(trip.itinerary),
          budget: Number(trip.budget) || 0,
        }));
        setTrips(formatted);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load trips");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  /* ================= FILTER ================= */

  const filteredTrips = useMemo(() => {

    let result = [...trips];

    if (search) {

      result = result.filter((trip) =>
        trip.destination
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    }

    if (maxBudget) {

      result = result.filter(
        (trip) => trip.budget <= Number(maxBudget)
      );

    }

    return result;

  }, [trips, search, maxBudget]);

  /* ================= DELETE ================= */

  const deleteTrip = async (id) => {

    if (!window.confirm("Delete this trip?")) return;

    const user = auth.currentUser;

    if (!user) return;

    try {

      const token = await user.getIdToken();

      const res = await fetch(`${API}/delete-trip/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      toast.success("Trip deleted");

      fetchTrips();

    } catch {

      toast.error("Delete failed");

    }

  };

  /* ================= CLEAR ALL ================= */

  const clearAll = async () => {

    if (!window.confirm("Delete all saved trips?")) return;

    const user = auth.currentUser;

    if (!user) return;

    try {

      const token = await user.getIdToken();

      await Promise.all(
        trips.map((trip) =>
          fetch(`${API}/delete-trip/${trip.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      toast.success("All trips deleted");

      fetchTrips();

    } catch {

      toast.error("Failed to clear trips");

    }

  };

  /* ================= STATS ================= */

  const totalTrips = trips.length;

  const avgBudget =
    trips.length > 0
      ? Math.round(
          trips.reduce((sum, t) => sum + t.budget, 0) /
            trips.length
        )
      : 0;

  return (

    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-[#f5f9ff] px-4 md:px-6 pt-4 pb-10">

        {/* ================= HEADER ================= */}

        <div className="max-w-7xl mx-auto mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <h1 className="text-4xl font-bold text-gray-900">
              Saved Trips
            </h1>

            <p className="text-gray-500 mt-2">
              Manage and explore your AI generated travel plans
            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={fetchTrips}
              className="flex items-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition"
            >

              <FaSyncAlt />

              Refresh

            </button>

            {trips.length > 0 && (

              <button
                onClick={clearAll}
                className="bg-red-500 text-white px-5 py-3 rounded-2xl shadow-sm hover:bg-red-600 transition"
              >

                Clear All

              </button>

            )}

          </div>

        </div>

        {/* ================= STATS ================= */}

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 mb-8">

          {/* TOTAL */}

          <div className="bg-white border border-gray-200 rounded-[28px] p-7 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Total Trips
                </p>

                <h2 className="text-4xl font-bold text-gray-900 mt-2">
                  {totalTrips}
                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">

                <FaMapMarkedAlt className="text-blue-600 text-2xl" />

              </div>

            </div>

          </div>

          {/* BUDGET */}

          <div className="bg-white border border-gray-200 rounded-[28px] p-7 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500">
                  Average Budget
                </p>

                <h2 className="text-4xl font-bold text-gray-900 mt-2">
                  ₹ {avgBudget}
                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">

                <FaWallet className="text-green-600 text-2xl" />

              </div>

            </div>

          </div>

        </div>

        {/* ================= FILTERS ================= */}

        <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-[28px] p-5 shadow-sm mb-8">

          <div className="grid md:grid-cols-[1fr_220px] gap-4">

            {/* SEARCH */}

            <div className="relative">

              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search destination..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl pl-12 pr-5 py-4 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition"
              />

            </div>

            {/* BUDGET */}

            <input
              type="number"
              placeholder="Max Budget"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="border border-gray-200 rounded-2xl px-5 py-4 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white transition"
            />

          </div>

        </div>

        {/* ================= TRIPS ================= */}

        {loading ? (

          <div className="text-center py-20 text-gray-500">
            Loading trips...
          </div>

        ) : filteredTrips.length === 0 ? (

          <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-[28px] p-16 text-center shadow-sm">

            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">

              <FaMapMarkedAlt className="text-4xl text-blue-600" />

            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              No Trips Found
            </h2>

            <p className="text-gray-500">
              Start planning your next journey with AI
            </p>

          </div>

        ) : (

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredTrips.map((trip) => (

              <div
                key={trip.id}
                className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm hover:shadow-lg transition duration-300"
              >

                {/* TOP */}

                <div className="flex items-start justify-between">

                  <div>

                    <h2 className="text-2xl font-bold text-gray-900">
                      {trip.destination}
                    </h2>

                    <p className="text-sm text-gray-400 mt-2">
                      {trip.created_at}
                    </p>

                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">

                    <FaMapMarkedAlt className="text-blue-600 text-xl" />

                  </div>

                </div>

                {/* INFO */}

                <div className="grid grid-cols-2 gap-4 mt-6">

                  <div className="bg-gray-50 rounded-2xl p-4">

                    <p className="text-sm text-gray-500">
                      Budget
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mt-1">
                      ₹ {trip.budget}
                    </h3>

                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">

                    <p className="text-sm text-gray-500">
                      Days
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mt-1">
                      {trip.days || "-"}
                    </h3>

                  </div>

                </div>

                {/* BUTTONS */}

                <div className="flex gap-3 mt-6">

                  <button
                    onClick={() => setSelectedTrip(trip)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition"
                  >

                    <FaEye />

                    View

                  </button>

                  <button
                    onClick={() => deleteTrip(trip.id)}
                    className="w-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-100 transition"
                  >

                    <FaTrash />

                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* ================= MODAL ================= */}

        {selectedTrip && (

          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">

              {/* TOP */}

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h2 className="text-3xl font-bold text-gray-900">
                    {selectedTrip.destination}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Saved Trip Details
                  </p>

                </div>

                <button
                  onClick={() => setSelectedTrip(null)}
                  className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 transition"
                >

                  ✕

                </button>

              </div>

              {/* ITINERARY */}

              <div className="space-y-5">

                {selectedTrip.itinerary.map((day, i) => (

                  <div
                    key={i}
                    className="border border-gray-200 rounded-3xl p-6"
                  >

                    <h3 className="text-xl font-semibold text-blue-600 mb-4">

                      {day.title}

                    </h3>

                    <div className="space-y-3">

                      {day.activities?.map((activity, j) => (

                        <div
                          key={j}
                          className="flex items-center gap-3 text-gray-700"
                        >

                          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">

                            <FaCalendarAlt />

                          </div>

                          <p>{activity}</p>

                        </div>

                      ))}

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        )}

      </div>

    </>
  );
}
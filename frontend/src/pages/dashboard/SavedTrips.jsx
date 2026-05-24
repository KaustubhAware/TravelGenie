import {
  useEffect,
  useState,
  useMemo,
} from "react";

import {
  Toaster,
  toast,
} from "react-hot-toast";

import {
  useNavigate,
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

import {
  FaTrash,
  FaEye,
  FaSyncAlt,
  FaMapMarkedAlt,
  FaWallet,
  FaCalendarAlt,
  FaSearch,
  FaClock,
  FaMountain,
} from "react-icons/fa";

export default function SavedTrips() {

  const navigate =
    useNavigate();

  const [trips, setTrips] =
    useState([]);

  const [
    selectedTrip,
    setSelectedTrip,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [maxBudget, setMaxBudget] =
    useState("");

  const API =
    "http://127.0.0.1:8000/api";

  /* ===================================================== */
  /* SAFE PARSE */
  /* ===================================================== */

  const parseItinerary =
    (data) => {

      try {

        return typeof data ===
          "string"

          ? JSON.parse(data)

          : data || [];

      } catch {

        return [];

      }

    };

  /* ===================================================== */
  /* FETCH */
  /* ===================================================== */

  const fetchTrips =
    async (firebaseUser) => {

      setLoading(true);

      const user =
        firebaseUser || auth.currentUser;

      if (!user) {

        setTrips([]);
        setLoading(false);
        return;

      }

      try {

        const token =
          await user.getIdToken();

        const res =
          await fetch(

            `${API}/my-itineraries`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        const data =
          await res.json();

        if (!res.ok) {

          throw new Error();

        }

        const formatted =
          (
            data.trips || []
          ).map((trip) => ({

            ...trip,

            destination:
              trip.destination ||

              "Unknown",

            itinerary:
              parseItinerary(
                trip.itinerary
              ),

            budget:
              Number(
                trip.budget
              ) || 0,

          }));

        setTrips(
          formatted
        );

      } catch (err) {

        console.error(err);

        toast.error(
          "Failed to load trips"
        );

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      if (!user) {
        setTrips([]);
        setLoading(false);
        return;
      }

      await fetchTrips(user);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  /* ===================================================== */
  /* FILTER */
  /* ===================================================== */

  const filteredTrips =
    useMemo(() => {

      let result =
        [...trips];

      if (search) {

        result =
          result.filter((trip) =>

            trip.destination

              .toLowerCase()

              .includes(
                search.toLowerCase()
              )

          );

      }

      if (maxBudget) {

        result =
          result.filter(

            (trip) =>

              trip.budget <=
              Number(maxBudget)

          );

      }

      return result;

    }, [
      trips,
      search,
      maxBudget,
    ]);

  /* ===================================================== */
  /* DELETE */
  /* ===================================================== */

  const deleteTrip =
    async (id) => {

      if (
        !window.confirm(
          "Delete this trip?"
        )
      ) {

        return;

      }

      const user =
        auth.currentUser;

      if (!user) {

        return;

      }

      try {

        const token =
          await user.getIdToken();

        const res =
          await fetch(

            `${API}/delete-trip/${id}`,

            {

              method: "DELETE",

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        if (!res.ok) {

          throw new Error();

        }

        toast.success(
          "Trip deleted"
        );

        fetchTrips();

      } catch {

        toast.error(
          "Delete failed"
        );

      }

    };

  /* ===================================================== */
  /* CLEAR ALL */
  /* ===================================================== */

  const clearAll =
    async () => {

      if (
        !window.confirm(
          "Delete all saved trips?"
        )
      ) {

        return;

      }

      const user =
        auth.currentUser;

      if (!user) {

        return;

      }

      try {

        const token =
          await user.getIdToken();

        await Promise.all(

          trips.map((trip) =>

            fetch(

              `${API}/delete-trip/${trip.id}`,

              {

                method: "DELETE",

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                },

              }

            )

          )

        );

        toast.success(
          "All trips deleted"
        );

        fetchTrips();

      } catch {

        toast.error(
          "Failed to clear trips"
        );

      }

    };

  /* ===================================================== */
  /* STATS */
  /* ===================================================== */

  const totalTrips =
    trips.length;

  const avgBudget =

    trips.length > 0

      ? Math.round(

          trips.reduce(

            (sum, t) =>

              sum + t.budget,

            0

          ) /

            trips.length

        )

      : 0;

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <>

      <Toaster position="top-right" />

      <div className="min-h-screen bg-slate-50 px-4 md:px-6 py-8">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="max-w-[1600px] mx-auto mb-8 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">

          <div>

            <p className="uppercase tracking-[0.25em] text-orange-500 text-sm font-semibold">

              AI Travel Workspace

            </p>

            <h1 className="text-4xl font-black text-slate-900 mt-3">

              Saved Trips

            </h1>

            <p className="text-slate-500 mt-3">

              Manage and revisit your AI-generated travel itineraries.

            </p>

          </div>

          {/* ACTIONS */}

          <div className="flex flex-wrap gap-3">

            <button
              onClick={fetchTrips}
              className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm hover:bg-slate-50 transition font-medium"
            >

              <FaSyncAlt />

              Refresh

            </button>

            {trips.length > 0 && (

              <button
                onClick={clearAll}
                className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-3 rounded-xl shadow-sm font-medium"
              >

                Clear All

              </button>

            )}

          </div>

        </div>

        {/* ===================================================== */}
        {/* STATS */}
        {/* ===================================================== */}

        <div className="max-w-[1600px] mx-auto grid md:grid-cols-2 gap-6 mb-8">

          {/* TOTAL */}

          <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">

                  Total Trips

                </p>

                <h2 className="text-4xl font-black text-slate-900 mt-2">

                  {totalTrips}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">

                <FaMapMarkedAlt className="text-orange-500 text-2xl" />

              </div>

            </div>

          </div>

          {/* BUDGET */}

          <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500">

                  Average Budget

                </p>

                <h2 className="text-4xl font-black text-slate-900 mt-2">

                  ₹ {avgBudget}

                </h2>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">

                <FaWallet className="text-orange-500 text-2xl" />

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================== */}
        {/* FILTERS */}
        {/* ===================================================== */}

        <div className="max-w-[1600px] mx-auto bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-8">

          <div className="grid md:grid-cols-[1fr_220px] gap-4">

            {/* SEARCH */}

            <div className="relative">

              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search destination..."
                value={search}
                onChange={(e) =>

                  setSearch(
                    e.target.value
                  )

                }
                className="w-full border border-slate-200 rounded-xl pl-12 pr-5 py-4 bg-slate-50 outline-none focus:border-orange-500 focus:bg-white transition"
              />

            </div>

            {/* BUDGET */}

            <input
              type="number"
              placeholder="Max Budget"
              value={maxBudget}
              onChange={(e) =>

                setMaxBudget(
                  e.target.value
                )

              }
              className="border border-slate-200 rounded-xl px-5 py-4 bg-slate-50 outline-none focus:border-orange-500 focus:bg-white transition"
            />

          </div>

        </div>

        {/* ===================================================== */}
        {/* LOADING */}
        {/* ===================================================== */}

        {loading ? (

          <div className="text-center py-24">

            <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />

            <p className="mt-5 text-slate-500">

              Loading saved trips...

            </p>

          </div>

        ) : filteredTrips.length === 0 ? (

          /* ===================================================== */
          /* EMPTY */
          /* ===================================================== */

          <div className="max-w-[1600px] mx-auto bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">

            <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">

              <FaMapMarkedAlt className="text-4xl text-orange-500" />

            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-3">

              No Trips Found

            </h2>

            <p className="text-slate-500">

              Start planning your next adventure using AI.

            </p>

          </div>

        ) : (

          /* ===================================================== */
          /* GRID */
          /* ===================================================== */

          <div className="max-w-[1600px] mx-auto grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredTrips.map((trip) => (

              <div
                key={trip.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >

                {/* ===================================================== */}
                {/* IMAGE */}
                {/* ===================================================== */}

                <div className="relative h-52">

                  <img
                    src={
                      trip.image ||

                      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80"
                    }
                    alt={
                      trip.destination
                    }
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5">

                    <h2 className="text-3xl font-black text-white">

                      {trip.destination}

                    </h2>

                    <p className="text-white/80 mt-2 text-sm">

                      AI Generated Itinerary

                    </p>

                  </div>

                </div>

                {/* ===================================================== */}
                {/* CONTENT */}
                {/* ===================================================== */}

                <div className="p-6">

                  {/* INFO */}

                  <div className="grid grid-cols-2 gap-4">

                    <TripInfoCard
                      icon={<FaWallet />}
                      label="Budget"
                      value={`₹ ${trip.budget}`}
                    />

                    <TripInfoCard
                      icon={<FaClock />}
                      label="Days"
                      value={
                        trip.days || "-"
                      }
                    />

                  </div>

                  {/* DATE */}

                  <div className="mt-5 flex items-center gap-3 text-slate-500 text-sm">

                    <FaCalendarAlt />

                    <span>

                      {trip.created_at}

                    </span>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>

                        setSelectedTrip(
                          trip
                        )

                      }
                      className="flex-1 bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                    >

                      <FaEye />

                      View Trip

                    </button>

                    <button
                      onClick={() =>

                        deleteTrip(
                          trip.id
                        )

                      }
                      className="w-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition"
                    >

                      <FaTrash />

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* ===================================================== */}
        {/* MODAL */}
        {/* ===================================================== */}

        {selectedTrip && (

          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

              {/* TOP */}

              <div className="relative h-[220px] overflow-hidden">

                <img
                  src={
                    selectedTrip.image ||

                    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80"
                  }
                  alt={
                    selectedTrip.destination
                  }
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7 flex items-end justify-between">

                  <div>

                    <h2 className="text-4xl font-black text-white">

                      {selectedTrip.destination}

                    </h2>

                    <p className="text-white/80 mt-2">

                      Saved AI itinerary

                    </p>

                  </div>

                  <button
                    onClick={() =>

                      setSelectedTrip(
                        null
                      )

                    }
                    className="w-11 h-11 rounded-xl bg-white text-slate-900 shadow-sm"
                  >

                    ✕

                  </button>

                </div>

              </div>

              {/* CONTENT */}

              <div className="p-7">

                {/* STATS */}

                <div className="grid md:grid-cols-3 gap-4 mb-7">

                  <ModalStat
                    label="Budget"
                    value={`₹ ${selectedTrip.budget}`}
                  />

                  <ModalStat
                    label="Duration"
                    value={`${selectedTrip.days || "-"} Days`}
                  />

                  <ModalStat
                    label="Activities"
                    value={
                      selectedTrip.itinerary.length
                    }
                  />

                </div>

                {/* ITINERARY */}

                <div className="space-y-5">

                  {selectedTrip.itinerary.map(

                    (day, i) => (

                      <div
                        key={i}
                        className="border border-slate-200 rounded-2xl p-6"
                      >

                        <div className="flex items-center gap-4 mb-5">

                          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">

                            {i + 1}

                          </div>

                          <div>

                            <h3 className="text-2xl font-black text-slate-900">

                              {day.title}

                            </h3>

                            <p className="text-slate-500 text-sm mt-1">

                              Day itinerary

                            </p>

                          </div>

                        </div>

                        {/* ACTIVITIES */}

                        <div className="space-y-3">

                          {day.activities?.map(

                            (
                              activity,
                              j
                            ) => (

                              <div
                                key={j}
                                className="flex items-start gap-3 text-slate-700 bg-slate-50 rounded-xl p-4"
                              >

                                <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">

                                  <FaMountain />

                                </div>

                                <p className="leading-relaxed">

                                  {activity}

                                </p>

                              </div>

                            )

                          )}

                        </div>

                      </div>

                    )

                  )}

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </>

  );

}

/* ===================================================== */
/* SMALL CARD */
/* ===================================================== */

function TripInfoCard({
  icon,
  label,
  value,
}) {

  return (

    <div className="bg-slate-50 rounded-xl p-4">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">

          {icon}

        </div>

        <div>

          <p className="text-xs text-slate-500">

            {label}

          </p>

          <h3 className="font-bold text-slate-900 mt-1">

            {value}

          </h3>

        </div>

      </div>

    </div>

  );

}

/* ===================================================== */
/* MODAL STAT */
/* ===================================================== */

function ModalStat({
  label,
  value,
}) {

  return (

    <div className="bg-slate-50 rounded-2xl p-5">

      <p className="text-slate-500 text-sm">

        {label}

      </p>

      <h3 className="text-2xl font-black text-slate-900 mt-2">

        {value}

      </h3>

    </div>

  );

}
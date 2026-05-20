import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  FaClock,
  FaMapMarkerAlt,
  FaMountain,
  FaUsers,
  FaCheckCircle,
  FaStar,
  FaHotel,
  FaBus,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  API_BASE,
} from "../services/httpClient";

export default function DashboardPackageDetail() {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [searchParams] =
    useSearchParams();

  const aiMode =
    searchParams.get("ai");

  const [pkg, setPkg] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ===================================================== */
  /* FETCH PACKAGE */
  /* ===================================================== */

  useEffect(() => {

    if (!id || id === "undefined") {

      console.error(
        "INVALID PACKAGE ID:",
        id
      );

      setError(
        "Invalid package ID"
      );

      setLoading(false);

      return;

    }

    const fetchPackage =
      async () => {

        try {

          setLoading(true);

          const res = await fetch(
            `${API_BASE}/packages/${id}`
          );

          if (!res.ok) {

            throw new Error(
              `Failed to fetch package (${res.status})`
            );

          }

          const data =
            await res.json();

          console.log(
            "PACKAGE DETAIL:",
            data
          );

          setPkg(data);

        } catch (error) {

          console.error(
            "PACKAGE DETAIL ERROR:",
            error
          );

          setError(
            error.message ||
            "Failed to load package"
          );

        } finally {

          setLoading(false);

        }

      };

    fetchPackage();

  }, [id]);

  /* ===================================================== */
  /* ITINERARY */
  /* ===================================================== */

  const itineraryList =
    useMemo(() => {

      if (!pkg?.itinerary) {

        return [];

      }

      return String(
        pkg.itinerary
      )
        .split(/\r?\n/)
        .map((item) =>
          item.trim()
        )
        .filter((item) =>
          item.length > 0
        );

    }, [pkg]);

  /* ===================================================== */
  /* INCLUDED */
  /* ===================================================== */

  const includedList =
    useMemo(() => {

      if (!pkg?.included) {

        return [];

      }

      return String(
        pkg.included
      )
        .split(",")
        .map((item) =>
          item.trim()
        )
        .filter((item) =>
          item.length > 0
        );

    }, [pkg]);

  /* ===================================================== */
  /* EXCLUDED */
  /* ===================================================== */

  const excludedList =
    useMemo(() => {

      if (!pkg?.excluded) {

        return [];

      }

      return String(
        pkg.excluded
      )
        .split(",")
        .map((item) =>
          item.trim()
        )
        .filter((item) =>
          item.length > 0
        );

    }, [pkg]);

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-[500px]">

        <div className="w-14 h-14 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />

      </div>

    );

  }

  /* ===================================================== */
  /* ERROR */
  /* ===================================================== */

  if (error) {

    return (

      <div className="bg-white rounded-[32px] border border-red-100 p-12 text-center">

        <h2 className="text-4xl font-black text-red-600">

          Failed To Load Package

        </h2>

        <p className="text-slate-500 mt-4">

          {error}

        </p>

      </div>

    );

  }

  /* ===================================================== */
  /* EMPTY */
  /* ===================================================== */

  if (!pkg) {

    return (

      <div className="bg-white rounded-[32px] border border-slate-200 p-12 text-center">

        <h2 className="text-4xl font-black text-slate-900">

          Package Not Found

        </h2>

      </div>

    );

  }

  return (

    <div className="space-y-8">

      {/* HERO */}

      <div className="relative overflow-hidden rounded-[36px] min-h-[520px] shadow-xl">

        <img
          src={
            pkg.image ||

            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80"
          }
          alt={pkg.title || "Package"}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

        <div className="relative z-10 flex flex-col justify-end min-h-[520px] p-8 md:p-14">

          <div className="flex flex-wrap gap-3 mb-6">

            <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">

              {pkg.category || "Adventure"}

            </span>

            <span className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm">

              Guided Expedition

            </span>

            <span className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">

              <FaStar className="text-yellow-400" />

              {pkg.rating || 4.8}

            </span>

          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white max-w-5xl leading-tight">

            {pkg.title}

          </h1>

          <div className="flex flex-wrap gap-6 mt-8 text-white/90 text-sm md:text-base">

            <div className="flex items-center gap-2">

              <FaClock />

              <span>
                {pkg.duration || "5 Days"}
              </span>

            </div>

            <div className="flex items-center gap-2">

              <FaMountain />

              <span>
                {pkg.difficulty || "Moderate"}
              </span>

            </div>

            <div className="flex items-center gap-2">

              <FaMapMarkerAlt />

              <span>
                {pkg.destination || "India"}
              </span>

            </div>

            <div className="flex items-center gap-2">

              <FaUsers />

              <span>
                {pkg.group_size || "15 People"}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="grid xl:grid-cols-[1fr_380px] gap-8">

        {/* LEFT */}

        <div className="space-y-8">

          {/* ABOUT */}

          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">

            <h2 className="text-3xl font-black text-slate-900 mb-6">

              About This Trek

            </h2>

            <p className="text-slate-600 leading-relaxed text-lg">

              {pkg.description}

            </p>

          </div>

          {/* INCLUDED */}

          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">

            <h2 className="text-3xl font-black text-slate-900 mb-8">

              Included Services

            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              {(includedList.length
                ? includedList
                : [
                    "Accommodation",
                    "Meals",
                    "Professional Trek Guide",
                    "Camping Equipment",
                  ]).map((item, index) => (

                <div
                  key={index}
                  className="flex items-start gap-4 border border-slate-100 rounded-2xl p-5"
                >

                  <FaCheckCircle className="text-emerald-600 mt-1" />

                  <p className="text-slate-700">

                    {item}

                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* EXCLUDED */}

          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">

            <h2 className="text-3xl font-black text-slate-900 mb-8">

              Excluded Services

            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              {(excludedList.length
                ? excludedList
                : [
                    "Personal Expenses",
                    "Insurance",
                    "Extra Activities",
                    "Private Transport",
                  ]).map((item, index) => (

                <div
                  key={index}
                  className="flex items-start gap-4 border border-slate-100 rounded-2xl p-5"
                >

                  <FaCheckCircle className="text-red-500 mt-1" />

                  <p className="text-slate-700">

                    {item}

                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* ITINERARY */}

          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">

            <h2 className="text-3xl font-black text-slate-900 mb-8">

              Trek Itinerary

            </h2>

            <div className="space-y-5">

              {(itineraryList.length
                ? itineraryList
                : [
                    "Arrival and check-in",
                    "Trek begins",
                    "Camping and summit experience",
                    "Return journey",
                  ]).map((day, index) => (

                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl p-6"
                >

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">

                      {index + 1}

                    </div>

                    <div>

                      <h3 className="text-xl font-bold text-slate-900">

                        Day {index + 1}

                      </h3>

                      <p className="text-slate-600 mt-2 leading-relaxed">

                        {day}

                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* HOTEL DETAILS */}

          {pkg.hotel_details && (

            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">

              <div className="flex items-center gap-3 mb-6">

                <FaHotel className="text-emerald-600 text-2xl" />

                <h2 className="text-3xl font-black text-slate-900">

                  Hotel Details

                </h2>

              </div>

              <p className="text-slate-600 leading-relaxed text-lg">

                {pkg.hotel_details}

              </p>

            </div>

          )}

          {/* TRANSPORT DETAILS */}

          {pkg.transport_details && (

            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">

              <div className="flex items-center gap-3 mb-6">

                <FaBus className="text-emerald-600 text-2xl" />

                <h2 className="text-3xl font-black text-slate-900">

                  Transport Details

                </h2>

              </div>

              <p className="text-slate-600 leading-relaxed text-lg">

                {pkg.transport_details}

              </p>

            </div>

          )}

        </div>

        {/* SIDEBAR */}

        <div className="space-y-6">

          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm sticky top-24">

            <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">

              Starting From

            </p>

            <h2 className="text-5xl font-black text-emerald-600 mt-3">

              ₹{pkg.price || 0}

            </h2>

            <div className="space-y-4 mt-8">

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                <span className="text-slate-500">
                  Best Season
                </span>

                <span className="font-bold text-slate-900">
                  {pkg.best_season || "All Season"}
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                <span className="text-slate-500">
                  Altitude
                </span>

                <span className="font-bold text-slate-900">
                  {pkg.altitude || "N/A"}
                </span>

              </div>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">

                <span className="text-slate-500">
                  Group Size
                </span>

                <span className="font-bold text-slate-900">
                  {pkg.group_size || "15 People"}
                </span>

              </div>

              <div className="flex items-center justify-between pb-2">

                <span className="text-slate-500">
                  Duration
                </span>

                <span className="font-bold text-slate-900 flex items-center gap-2">

                  <FaCalendarAlt />

                  {pkg.duration || "5 Days"}
                </span>

              </div>

            </div>

            <div className="space-y-4 mt-10">

              <button
                onClick={() =>

                  navigate(
                    "/dashboard/booking",
                    {
                      state: {
                        package_id: pkg.id,
                        package: pkg,
                      },
                    }
                  )

                }
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold shadow-lg hover:shadow-2xl transition"
              >

                Book This Trek

              </button>

              <button
                onClick={() =>

                  navigate(
                    "/dashboard/ai-planner",
                    {
                      state: {
                        package: pkg,
                      },
                    }
                  )

                }
                className="w-full h-14 rounded-2xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
              >

                Customize With AI

              </button>

            </div>

            {aiMode && (

              <div className="mt-6 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">

                <h3 className="font-bold text-emerald-700">

                  AI Customization Enabled

                </h3>

                <p className="text-sm text-emerald-600 mt-2">

                  Customize budget, duration,
                  travel style, and itinerary using AI.

                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}
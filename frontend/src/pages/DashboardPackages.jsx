import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaMountain,
  FaClock,
} from "react-icons/fa";

import {
  API_BASE,
} from "../services/httpClient";

export default function DashboardPackages() {

  const navigate =
    useNavigate();

  const [packages, setPackages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* ===================================================== */
  /* FETCH PACKAGES */
  /* ===================================================== */

  useEffect(() => {

    const fetchPackages =
      async () => {

        try {

          const res = await fetch(
            `${API_BASE}/packages`
          );

          const data =
            await res.json();

          console.log(
            "RAW PACKAGE RESPONSE:",
            data
          );

          /* ===================================================== */
          /* SAFE ARRAY */
          /* ===================================================== */

          const safePackages =

            Array.isArray(data)

              ? data

              : Array.isArray(data.packages)

              ? data.packages

              : Array.isArray(data.data)

              ? data.data

              : [];

          console.log(
            "SAFE PACKAGES:",
            safePackages
          );

          /* ===================================================== */
          /* DEBUG EACH PACKAGE */
          /* ===================================================== */

          safePackages.forEach(
            (pkg, index) => {

              console.log(
                `PACKAGE ${index}:`,
                pkg
              );

            }
          );

          setPackages(
            safePackages
          );

        } catch (error) {

          console.error(
            "PACKAGE FETCH ERROR:",
            error
          );

          setPackages([]);

        } finally {

          setLoading(false);

        }

      };

    fetchPackages();

  }, []);

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-[400px]">

        <div className="w-14 h-14 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />

      </div>

    );

  }

  /* ===================================================== */
  /* EMPTY */
  /* ===================================================== */

  if (!Array.isArray(packages) || packages.length === 0) {

    return (

      <div className="bg-white rounded-[28px] border border-slate-200 p-10 text-center shadow-sm">

        <h2 className="text-3xl font-black text-slate-900">

          No Packages Available

        </h2>

        <p className="text-slate-500 mt-4 max-w-xl mx-auto">

          Trekking and expedition packages
          added by admins will appear here.

        </p>

      </div>

    );

  }

  /* ===================================================== */
  /* PAGE */
  /* ===================================================== */

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-emerald-600 mb-3">

          Explore Adventures

        </p>

        <h1 className="text-4xl font-black text-slate-900">

          Trekking & Expedition Packages

        </h1>

        <p className="text-slate-500 mt-3 max-w-3xl">

          Discover curated trekking,
          camping,
          and adventure experiences
          created by expert travel operators.

        </p>

      </div>

      {/* GRID */}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-7">

        {packages.map((pkg, index) => {

          /* ===================================================== */
          /* SAFE PACKAGE ID */
          /* ===================================================== */

          const packageId =

            pkg.id ||
            pkg.package_id ||
            pkg._id ||
            null;

          return (

            <div
              key={packageId || index}
              className="group bg-white rounded-[28px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
            >

              {/* IMAGE */}

              <div className="relative h-[240px] overflow-hidden">

                <img
                  src={
                    pkg.image ||

                    pkg.cover_image ||

                    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={
                    pkg.title ||
                    "Travel Package"
                  }
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-5 left-5">

                  <span className="bg-emerald-500 text-white text-xs px-3 py-2 rounded-full font-semibold">

                    {pkg.category ||
                      "Adventure"}

                  </span>

                </div>

              </div>

              {/* CONTENT */}

              <div className="p-6">

                <div className="flex items-start justify-between gap-4">

                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">

                    {pkg.title ||
                      "Untitled Package"}

                  </h2>

                  <div className="text-right">

                    <p className="text-xs text-slate-400">

                      Starting From

                    </p>

                    <h3 className="text-xl font-black text-emerald-600">

                      ₹{pkg.price || 0}

                    </h3>

                  </div>

                </div>

                {/* INFO */}

                <div className="flex flex-wrap gap-4 mt-5 text-sm text-slate-600">

                  <div className="flex items-center gap-2">

                    <FaClock />

                    <span>

                      {pkg.duration ||
                        "5 Days"}

                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <FaMountain />

                    <span>

                      {pkg.difficulty ||
                        "Moderate"}

                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <FaMapMarkerAlt />

                    <span>

                      {pkg.destination ||
                        "India"}

                    </span>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <p className="mt-5 text-slate-500 leading-relaxed line-clamp-3">

                  {pkg.description ||

                    "Experience premium trekking and expedition planning with guided adventure travel."}

                </p>

                {/* BUTTONS */}

                <div className="grid grid-cols-2 gap-4 mt-7">

                  {/* EXPLORE */}

                  <button
                    onClick={() => {

                      console.log(
                        "CLICKED PACKAGE:",
                        pkg
                      );

                      if (!packageId) {

                        console.error(
                          "NO PACKAGE ID FOUND",
                          pkg
                        );

                        return;

                      }

                      navigate(
                        `/dashboard/packages/${packageId}`
                      );

                    }}
                    className="h-12 rounded-2xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                  >

                    Explore

                  </button>

                  {/* AI */}

                  <button
                    onClick={() => {

                      console.log(
                        "AI PACKAGE:",
                        pkg
                      );

                      if (!packageId) {

                        console.error(
                          "NO PACKAGE ID FOUND",
                          pkg
                        );

                        return;

                      }

                      navigate(
                        `/dashboard/packages/${packageId}?ai=true`
                      );

                    }}
                    className="h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold shadow-md hover:shadow-xl transition"
                  >

                    Customize AI

                  </button>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}
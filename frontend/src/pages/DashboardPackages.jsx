import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaMountain,
  FaClock,
  FaSearch,
  FaStar,
  FaSlidersH,
  FaTimes,
  FaFire,
  FaUsers,
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

  const [search, setSearch] =
    useState("");

  const [selectedDifficulty, setSelectedDifficulty] =
    useState([]);

  const [selectedRegion, setSelectedRegion] =
    useState([]);

  const [sortBy, setSortBy] =
    useState("popular");

  const [showFilters, setShowFilters] =
    useState(false);

  // =====================================================
  // FETCH PACKAGES
  // =====================================================

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const fetchPackages =
      async () => {

      try {

        const res =
          await fetch(
            `${API_BASE}/packages`
          );

        const data =
          await res.json();

        setPackages(
          data.packages || []
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

  // =====================================================
  // FILTER TOGGLE
  // =====================================================

  const toggleFilter = (
    value,
    state,
    setState
  ) => {

    if (
      state.includes(value)
    ) {

      setState(
        state.filter(
          (item) =>
            item !== value
        )
      );

    } else {

      setState([
        ...state,
        value,
      ]);

    }

  };

  // =====================================================
  // FILTERED PACKAGES
  // =====================================================

  const filteredPackages =
    useMemo(() => {

      let filtered =
        [...packages];

      // SEARCH

      if (search.trim()) {

        filtered =
          filtered.filter((pkg) =>

            `${pkg.title}
             ${pkg.location}
             ${pkg.category}
             ${pkg.region}`

              .toLowerCase()

              .includes(
                search.toLowerCase()
              )

          );

      }

      // DIFFICULTY

      if (
        selectedDifficulty.length > 0
      ) {

        filtered =
          filtered.filter((pkg) =>

            selectedDifficulty.some(
              (diff) =>

                (
                  pkg.difficulty ||
                  ""
                )

                  .toLowerCase()

                  .includes(
                    diff.toLowerCase()
                  )
            )
          );

      }

      // REGION

      if (
        selectedRegion.length > 0
      ) {

        filtered =
          filtered.filter((pkg) =>

            selectedRegion.includes(
              pkg.region
            )
          );

      }

      // SORTING

      if (
        sortBy === "price_low"
      ) {

        filtered.sort(
          (a, b) =>
            (a.price || 0) -
            (b.price || 0)
        );

      }

      if (
        sortBy === "price_high"
      ) {

        filtered.sort(
          (a, b) =>
            (b.price || 0) -
            (a.price || 0)
        );

      }

      if (
        sortBy === "rating"
      ) {

        filtered.sort(
          (a, b) =>
            (b.rating || 0) -
            (a.rating || 0)
        );

      }

      return filtered;

    }, [
      packages,
      search,
      selectedDifficulty,
      selectedRegion,
      sortBy,
    ]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-slate-500">

            Loading adventures...

          </p>

        </div>

      </div>

    );

  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-[#f5f7fb]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">

        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />

        <div className="relative max-w-[1700px] mx-auto px-4 md:px-6 xl:px-8 py-20">

          <div className="max-w-3xl">

            <p className="uppercase tracking-[0.3em] text-indigo-300 font-bold text-sm mb-5">

              Maharashtra Adventure Platform

            </p>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">

              Discover Premium
              <br />
              Trekking Experiences

            </h1>

            <p className="text-slate-300 mt-7 text-lg leading-relaxed max-w-2xl">

              Explore Sahyadri treks,
              camping adventures,
              monsoon expeditions,
              Konkan escapes,
              and curated weekend trips.

            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="w-full max-w-[1700px] mx-auto px-4 md:px-6 xl:px-8 py-8">

        {/* MOBILE FILTER */}

        <div className="xl:hidden mb-6">

          <button
            onClick={() =>
              setShowFilters(true)
            }
            className="h-14 px-6 rounded-2xl bg-white border border-slate-200 shadow-sm font-semibold text-slate-700 flex items-center gap-3"
          >

            <FaSlidersH />

            Filters

          </button>

        </div>

        {/* =====================================================
            TOP BAR
        ===================================================== */}

        <div className="bg-white border border-slate-200 rounded-[30px] p-6 shadow-sm mb-8">

          <div className="flex flex-col xl:flex-row gap-6 xl:items-center xl:justify-between">

            {/* SEARCH */}

            <div className="relative w-full xl:max-w-[480px]">

              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search destinations, treks, regions..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-5 outline-none focus:border-indigo-500"
              />

            </div>

            {/* SORT */}

            <div className="flex flex-wrap gap-4">

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
                className="h-14 rounded-2xl border border-slate-200 bg-white px-5 min-w-[220px] outline-none"
              >

                <option value="popular">

                  Sort by Popular

                </option>

                <option value="rating">

                  Highest Rated

                </option>

                <option value="price_low">

                  Price Low to High

                </option>

                <option value="price_high">

                  Price High to Low

                </option>

              </select>

            </div>

          </div>

        </div>

        {/* =====================================================
            CONTENT GRID
        ===================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-8 items-start">

          {/* =====================================================
              FILTERS
          ===================================================== */}

          <div
            className={`fixed xl:sticky top-0 left-0 h-screen xl:h-auto z-50 xl:z-10 w-[320px] xl:w-full bg-white xl:bg-transparent transition-all duration-300 ${
              showFilters
                ? "translate-x-0"
                : "-translate-x-full xl:translate-x-0"
            }`}
          >

            <div className="bg-white border-r xl:border border-slate-200 rounded-none xl:rounded-[32px] h-full xl:h-auto overflow-y-auto shadow-xl xl:shadow-sm p-6">

              {/* MOBILE CLOSE */}

              <div className="flex items-center justify-between xl:hidden mb-8">

                <h2 className="text-2xl font-black text-slate-900">

                  Filters

                </h2>

                <button
                  onClick={() =>
                    setShowFilters(false)
                  }
                  className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
                >

                  <FaTimes />

                </button>

              </div>

              {/* DIFFICULTY */}

              <div className="mb-10">

                <h3 className="text-lg font-black text-slate-900 mb-5">

                  Difficulty

                </h3>

                <div className="space-y-4">

                  {[
                    "Easy",
                    "Moderate",
                    "Difficult",
                  ].map((item) => (

                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer text-slate-600"
                    >

                      <input
                        type="checkbox"
                        checked={selectedDifficulty.includes(item)}
                        onChange={() =>
                          toggleFilter(
                            item,
                            selectedDifficulty,
                            setSelectedDifficulty
                          )
                        }
                        className="w-4 h-4 accent-indigo-600"
                      />

                      <span className="font-medium">

                        {item}

                      </span>

                    </label>

                  ))}

                </div>

              </div>

              {/* REGION */}

              <div>

                <h3 className="text-lg font-black text-slate-900 mb-5">

                  Region

                </h3>

                <div className="space-y-4">

                  {[
                    "Western Ghats",
                    "Konkan",
                    "Pune Region",
                    "Nashik Region",
                    "Satara Region",
                  ].map((item) => (

                    <label
                      key={item}
                      className="flex items-center gap-3 cursor-pointer text-slate-600"
                    >

                      <input
                        type="checkbox"
                        checked={selectedRegion.includes(item)}
                        onChange={() =>
                          toggleFilter(
                            item,
                            selectedRegion,
                            setSelectedRegion
                          )
                        }
                        className="w-4 h-4 accent-indigo-600"
                      />

                      <span className="font-medium">

                        {item}

                      </span>

                    </label>

                  ))}

                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              RIGHT
          ===================================================== */}

          <div>

            {/* COUNT */}

            <div className="flex items-center justify-between mb-7">

              <div>

                <h2 className="text-3xl font-black text-slate-900">

                  Available Adventures

                </h2>

                <p className="text-slate-500 mt-2">

                  {filteredPackages.length}
                  {" "}
                  curated travel experiences

                </p>

              </div>

            </div>

            {/* =====================================================
                EMPTY STATE
            ===================================================== */}

            {filteredPackages.length === 0 && (

              <div className="bg-white border border-slate-200 rounded-[32px] p-14 text-center">

                <h2 className="text-3xl font-black text-slate-900">

                  No packages found

                </h2>

                <p className="text-slate-500 mt-4">

                  Try changing filters or search keywords.

                </p>

              </div>

            )}

            {/* =====================================================
                GRID
            ===================================================== */}

            <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-7">

              {filteredPackages.map((pkg) => (

                <div
                  key={pkg.id}
                  className="group bg-white border border-slate-200 rounded-[32px] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >

                  {/* IMAGE */}

                  <div className="relative h-[260px] overflow-hidden">

                    <img
                      src={
                        pkg.featured_image ||

                        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* FEATURED */}

                    {pkg.featured && (

                      <div className="absolute top-5 left-5">

                        <div className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">

                          <FaFire />

                          Featured

                        </div>

                      </div>

                    )}

                    {/* PRICE */}

                    <div className="absolute bottom-5 right-5">

                      <div className="bg-white/95 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg">

                        <h3 className="text-2xl font-black text-slate-900">

                          ₹{pkg.price}

                        </h3>

                        <p className="text-xs text-slate-500">

                          per person

                        </p>

                      </div>

                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-7">

                    {/* TITLE */}

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h2 className="text-2xl font-black text-slate-900 leading-tight">

                          {pkg.title}

                        </h2>

                        <p className="text-slate-500 mt-2">

                          {pkg.region ||
                            pkg.location}

                        </p>

                      </div>

                    </div>

                    {/* INFO */}

                    <div className="flex flex-wrap gap-4 mt-6 text-sm text-slate-500">

                      <div className="flex items-center gap-2">

                        <FaClock />

                        <span>

                          {pkg.duration}

                        </span>

                      </div>

                      <div className="flex items-center gap-2">

                        <FaMountain />

                        <span>

                          {pkg.difficulty}

                        </span>

                      </div>

                      <div className="flex items-center gap-2">

                        <FaUsers />

                        <span>

                          {pkg.group_size || 15}
                          {" "}
                          People

                        </span>

                      </div>

                    </div>

                    {/* DESCRIPTION */}

                    <p className="mt-6 text-slate-500 leading-relaxed min-h-[78px] line-clamp-3">

                      {pkg.short_description ||

                        "Experience premium trekking and adventure travel across Maharashtra."}

                    </p>

                    {/* RATING */}

                    <div className="flex items-center justify-between mt-6">

                      <div className="flex items-center gap-2">

                        <FaStar className="text-orange-400" />

                        <span className="font-black text-slate-900">

                          {pkg.rating || 4.8}

                        </span>

                      </div>

                      <span className="text-sm text-slate-400">

                        {pkg.total_reviews || 120}
                        {" "}
                        reviews

                      </span>

                    </div>

                    {/* BUTTONS */}

                    <div className="grid grid-cols-2 gap-4 mt-8">

                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/packages/${pkg.slug}`
                          )
                        }
                        className="h-13 rounded-2xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >

                        Explore

                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/packages/${pkg.slug}?ai=true`
                          )
                        }
                        className="h-13 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg hover:shadow-2xl transition"
                      >

                        Customize

                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
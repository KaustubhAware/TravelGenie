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
} from "../../services/httpClient";

export default function DashboardPackages() {

  const navigate =
    useNavigate();

  const [packages, setPackages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    selectedDifficulty,
    setSelectedDifficulty,
  ] = useState([]);

  const [
    selectedRegion,
    setSelectedRegion,
  ] = useState([]);

  const [sortBy, setSortBy] =
    useState("popular");

  const [showFilters, setShowFilters] =
    useState(false);

  /* ===================================================== */
  /* FETCH PACKAGES */
  /* ===================================================== */

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

  /* ===================================================== */
  /* FILTER TOGGLE */
  /* ===================================================== */

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

  /* ===================================================== */
  /* FILTERED PACKAGES */
  /* ===================================================== */

  const filteredPackages =
    useMemo(() => {

      let filtered =
        [...packages];

      /* SEARCH */

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

      /* DIFFICULTY */

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

      /* REGION */

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

      /* SORTING */

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

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-slate-500 font-medium">

            Loading treks...

          </p>

        </div>

      </div>

    );

  }

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <div className="min-h-screen bg-slate-50">

      {/* ===================================================== */}
      {/* PAGE HEADER */}
      {/* ===================================================== */}

      <div className="bg-white border-b border-slate-200">

        <div className="max-w-[1700px] mx-auto px-4 md:px-6 xl:px-8 py-8">

          {/* BREADCRUMB */}

          <div className="flex items-center gap-2 text-sm text-slate-400">

            <span>

              Home

            </span>

            <span>

              &gt;

            </span>

            <span className="text-slate-700 font-medium">

              Treks

            </span>

          </div>

          {/* TITLE */}

          <div className="mt-5">

            <h1 className="text-4xl font-black text-slate-900">

              All Treks

            </h1>

            <p className="text-slate-500 mt-3 text-lg">

              Find the perfect trek
              for your next adventure.

            </p>

          </div>

        </div>

      </div>

      {/* ===================================================== */}
      {/* MAIN */}
      {/* ===================================================== */}

      <div className="w-full max-w-[1700px] mx-auto px-4 md:px-6 xl:px-8 py-8">

        {/* MOBILE FILTER */}

        <div className="xl:hidden mb-6">

          <button
            onClick={() =>
              setShowFilters(true)
            }
            className="h-12 px-5 rounded-xl bg-white border border-slate-200 shadow-sm font-semibold text-slate-700 flex items-center gap-3"
          >

            <FaSlidersH />

            Filters

          </button>

        </div>

        {/* ===================================================== */}
        {/* TOP BAR */}
        {/* ===================================================== */}

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-8">

          <div className="flex flex-col xl:flex-row gap-5 xl:items-center xl:justify-between">

            {/* SEARCH */}

            <div className="relative w-full xl:max-w-[420px]">

              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search treks..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 pl-14 pr-5 outline-none focus:border-orange-500"
              />

            </div>

            {/* SORT */}

            <div className="flex gap-4">

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 min-w-[220px] outline-none"
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

        {/* ===================================================== */}
        {/* GRID */}
        {/* ===================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-8 items-start">

          {/* ===================================================== */}
          {/* FILTERS */}
          {/* ===================================================== */}

          <div
            className={`fixed xl:sticky top-0 left-0 h-screen xl:h-auto z-50 xl:z-10 w-[300px] xl:w-full bg-white xl:bg-transparent transition-all duration-300 ${
              showFilters
                ? "translate-x-0"
                : "-translate-x-full xl:translate-x-0"
            }`}
          >

            <div className="bg-white border-r xl:border border-slate-200 rounded-none xl:rounded-2xl h-full xl:h-auto overflow-y-auto shadow-lg xl:shadow-sm p-6">

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
                        className="w-4 h-4 accent-orange-500"
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
                        className="w-4 h-4 accent-orange-500"
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

          {/* ===================================================== */}
          {/* RIGHT */}
          {/* ===================================================== */}

          <div>

            {/* RESULTS */}

            <div className="flex items-center justify-between mb-7">

              <div>

                <h2 className="text-2xl font-black text-slate-900">

                  Available Adventures

                </h2>

                <p className="text-slate-500 mt-2">

                  {filteredPackages.length}
                  {" "}
                  curated experiences

                </p>

              </div>

            </div>

            {/* EMPTY */}

            {filteredPackages.length === 0 && (

              <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center">

                <h2 className="text-3xl font-black text-slate-900">

                  No packages found

                </h2>

                <p className="text-slate-500 mt-4">

                  Try different filters or keywords.

                </p>

              </div>

            )}

            {/* ===================================================== */}
            {/* CARDS */}
            {/* ===================================================== */}

            <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-6">

              {filteredPackages.map((pkg) => (

                <div
                  key={pkg.id}
                  className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >

                  {/* IMAGE */}

                  <div className="relative h-[220px] overflow-hidden">

                    <img
                      src={
                        pkg.featured_image ||

                        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* FEATURED */}

                    {pkg.featured && (

                      <div className="absolute top-4 left-4">

                        <div className="bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-full flex items-center gap-2 shadow-sm">

                          <FaFire />

                          Featured

                        </div>

                      </div>

                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="p-5">

                    {/* TITLE */}

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h2 className="text-xl font-black text-slate-900">

                          {pkg.title}

                        </h2>

                        <div className="flex items-center gap-2 text-slate-500 mt-2 text-sm">

                          <FaMapMarkerAlt />

                          <span>

                            {pkg.region ||
                              pkg.location}

                          </span>

                        </div>

                      </div>

                      <div className="flex items-center gap-1 text-orange-400 text-sm font-bold">

                        <FaStar />

                        {pkg.rating || 4.8}

                      </div>

                    </div>

                    {/* INFO */}

                    <div className="flex flex-wrap gap-4 mt-5 text-sm text-slate-500">

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

                    </div>

                    {/* PRICE */}

                    <div className="mt-5">

                      <p className="text-slate-400 text-sm">

                        Starting From

                      </p>

                      <h3 className="text-3xl font-black text-slate-900 mt-1">

                        ₹{pkg.price}

                      </h3>

                    </div>

                    {/* BUTTONS */}

                    <div className="grid grid-cols-2 gap-3 mt-6">

                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/packages/${pkg.slug}`
                          )
                        }
                        className="h-11 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >

                        Explore

                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/packages/${pkg.slug}?ai=true`
                          )
                        }
                        className="h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
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
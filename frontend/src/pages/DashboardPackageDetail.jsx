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
  FaCalendarAlt,
  FaRoute,
  FaFire,
  FaArrowRight,
} from "react-icons/fa";

import {
  API_BASE,
} from "../services/httpClient";

export default function DashboardPackageDetail() {

  const navigate =
    useNavigate();

  const { slug } =
    useParams();

  const [searchParams] =
    useSearchParams();

  const aiMode =
    searchParams.get("ai");

  // =====================================================
  // STATES
  // =====================================================

  const [pkg, setPkg] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH PACKAGE
  // =====================================================

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (!slug) {

      setError(
        "Invalid package"
      );

      setLoading(false);

      return;

    }

    const fetchPackage =
      async () => {

      try {

        setLoading(true);

        const res =
          await fetch(
            `${API_BASE}/packages/${slug}`
          );

        if (!res.ok) {

          throw new Error(
            "Failed to fetch package"
          );

        }

        const data =
          await res.json();

        setPkg(
          data.package
        );

      } catch (err) {

        console.error(
          "PACKAGE DETAIL ERROR:",
          err
        );

        setError(
          err.message ||
          "Failed to load package"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchPackage();

  }, [slug]);

  // =====================================================
  // INCLUDED
  // =====================================================

  const includedList =
    useMemo(() => {

      if (
        Array.isArray(pkg?.included)
      ) {

        return pkg.included;

      }

      return [];

    }, [pkg]);

  // =====================================================
  // EXCLUDED
  // =====================================================

  const excludedList =
    useMemo(() => {

      if (
        Array.isArray(pkg?.excluded)
      ) {

        return pkg.excluded;

      }

      return [];

    }, [pkg]);

  // =====================================================
  // ITINERARY
  // =====================================================

  const itineraryList =
    useMemo(() => {

      if (
        Array.isArray(pkg?.itinerary)
      ) {

        return pkg.itinerary;

      }

      return [];

    }, [pkg]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-slate-500">

            Loading expedition...

          </p>

        </div>

      </div>

    );

  }

  // =====================================================
  // ERROR
  // =====================================================

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

  // =====================================================
  // EMPTY
  // =====================================================

  if (!pkg) {

    return (

      <div className="bg-white rounded-[32px] border border-slate-200 p-12 text-center">

        <h2 className="text-4xl font-black text-slate-900">

          Package Not Found

        </h2>

      </div>

    );

  }

  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="min-h-screen bg-[#f5f7fb]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="relative h-[720px] overflow-hidden">

        <img
          src={
            pkg.featured_image ||

            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
          }
          alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">

          {/* BADGES */}

          <div className="flex flex-wrap gap-4 mb-8">

            <div className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold">

              {pkg.category || "Adventure"}

            </div>

            <div className="bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm">

              Maharashtra Expedition

            </div>

            <div className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm flex items-center gap-2 font-bold">

              <FaFire />

              Featured Trek

            </div>

          </div>

          {/* TITLE */}

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight max-w-5xl">

            {pkg.title}

          </h1>

          {/* INFO */}

          <div className="flex flex-wrap gap-7 mt-10 text-white/90">

            <InfoItem
              icon={<FaClock />}
              text={
                pkg.duration ||
                "2 Days"
              }
            />

            <InfoItem
              icon={<FaMountain />}
              text={
                pkg.difficulty ||
                "Moderate"
              }
            />

            <InfoItem
              icon={<FaMapMarkerAlt />}
              text={
                pkg.location ||
                "Maharashtra"
              }
            />

            <InfoItem
              icon={<FaUsers />}
              text={`${pkg.group_size || 15} People`}
            />

          </div>

        </div>

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid xl:grid-cols-[1fr_400px] gap-8 items-start">

          {/* =====================================================
              LEFT
          ===================================================== */}

          <div className="space-y-8">

            {/* ABOUT */}

            <SectionCard title="About This Adventure">

              <p className="text-slate-600 leading-relaxed text-lg">

                {pkg.full_description ||

                  pkg.short_description ||

                  "Experience premium trekking and adventure travel across Maharashtra."}

              </p>

            </SectionCard>

            {/* INCLUDED */}

            <SectionCard title="Included Services">

              <div className="grid md:grid-cols-2 gap-5">

                {(includedList.length
                  ? includedList
                  : [
                      "Accommodation",
                      "Meals",
                      "Professional Guide",
                      "Camping Equipment",
                    ]).map((item, index) => (

                  <FeatureCard
                    key={index}
                    item={item}
                    color="emerald"
                  />

                ))}

              </div>

            </SectionCard>

            {/* EXCLUDED */}

            <SectionCard title="Excluded Services">

              <div className="grid md:grid-cols-2 gap-5">

                {(excludedList.length
                  ? excludedList
                  : [
                      "Personal Expenses",
                      "Insurance",
                      "Private Transport",
                      "Extra Activities",
                    ]).map((item, index) => (

                  <FeatureCard
                    key={index}
                    item={item}
                    color="red"
                  />

                ))}

              </div>

            </SectionCard>

            {/* ITINERARY */}

            <SectionCard title="Trip Itinerary">

              <div className="space-y-5">

                {(itineraryList.length
                  ? itineraryList
                  : [
                      {
                        title: "Arrival",
                        description: "Reach base camp",
                      },
                      {
                        title: "Adventure",
                        description: "Trek & exploration",
                      },
                    ]).map((day, index) => (

                  <div
                    key={index}
                    className="border border-slate-200 rounded-3xl p-6"
                  >

                    <div className="flex gap-5">

                      <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg shrink-0">

                        {index + 1}

                      </div>

                      <div>

                        <h3 className="text-2xl font-bold text-slate-900">

                          {day.title ||
                            `Day ${index + 1}`}

                        </h3>

                        <p className="text-slate-600 mt-3 leading-relaxed">

                          {day.description ||
                            day}

                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </SectionCard>

          </div>

          {/* =====================================================
              SIDEBAR
          ===================================================== */}

          <div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm sticky top-24">

              <p className="uppercase tracking-[0.25em] text-slate-500 text-sm font-bold">

                Starting From

              </p>

              <h2 className="text-6xl font-black text-indigo-600 mt-4">

                ₹{pkg.price || 0}

              </h2>

              {/* DETAILS */}

              <div className="space-y-5 mt-10">

                <SidebarRow
                  label="Best Season"
                  value={
                    pkg.best_season ||
                    "All Season"
                  }
                />

                <SidebarRow
                  label="Altitude"
                  value={
                    pkg.altitude ||
                    "N/A"
                  }
                />

                <SidebarRow
                  label="Trek Distance"
                  value={
                    pkg.trek_distance ||
                    "N/A"
                  }
                />

                <SidebarRow
                  label="Duration"
                  value={
                    pkg.duration ||
                    "2 Days"
                  }
                />

                <SidebarRow
                  label="Group Size"
                  value={`${pkg.group_size || 15} People`}
                />

              </div>

              {/* BUTTONS */}

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
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg hover:shadow-2xl transition flex items-center justify-center gap-3"
                >

                  Book This Adventure

                  <FaArrowRight />

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

              {/* AI BOX */}

              {aiMode && (

                <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-3xl p-6">

                  <h3 className="font-bold text-indigo-700 text-lg">

                    AI Customization Enabled

                  </h3>

                  <p className="text-sm text-indigo-600 mt-3 leading-relaxed">

                    Customize itinerary,
                    travel style,
                    budget,
                    and experiences using AI.

                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

// =====================================================
// SECTION CARD
// =====================================================

function SectionCard({
  title,
  children,
}) {

  return (

    <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">

      <h2 className="text-3xl font-black text-slate-900 mb-8">

        {title}

      </h2>

      {children}

    </div>

  );

}

// =====================================================
// INFO ITEM
// =====================================================

function InfoItem({
  icon,
  text,
}) {

  return (

    <div className="flex items-center gap-3 text-sm md:text-base">

      {icon}

      <span>{text}</span>

    </div>

  );

}

// =====================================================
// FEATURE CARD
// =====================================================

function FeatureCard({
  item,
  color,
}) {

  return (

    <div className="flex items-start gap-4 border border-slate-100 rounded-2xl p-5">

      <FaCheckCircle
        className={`mt-1 ${
          color === "red"
            ? "text-red-500"
            : "text-emerald-600"
        }`}
      />

      <p className="text-slate-700">

        {item}

      </p>

    </div>

  );

}

// =====================================================
// SIDEBAR ROW
// =====================================================

function SidebarRow({
  label,
  value,
}) {

  return (

    <div className="flex items-center justify-between border-b border-slate-100 pb-4">

      <span className="text-slate-500">

        {label}

      </span>

      <span className="font-bold text-slate-900">

        {value}

      </span>

    </div>

  );

}
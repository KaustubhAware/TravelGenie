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
  FaFire,
  FaArrowRight,
  FaDownload,
} from "react-icons/fa";

import {
  API_BASE,
} from "../../services/httpClient";

import ReviewSection from "../../components/reviews/ReviewSection";

export default function DashboardPackageDetail() {

  const navigate =
    useNavigate();

  const { slug } =
    useParams();

  const [searchParams] =
    useSearchParams();

  const aiMode =
    searchParams.get("ai");

  /* ===================================================== */
  /* STATES */
  /* ===================================================== */

  const [pkg, setPkg] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("overview");

  /* ===================================================== */
  /* FETCH */
  /* ===================================================== */

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
          err
        );

        setError(
          err.message
        );

      } finally {

        setLoading(false);

      }

    };

    fetchPackage();

  }, [slug]);

  /* ===================================================== */
  /* MEMO */
  /* ===================================================== */

  const itineraryList =
    useMemo(() => {

      if (
        Array.isArray(pkg?.itinerary)
      ) {

        return pkg.itinerary;

      }

      return [];

    }, [pkg]);

  const includedList =
    useMemo(() => {

      if (
        Array.isArray(pkg?.included)
      ) {

        return pkg.included;

      }

      return [];

    }, [pkg]);

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-slate-500 font-medium">

            Loading trek details...

          </p>

        </div>

      </div>

    );

  }

  /* ===================================================== */
  /* ERROR */
  /* ===================================================== */

  if (error) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">

        <div className="bg-white border border-red-100 rounded-2xl p-10 max-w-xl w-full text-center">

          <h2 className="text-3xl font-black text-red-600">

            Failed To Load Package

          </h2>

          <p className="mt-4 text-slate-500">

            {error}

          </p>

        </div>

      </div>

    );

  }

  /* ===================================================== */
  /* EMPTY */
  /* ===================================================== */

  if (!pkg) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">

          <h2 className="text-3xl font-black text-slate-900">

            Package Not Found

          </h2>

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
      {/* TOP */}
      {/* ===================================================== */}

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8 pt-8">

        {/* BREADCRUMB */}

        <div className="flex items-center gap-2 text-sm text-slate-400 mb-5">

          <span>

            Home

          </span>

          <span>

            &gt;

          </span>

          <span>

            Treks

          </span>

          <span>

            &gt;

          </span>

          <span className="text-slate-700 font-semibold">

            {pkg.title}

          </span>

        </div>

        {/* HERO IMAGE */}

        <div className="relative h-[340px] rounded-3xl overflow-hidden border border-slate-200">

          <img
            src={
              pkg.featured_image ||

              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
            }
            alt={pkg.title}
            className="w-full h-full object-cover"
          />

          {/* FEATURED */}

          <div className="absolute top-5 left-5">

            <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">

              <FaFire />

              Best Seller

            </div>

          </div>

        </div>

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="bg-white border border-slate-200 rounded-3xl p-7 mt-6">

          <div className="flex flex-col xl:flex-row gap-8 xl:items-start xl:justify-between">

            {/* LEFT */}

            <div>

              <h1 className="text-4xl font-black text-slate-900">

                {pkg.title}

              </h1>

              <div className="flex items-center gap-2 text-slate-500 mt-3">

                <FaMapMarkerAlt />

                <span>

                  {pkg.location ||
                    "Maharashtra"}

                </span>

              </div>

              {/* INFO */}

              <div className="flex flex-wrap gap-5 mt-6">

                <InfoPill
                  icon={<FaClock />}
                  text={
                    pkg.duration ||
                    "6 Days / 5 Nights"
                  }
                />

                <InfoPill
                  icon={<FaMountain />}
                  text={
                    pkg.difficulty ||
                    "Easy - Moderate"
                  }
                />

                <InfoPill
                  icon={<FaUsers />}
                  text={`${pkg.group_size || 12} People`}
                />

                <InfoPill
                  icon={<FaStar />}
                  text={`${pkg.rating || 4.8} Rating`}
                />

              </div>

            </div>

            {/* RIGHT */}

            <div className="xl:text-right">

              <p className="text-slate-400 text-sm uppercase tracking-wider">

                Starting From

              </p>

              <h2 className="text-4xl font-black text-slate-900 mt-2">

                ₹{pkg.price}

              </h2>

              <p className="text-slate-500 text-sm mt-1">

                per person

              </p>

              {/* BUTTONS */}

              <div className="flex flex-col gap-3 mt-6 min-w-[260px]">

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
                  className="h-12 rounded-xl bg-orange-500 hover:bg-orange-600 transition text-white font-semibold flex items-center justify-center gap-2"
                >

                  Check Availability

                </button>

                <button
                  className="h-12 rounded-xl border border-slate-300 hover:bg-slate-50 transition text-slate-700 font-semibold flex items-center justify-center gap-2"
                >

                  <FaDownload />

                  Download PDF

                </button>

              </div>

            </div>

          </div>

          {/* ===================================================== */}
          {/* TABS */}
          {/* ===================================================== */}

          <div className="flex flex-wrap gap-8 mt-8 border-b border-slate-200">

            {[
              "overview",
              "itinerary",
              "inclusions",
              "faq",
              "reviews",
            ].map((tab) => (

              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`pb-4 capitalize text-sm font-semibold border-b-2 transition ${
                  activeTab === tab
                    ? "border-orange-500 text-orange-500"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >

                {tab}

              </button>

            ))}

          </div>

        </div>

        {/* ===================================================== */}
        {/* CONTENT */}
        {/* ===================================================== */}

        <div className="grid xl:grid-cols-[1fr_340px] gap-7 mt-7 items-start">

          {/* ===================================================== */}
          {/* LEFT */}
          {/* ===================================================== */}

          <div className="space-y-7">

            {/* OVERVIEW */}

            {activeTab ===
              "overview" && (

              <div className="grid lg:grid-cols-3 gap-6">

                {/* HIGHLIGHTS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                  <h3 className="text-xl font-black text-slate-900 mb-5">

                    Highlights

                  </h3>

                  <div className="space-y-5">

                    {(includedList.length
                      ? includedList
                      : [
                          "Stunning Himalayan views",
                          "Perfect for beginners",
                          "Snow trek experience",
                          "Expert trek leaders",
                        ]).slice(0, 4)

                      .map((item, index) => (

                        <FeatureItem
                          key={index}
                          text={item}
                        />

                      ))}

                  </div>

                </div>

                {/* QUICK INFO */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                  <h3 className="text-xl font-black text-slate-900 mb-5">

                    Quick Info

                  </h3>

                  <div className="space-y-5">

                    <QuickInfoRow
                      label="Duration"
                      value={pkg.duration}
                    />

                    <QuickInfoRow
                      label="Difficulty"
                      value={pkg.difficulty}
                    />

                    <QuickInfoRow
                      label="Altitude"
                      value={
                        pkg.altitude ||
                        "12,500 ft"
                      }
                    />

                    <QuickInfoRow
                      label="Distance"
                      value={
                        pkg.trek_distance ||
                        "20 km"
                      }
                    />

                    <QuickInfoRow
                      label="Base Camp"
                      value={
                        pkg.base_camp ||
                        "Sankri"
                      }
                    />

                  </div>

                </div>

                {/* MAP */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                  <h3 className="text-xl font-black text-slate-900 mb-5">

                    Route Map

                  </h3>

                  <div className="rounded-2xl overflow-hidden border border-slate-200 h-[300px]">

                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
                      alt="map"
                      className="w-full h-full object-cover"
                    />

                  </div>

                </div>

              </div>

            )}

            {/* ITINERARY */}

            {activeTab ===
              "itinerary" && (

              <div className="bg-white border border-slate-200 rounded-2xl p-7">

                <h2 className="text-3xl font-black text-slate-900 mb-8">

                  Trek Itinerary

                </h2>

                <div className="space-y-5">

                  {(itineraryList.length
                    ? itineraryList
                    : [
                        {
                          title:
                            "Arrival At Base Camp",
                          description:
                            "Reach base camp and orientation.",
                        },
                        {
                          title:
                            "Summit Trek",
                          description:
                            "Full day trekking and exploration.",
                        },
                      ]).map((day, index) => (

                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl p-6"
                    >

                      <div className="flex gap-5">

                        <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black shrink-0">

                          {index + 1}

                        </div>

                        <div>

                          <h3 className="text-xl font-bold text-slate-900">

                            {day.title ||
                              `Day ${index + 1}`}

                          </h3>

                          <p className="text-slate-500 mt-3 leading-relaxed">

                            {day.description ||
                              day}

                          </p>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}

            {/* INCLUSIONS */}

            {activeTab ===
              "inclusions" && (

              <div className="bg-white border border-slate-200 rounded-2xl p-7">

                <h2 className="text-3xl font-black text-slate-900 mb-8">

                  Included Services

                </h2>

                <div className="grid md:grid-cols-2 gap-5">

                  {(includedList.length
                    ? includedList
                    : [
                        "Accommodation",
                        "Meals",
                        "Guide",
                        "Camping Equipment",
                      ]).map((item, index) => (

                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl p-5 flex items-start gap-4"
                    >

                      <FaCheckCircle className="text-emerald-500 mt-1" />

                      <p className="text-slate-700">

                        {item}

                      </p>

                    </div>

                  ))}

                </div>

                {pkg.excluded && (
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      Excluded
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {pkg.excluded}
                    </p>
                  </div>
                )}

              </div>

            )}

            {activeTab === "faq" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-7 space-y-5">
                <h2 className="text-3xl font-black text-slate-900">
                  Frequently asked questions
                </h2>
                {[
                  {
                    q: "Is this trek suitable for beginners?",
                    a: `Difficulty: ${pkg.difficulty || "Moderate"}. Check fitness requirements before booking.`,
                  },
                  {
                    q: "What is the best season?",
                    a: pkg.best_season || "Post-monsoon (Oct–Feb) and winter are ideal for Maharashtra Sahyadri treks.",
                  },
                  {
                    q: "What is included in the package?",
                    a: "See the Inclusions tab for meals, guides, transport, and camping details.",
                  },
                  {
                    q: "How do I reach the base village?",
                    a: "Meeting point and transport details are shared after booking confirmation.",
                  },
                ].map((item) => (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-slate-100 p-5"
                  >
                    <h3 className="font-semibold text-slate-900">{item.q}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-7">
                <ReviewSection packageId={pkg.id} showForm />
              </div>
            )}

          </div>

          {/* ===================================================== */}
          {/* SIDEBAR */}
          {/* ===================================================== */}

          <div className="space-y-6 sticky top-24">

            {/* WHY CHOOSE */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <h3 className="text-xl font-black text-slate-900 mb-6">

                Why Choose This Trek?

              </h3>

              <div className="space-y-5">

                <WhyChooseItem
                  title="Professional Guides"
                />

                <WhyChooseItem
                  title="Safety First"
                />

                <WhyChooseItem
                  title="Small Group Experience"
                />

                <WhyChooseItem
                  title="Best Price Guarantee"
                />

              </div>

            </div>

            {/* AI BOX */}

            {aiMode && (

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">

                <h3 className="text-xl font-black text-orange-600">

                  AI Planning Enabled

                </h3>

                <p className="mt-3 text-sm text-orange-500 leading-relaxed">

                  Customize itinerary,
                  budget, activities,
                  and travel preferences.

                </p>

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
                  className="mt-5 w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 transition text-white font-semibold"
                >

                  Continue AI Planning

                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

/* ===================================================== */
/* COMPONENTS */
/* ===================================================== */

function InfoPill({
  icon,
  text,
}) {

  return (

    <div className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 text-sm text-slate-700">

      {icon}

      <span className="font-medium">

        {text}

      </span>

    </div>

  );

}

function FeatureItem({
  text,
}) {

  return (

    <div className="flex gap-3">

      <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" />

      <p className="text-slate-600 text-sm leading-relaxed">

        {text}

      </p>

    </div>

  );

}

function QuickInfoRow({
  label,
  value,
}) {

  return (

    <div className="flex items-center justify-between border-b border-slate-100 pb-4">

      <span className="text-slate-500">

        {label}

      </span>

      <span className="font-semibold text-slate-900">

        {value}

      </span>

    </div>

  );

}

function WhyChooseItem({
  title,
}) {

  return (

    <div className="flex items-center gap-4">

      <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">

        <FaCheckCircle />

      </div>

      <p className="font-medium text-slate-700">

        {title}

      </p>

    </div>

  );

}
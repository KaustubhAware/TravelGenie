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
  FaCalendarAlt,
  FaCampground,
  FaShieldAlt,
  FaWater,
  FaImages,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  API_BASE,
} from "../../services/httpClient";

import ReviewSection from "../../components/reviews/ReviewSection";
import { packageService } from "../../services/packageService";
import TravelMap from "../../components/ai/TravelMap";
import { resolveImageUrl } from "../../utils/imageUrl";

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

  const [batches, setBatches] =
    useState([]);

  const [selectedBatch, setSelectedBatch] =
    useState(null);

  const [lightboxImage, setLightboxImage] =
    useState("");

  const [expandedDays, setExpandedDays] =
    useState([0]);

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

        try {
          const batchData = await packageService.getBatches(slug);
          const upcoming = batchData.batches || [];
          setBatches(upcoming);
          setSelectedBatch(upcoming[0] || null);
        } catch {
          setBatches([]);
          setSelectedBatch(null);
        }

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

  const galleryImages =
    useMemo(() => {
      const images = Array.isArray(pkg?.gallery) ? pkg.gallery.filter(Boolean) : [];
      return [
        pkg?.featured_image,
        ...images,
      ].filter(Boolean).slice(0, 8);
    }, [pkg]);

  const trekHighlights =
    useMemo(() => {
      if (Array.isArray(pkg?.highlights) && pkg.highlights.length > 0) {
        return pkg.highlights.map((item) => [item, FaStar]);
      }

      const highlights = [
        pkg?.difficulty && [`${pkg.difficulty} difficulty`, FaMountain],
        pkg?.best_season && [`Best in ${pkg.best_season}`, FaStar],
        pkg?.duration && [`${pkg.duration} duration`, FaClock],
        pkg?.altitude && [`${pkg.altitude} altitude`, FaMountain],
        pkg?.category && [pkg.category, FaCampground],
      ].filter(Boolean);

      return highlights.length
        ? highlights
        : [["Curated Maharashtra trek", FaShieldAlt]];
    }, [pkg]);

  const nearbyAttractions =
    useMemo(() => {
      if (Array.isArray(pkg?.nearby_attractions)) {
        return pkg.nearby_attractions;
      }
      return [];
    }, [pkg]);

  const downloadTrekGuide =
    async () => {
      const { exportTrekGuidePDF } = await import("../../utils/exportPDF");
      exportTrekGuidePDF(pkg, selectedBatch);
    };

  const toggleDay =
    (index) => {
      setExpandedDays((days) =>
        days.includes(index)
          ? days.filter((day) => day !== index)
          : [...days, index]
      );
    };

  const weatherInsight =
    pkg?.weather_details?.advice ||
    (String(pkg?.best_season || "").toLowerCase().includes("monsoon")
      ? "Monsoon batches can have heavy rain, slippery rock patches, and low visibility. Trek leaders may alter summit timing for safety."
      : "Best conditions are usually post-monsoon and winter, with cooler mornings and clearer Sahyadri views.");

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
            src={resolveImageUrl(pkg.featured_image)}
            alt={pkg.title}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(event) => {
              event.currentTarget.src = "/maharashtra-map.png";
            }}
          />

          {/* FEATURED */}

          <div className="absolute top-5 left-5">

            <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">

              <FaFire />

              Best Seller

            </div>

          </div>

          <div className="absolute inset-x-0 bottom-0 p-7 bg-gradient-to-t from-black/75 via-black/20 to-transparent">
            <p className="text-white/75 uppercase tracking-[0.22em] text-xs font-bold">
              Maharashtra Trek
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
              {pkg.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/90">
              <InfoPill dark icon={<FaMapMarkerAlt />} text={pkg.location || "Maharashtra"} />
              <InfoPill dark icon={<FaClock />} text={pkg.duration || "Weekend"} />
              <InfoPill dark icon={<FaMountain />} text={pkg.altitude || "Sahyadri range"} />
              <InfoPill dark icon={<FaUsers />} text={`${selectedBatch?.seats_left ?? 12} seats left`} />
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
                  text={pkg.rating ? `${pkg.rating} Rating` : "New trek"}
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
                          selected_batch: selectedBatch,
                        },
                      }
                    )

                  }
                  className="h-12 rounded-xl bg-orange-500 hover:bg-orange-600 transition text-white font-semibold flex items-center justify-center gap-2"
                >

                  Check Availability

                </button>

                <button
                  onClick={downloadTrekGuide}
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
              "schedule",
              "gallery",
              "safety",
              "nearby",
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
                        (pkg.pickup_points || [])[0] ||
                        selectedBatch?.pickup_location ||
                        "Pune"
                      }
                    />

                    <QuickInfoRow
                      label="Best Season"
                      value={pkg.best_season || "Post-monsoon"}
                    />

                  </div>

                </div>

                {/* MAP */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6">

                  <h3 className="text-xl font-black text-slate-900 mb-5">

                    Route Map

                  </h3>

                  <TravelMap
                    destination={pkg.title}
                    location={pkg.location}
                    pickupPoints={pkg.pickup_points || []}
                    nearbyAttractions={nearbyAttractions}
                    heightClass="h-[300px]"
                  />

                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:col-span-3">
                  <h3 className="text-xl font-black text-slate-900 mb-5">
                    Trek Highlights
                  </h3>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
                    {trekHighlights.map(([label, Icon]) => (
                      <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                        <Icon className="text-orange-500 text-xl" />
                        <p className="mt-3 font-semibold text-slate-800">{label}</p>
                      </div>
                    ))}
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

                    <button
                      type="button"
                      key={index}
                      onClick={() => toggleDay(index)}
                      className="w-full text-left border border-slate-200 rounded-2xl p-6 hover:bg-slate-50 transition"
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

                          {expandedDays.includes(index) && (
                            <p className="text-slate-500 mt-3 leading-relaxed">

                              {Array.isArray(day.activities)
                                ? day.activities.join(" • ")
                                : day.description ||
                                  day.activities ||
                                  day}

                            </p>
                          )}

                        </div>

                      </div>

                    </button>

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
                    <div className="grid md:grid-cols-2 gap-3">
                      {(Array.isArray(pkg.excluded) ? pkg.excluded : [pkg.excluded]).map((item, index) => (
                        <p key={index} className="rounded-xl bg-slate-50 px-4 py-3 text-slate-600 text-sm leading-relaxed">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            )}

            {activeTab === "schedule" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-7">
                <h2 className="text-3xl font-black text-slate-900 mb-3">
                  Upcoming Departures
                </h2>
                <p className="text-slate-500 mb-7">
                  Weekend batches, seats, pickup point, and booking deadlines.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {(batches.length ? batches : []).map((batch) => (
                    <button
                      type="button"
                      key={batch.id}
                      onClick={() => setSelectedBatch(batch)}
                      className={`text-left rounded-2xl border p-5 transition ${
                        selectedBatch?.id === batch.id
                          ? "border-orange-400 bg-orange-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-black text-slate-900">
                          {batch.start_date} to {batch.end_date}
                        </p>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          {batch.seats_left} seats left
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                        <span>Deadline: {batch.booking_deadline}</span>
                        <span>Pickup: {batch.pickup_location || "Pune"}</span>
                        <span>Guide: {batch.guide_name || "Assigned soon"}</span>
                        <span>{batch.batch_status}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {batches.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
                    New batch dates will be announced soon.
                  </div>
                )}
              </div>
            )}

            {activeTab === "gallery" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-7">
                <h2 className="text-3xl font-black text-slate-900 mb-7">
                  Gallery
                </h2>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setLightboxImage(image)}
                      className="relative h-56 overflow-hidden rounded-2xl border border-slate-200"
                    >
                      <img
                        src={resolveImageUrl(image)}
                        alt={pkg.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = "/maharashtra-map.png";
                        }}
                      />
                      <span className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white">
                        <FaImages />
                      </span>
                    </button>
                  ))}
                </div>
                {galleryImages.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
                    Gallery images will appear after the vendor uploads them.
                  </div>
                )}
              </div>
            )}

            {activeTab === "safety" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-7">
                <h2 className="text-3xl font-black text-slate-900 mb-7">
                  Safety & Weather
                </h2>
                <div className="grid md:grid-cols-3 gap-5">
                  <SafetyCard icon={<FaShieldAlt />} title="Fitness Required" text={pkg.fitness_required || "Check vendor fitness guidance before booking."} />
                  <SafetyCard icon={<FaExclamationTriangle />} title="Safety Notes" text={(pkg.safety_notes || []).join(" ") || "Safety notes are shared by the trek operator before departure."} />
                  <SafetyCard icon={<FaWater />} title="Weather Caution" text={weatherInsight} />
                </div>
              </div>
            )}

            {activeTab === "nearby" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-7">
                <h2 className="text-3xl font-black text-slate-900 mb-7">
                  Nearby Attractions
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {nearbyAttractions.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-5 flex items-start gap-4"
                    >
                      <FaMapMarkerAlt className="mt-1 text-orange-500" />
                      <div>
                        <h3 className="font-bold text-slate-900">{item}</h3>
                        <p className="mt-2 text-sm text-slate-600">
                          Confirm exact access and timings with the trek leader before departure.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {nearbyAttractions.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
                    Nearby attractions are being updated by the operator.
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

            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <p className="text-sm uppercase tracking-wider text-slate-400">
                Booking
              </p>
              <h3 className="text-4xl font-black text-slate-900 mt-2">
                Rs. {Number(pkg.price || 0).toLocaleString("en-IN")}
              </h3>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <QuickInfoRow label="Seats left" value={selectedBatch?.seats_left ?? "Ask operator"} />
                <QuickInfoRow label="Next batch" value={selectedBatch?.start_date || "Announcing soon"} />
                <QuickInfoRow label="Last date" value={selectedBatch?.booking_deadline || "Before departure"} />
                <QuickInfoRow label="Pickup" value={selectedBatch?.pickup_location || (pkg.pickup_points || [])[0] || "Pune"} />
              </div>
              <button
                onClick={() =>
                  navigate("/dashboard/booking", {
                    state: { package_id: pkg.id, package: pkg, selected_batch: selectedBatch },
                  })
                }
                className="mt-6 h-12 w-full rounded-xl bg-orange-500 font-semibold text-white transition hover:bg-orange-600"
              >
                Book Now
              </button>
            </div>

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

      {lightboxImage && (
        <button
          type="button"
          onClick={() => setLightboxImage("")}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-6"
        >
          <img src={resolveImageUrl(lightboxImage)} alt={pkg.title} className="max-h-full max-w-full rounded-2xl object-contain" />
        </button>
      )}

    </div>

  );

}

/* ===================================================== */
/* COMPONENTS */
/* ===================================================== */

function InfoPill({
  icon,
  text,
  dark = false,
}) {

  return (

    <div className={`h-11 px-4 rounded-xl border flex items-center gap-3 text-sm ${
      dark
        ? "border-white/20 bg-white/15 text-white backdrop-blur"
        : "border-slate-200 bg-slate-50 text-slate-700"
    }`}>

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

function SafetyCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-orange-500 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-5 font-black text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
    </div>
  );
}

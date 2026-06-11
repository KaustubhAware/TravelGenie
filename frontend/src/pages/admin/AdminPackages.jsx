import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  fetchWithAuth,
} from "../../utils/api";
import { resolveDestinationImage } from "../../utils/imageUrl";

import {
  FaSearch,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaClock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaMountain,
} from "react-icons/fa";

// =====================================================
// INITIAL FORM
// =====================================================

const initialForm = {

  title: "",

  location: "",

  region: "",

  category: "",

  duration: "",

  difficulty: "",

  trek_distance: "",

  altitude: "",

  best_season: "",

  group_size: "",

  fitness_required: "",

  travel_type: "",

  price: "",

  seasonal_price: "",

  featured_image: "",

  short_description:
    "Guided Maharashtra trek with verified local operators and clear inclusions.",

  full_description: "",

  included: "",

  excluded: "",

  pickup_points: "",

  itinerary: "",

  gallery: "",

  rating: "",

  featured: false,

};

// =====================================================
// PAGE
// =====================================================

export default function AdminPackages() {

  /* ===================================================== */
  /* STATES */
  /* ===================================================== */

  const [packages, setPackages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingPackage, setEditingPackage] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] =
    useState(initialForm);

  const [formError, setFormError] =
    useState("");

  /* ===================================================== */
  /* FETCH PACKAGES */
  /* ===================================================== */

  const fetchPackages =
    async () => {

      try {

        setLoading(true);

        // =====================================================
        // fetchWithAuth already returns JSON
        // =====================================================

        const data =
          await fetchWithAuth(
            "/admin/packages"
          );

        setPackages(
          data.packages || []
        );

      } catch (err) {

        console.error(
          "PACKAGE FETCH ERROR:",
          err
        );

        setPackages([]);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchPackages();

  }, []);

  /* ===================================================== */
  /* HANDLE CHANGE */
  /* ===================================================== */

  const handleChange =
    (e) => {

      const {
        name,
        value,
        type,
        checked,
      } = e.target;

      setFormData((prev) => ({

        ...prev,

        [name]:

          type === "checkbox"
            ? checked
            : value,

      }));

    };

  /* ===================================================== */
  /* RESET */
  /* ===================================================== */

  const resetForm =
    () => {

      setFormData(
        initialForm
      );

      setEditingPackage(null);
      setFormError("");

    };

  /* ===================================================== */
  /* CLEAN ARRAY */
  /* ===================================================== */

  const parseArray =
    (value) => {

      if (!value) return [];

      return value
        .split(",")
        .map((item) =>
          item.trim()
        )
        .filter(Boolean);

    };

  const parseItinerary =
    (value) => {
      if (!value) return [];

      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        return value
          .split("\n")
          .map((item, index) => ({
            day: index + 1,
            title: item.trim(),
            activities: item.trim(),
          }))
          .filter((item) => item.title);
      }
    };

  const buildPackagePayload = (data) => ({
    title: (data.title || "").trim(),
    location: (data.location || "").trim(),
    region: (data.region || "").trim(),
    category: (data.category || "").trim(),
    duration: (data.duration || "").trim(),
    difficulty: (data.difficulty || "").trim(),
    trek_distance: (data.trek_distance || "").trim(),
    altitude: (data.altitude || "").trim(),
    best_season: (data.best_season || "").trim(),
    group_size: Number(data.group_size) || 0,
    fitness_required: (data.fitness_required || "").trim(),
    travel_type: (data.travel_type || "").trim(),
    price: Number(data.price) || 0,
    seasonal_price: Number(data.seasonal_price) || 0,
    featured_image: (data.featured_image || "").trim(),
    short_description: (data.short_description || "").trim(),
    full_description: (data.full_description || "").trim(),
    included: parseArray(data.included),
    excluded: parseArray(data.excluded),
    pickup_points: parseArray(data.pickup_points),
    gallery: parseArray(data.gallery),
    itinerary: parseItinerary(data.itinerary),
    rating: Number(data.rating) || 0,
    featured: Boolean(data.featured),
  });

  const validatePackageForm = (data) => {
    const title = (data.title || "").trim();
    const location = (data.location || "").trim();
    const shortDescription = (data.short_description || "").trim();
    const price = Number(data.price);

    if (title.length < 3) {
      return "Package title must be at least 3 characters.";
    }

    if (location.length < 2) {
      return "Destination is required.";
    }

    if (shortDescription.length < 10) {
      return "Short description must be at least 10 characters.";
    }

    if (!Number.isFinite(price) || price < 0) {
      return "Enter a valid package price.";
    }

    if (!(data.duration || "").trim()) {
      return "Duration is required.";
    }

    if (!(data.difficulty || "").trim()) {
      return "Difficulty is required.";
    }

    return "";
  };

  /* ===================================================== */
  /* ADD PACKAGE */
  /* ===================================================== */

  const addPackage =
    async () => {

      const validationError = validatePackageForm(formData);
      if (validationError) {
        setFormError(validationError);
        return;
      }

      try {

        setSaving(true);
        setFormError("");

        await fetchWithAuth(
          "/packages",
          {
            method: "POST",

            body: JSON.stringify(
              buildPackagePayload(formData)
            ),

          }
        );

        await fetchPackages();

        setShowModal(false);

        resetForm();

      } catch (err) {

        console.error(
          "ADD PACKAGE ERROR:",
          err
        );

        setFormError(
          err.message || "Failed to add package"
        );

      } finally {

        setSaving(false);

      }

    };

  /* ===================================================== */
  /* EDIT */
  /* ===================================================== */

  const editPackage =
    (pkg) => {

      setFormError("");

      setEditingPackage(
        pkg.id
      );

      setFormData({

        title:
          pkg.title || "",

        location:
          pkg.location || "",

        region:
          pkg.region || "",

        category:
          pkg.category || "",

        duration:
          pkg.duration || "",

        difficulty:
          pkg.difficulty || "",

        trek_distance:
          pkg.trek_distance || "",

        altitude:
          pkg.altitude || "",

        best_season:
          pkg.best_season || "",

        group_size:
          pkg.group_size || "",

        fitness_required:
          pkg.fitness_required || "",

        travel_type:
          pkg.travel_type || "",

        price:
          pkg.price || "",

        seasonal_price:
          pkg.seasonal_price || "",

        featured_image:
          pkg.featured_image || "",

        short_description:
          pkg.short_description ||
          pkg.description ||
          "Guided Maharashtra trek with verified local operators and clear inclusions.",

        full_description:
          pkg.full_description || "",

        included:
          Array.isArray(
            pkg.included
          )
            ? pkg.included.join(", ")
            : "",

        excluded:
          Array.isArray(
            pkg.excluded
          )
            ? pkg.excluded.join(", ")
            : "",

        pickup_points:
          Array.isArray(
            pkg.pickup_points
          )
            ? pkg.pickup_points.join(", ")
            : "",

        itinerary:
          Array.isArray(
            pkg.itinerary
          )
            ? JSON.stringify(
                pkg.itinerary,
                null,
                2
              )
            : "",

        gallery:
          Array.isArray(
            pkg.gallery
          )
            ? pkg.gallery.join(", ")
            : "",

        rating:
          pkg.rating || "",

        featured:
          pkg.featured || false,

      });

      setShowModal(true);

    };

  /* ===================================================== */
  /* UPDATE */
  /* ===================================================== */

  const updatePackage =
    async () => {

      const validationError = validatePackageForm(formData);
      if (validationError) {
        setFormError(validationError);
        return;
      }

      try {

        setSaving(true);
        setFormError("");

        await fetchWithAuth(

          `/packages/${editingPackage}`,

          {
            method: "PUT",

            body: JSON.stringify(
              buildPackagePayload(formData)
            ),

          }

        );

        await fetchPackages();

        setShowModal(false);

        resetForm();

      } catch (err) {

        console.error(
          "UPDATE PACKAGE ERROR:",
          err
        );

        setFormError(
          err.message || "Failed to update package"
        );

      } finally {

        setSaving(false);

      }

    };

  /* ===================================================== */
  /* DELETE */
  /* ===================================================== */

  const deletePackage =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this package?"
        );

      if (!confirmDelete)
        return;

      try {

        await fetchWithAuth(
          `/packages/${id}`,
          {
            method: "DELETE",
          }
        );

        setPackages((prev) =>
          prev.filter(
            (pkg) =>
              pkg.id !== id
          )
        );

      } catch (err) {

        console.error(
          "DELETE ERROR:",
          err
        );

        window.alert(
          err.message || "Failed to delete package"
        );

      }

    };

  /* ===================================================== */
  /* FILTER */
  /* ===================================================== */

  const filteredPackages =
    useMemo(() => {

      return packages.filter(
        (pkg) =>

          `${pkg.title}
           ${pkg.location}
           ${pkg.region}`

            .toLowerCase()

            .includes(
              search.toLowerCase()
            )

      );

    }, [packages, search]);

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="flex min-h-[320px] items-center justify-center">

        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />

      </div>

    );

  }

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <div className="space-y-8">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>

          <h1 className="text-4xl font-black text-slate-900">

            Travel Packages

          </h1>

          <p className="mt-2 text-lg text-slate-500">

            Manage trekking,
            camping,
            and travel experiences.

          </p>

        </div>

        <div className="flex flex-col sm:flex-row gap-4">

          {/* SEARCH */}

          <div className="relative">

            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="h-14 w-full sm:w-[320px] rounded-2xl border border-slate-200 bg-white pl-14 pr-5 outline-none shadow-sm focus:border-orange-500"
            />

          </div>

          {/* ADD */}

          <button
            onClick={() => {

              resetForm();

              setShowModal(true);

            }}
            className="h-14 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg flex items-center justify-center gap-3 hover:shadow-2xl transition"
          >

            <FaPlus />

            Add Package

          </button>

        </div>

      </div>

      {/* ===================================================== */}
      {/* GRID */}
      {/* ===================================================== */}

      <div className="grid gap-7 sm:grid-cols-2 2xl:grid-cols-3">

        {filteredPackages.map(
          (pkg) => (

            <div
              key={pkg.id}
              className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
            >

              {/* IMAGE */}

              <div className="relative h-[240px] overflow-hidden">

                <img
                  src={resolveDestinationImage(
                    pkg.featured_image || pkg.image,
                    pkg.location || pkg.title
                  )}
                  alt={pkg.title}
                  className="w-full h-full object-cover hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {pkg.featured && (

                  <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-2 rounded-full flex items-center gap-2">

                    <FaStar />

                    Featured

                  </div>

                )}

              </div>

              {/* CONTENT */}

              <div className="p-6">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h2 className="text-2xl font-black text-slate-900">

                      {pkg.title}

                    </h2>

                    <p className="mt-1 text-slate-500">

                      {pkg.location}

                    </p>

                  </div>

                  <div className="text-right">

                    <h3 className="text-2xl font-black text-orange-500">

                      ₹{pkg.price}

                    </h3>

                    <p className="text-sm text-slate-400">

                      per person

                    </p>

                  </div>

                </div>

                {/* INFO */}

                <div className="mt-5 space-y-3">

                  <div className="flex items-center gap-3 text-slate-700">

                    <FaMapMarkedAlt className="text-orange-500" />

                    <span>

                      {pkg.region ||
                        "Maharashtra"}

                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-slate-700">

                    <FaClock className="text-amber-500" />

                    <span>

                      {pkg.duration}

                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-slate-700">

                    <FaMountain className="text-green-500" />

                    <span>

                      {pkg.difficulty}

                    </span>

                  </div>

                </div>

                {/* DESCRIPTION */}

                <p className="mt-5 text-slate-600 leading-relaxed line-clamp-3 min-h-[72px]">

                  {pkg.short_description}

                </p>

                {/* TAGS */}

                <div className="mt-5 flex flex-wrap gap-2">

                  <span className="bg-orange-50 text-orange-700 px-3 py-2 rounded-xl text-sm font-semibold">

                    {pkg.category}

                  </span>

                  <span className="bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-sm font-semibold">

                    ⭐ {pkg.rating || 4.5}

                  </span>

                </div>

                {/* BUTTONS */}

                <div className="grid grid-cols-2 gap-4 mt-7">

                  <button
                    onClick={() =>
                      editPackage(pkg)
                    }
                    className="h-12 rounded-2xl bg-amber-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition"
                  >

                    <FaEdit />

                    Edit

                  </button>

                  <button
                    onClick={() =>
                      deletePackage(
                        pkg.id
                      )
                    }
                    className="h-12 rounded-2xl bg-rose-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition"
                  >

                    <FaTrash />

                    Delete

                  </button>

                </div>

              </div>

            </div>

          )
        )}

      </div>

      {/* ===================================================== */}
      {/* EMPTY */}
      {/* ===================================================== */}

      {!loading &&
        filteredPackages.length ===
        0 && (

        <div className="text-center py-24">

          <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-6">

            <FaMapMarkedAlt className="text-orange-500 text-4xl" />

          </div>

          <h2 className="text-3xl font-black text-slate-900">

            No Packages Found

          </h2>

          <p className="text-slate-500 mt-4 text-lg">

            No travel packages available.

          </p>

        </div>

      )}

      {/* ===================================================== */}
      {/* MODAL */}
      {/* ===================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-black text-slate-900">

                  {editingPackage
                    ? "Edit Package"
                    : "Add Package"}

                </h2>

                <p className="mt-2 text-slate-500">

                  Manage trekking packages and adventures.

                </p>

              </div>

              <button
                onClick={() => {

                  setShowModal(false);

                  resetForm();

                }}
                className="px-5 py-3 rounded-2xl bg-slate-100 font-semibold text-slate-700 hover:bg-slate-200"
              >

                Close

              </button>

            </div>

            {/* FORM */}

            <div className="grid gap-6 md:grid-cols-2">

              {Object.entries(formData).map(
                ([key, value]) => {

                  if (
                    key === "featured"
                  ) {

                    return (

                      <div
                        key={key}
                        className="flex items-center gap-3"
                      >

                        <input
                          type="checkbox"
                          name={key}
                          checked={value}
                          onChange={handleChange}
                          className="w-5 h-5"
                        />

                        <label className="font-semibold text-slate-700">

                          Featured Package

                        </label>

                      </div>

                    );

                  }

                  const isTextarea =

                    key === "short_description" ||
                    key === "full_description" ||
                    key === "included" ||
                    key === "excluded" ||
                    key === "pickup_points" ||
                    key === "gallery";

                  return (

                    <div
                      key={key}
                      className={
                        isTextarea
                          ? "md:col-span-2"
                          : ""
                      }
                    >

                      <label className="block mb-2 text-sm font-bold capitalize text-slate-700">

                        {key.replaceAll(
                          "_",
                          " "
                        )}

                      </label>

                      {isTextarea ? (

                        <textarea
                          rows={4}
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-orange-500"
                        />

                      ) : (

                        <input
                          type={
                            key.includes(
                              "price"
                            ) ||
                            key === "rating"
                              ? "number"
                              : "text"
                          }
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-orange-500"
                        />

                      )}

                    </div>

                  );

                }
              )}

            </div>

            {formError && (
              <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {formError}
              </div>
            )}

            {/* BUTTONS */}

            <div className="mt-10 flex justify-end gap-4">

              <button
                onClick={() => {

                  setShowModal(false);

                  resetForm();

                }}
                className="px-6 py-3 rounded-2xl border border-slate-300 font-semibold text-slate-700"
              >

                Cancel

              </button>

              <button
                disabled={saving}
                onClick={() => {

                  if (
                    editingPackage
                  ) {

                    updatePackage();

                  } else {

                    addPackage();

                  }

                }}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg hover:shadow-2xl transition disabled:opacity-50"
              >

                {saving
                  ? "Saving..."
                  : editingPackage
                  ? "Update Package"
                  : "Add Package"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

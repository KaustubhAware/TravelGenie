import { useEffect, useState } from "react";

import { fetchWithAuth } from "../utils/api";

import {
  FaSearch,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaClock,
  FaPlus,
} from "react-icons/fa";

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

  /* ===================================================== */
  /* FORM DATA */
  /* ===================================================== */

  const [formData, setFormData] =
    useState({

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

      short_description: "",

      full_description: "",

      included: "",

      excluded: "",

      pickup_points: "",

      itinerary: "",

      gallery: "",

      rating: "",

      featured: false,

    });

  /* ===================================================== */
  /* FETCH PACKAGES */
  /* ===================================================== */

  const fetchPackages = async () => {

    try {

      setLoading(true);

      const res =
        await fetchWithAuth(
          "/packages"
        );

      const data =
        await res.json();

      setPackages(
        data.packages || []
      );

    } catch (err) {

      console.error(err);

      alert(
        "Failed to load packages"
      );

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

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData({

      ...formData,

      [name]:

        type === "checkbox"

          ? checked

          : value,

    });

  };

  /* ===================================================== */
  /* RESET FORM */
  /* ===================================================== */

  const resetForm = () => {

    setFormData({

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

      short_description: "",

      full_description: "",

      included: "",

      excluded: "",

      pickup_points: "",

      itinerary: "",

      gallery: "",

      rating: "",

      featured: false,

    });

    setEditingPackage(null);

  };

  /* ===================================================== */
  /* ADD PACKAGE */
  /* ===================================================== */

  const addPackage = async () => {

    try {

      await fetchWithAuth(
        "/packages",
        {
          method: "POST",

          body: JSON.stringify({

            ...formData,

            included:
              formData.included
                .split(","),

            excluded:
              formData.excluded
                .split(","),

            pickup_points:
              formData.pickup_points
                .split(","),

            gallery:
              formData.gallery
                .split(","),

          }),
        }
      );

      fetchPackages();

      setShowModal(false);

      resetForm();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to add package"
      );

    }

  };

  /* ===================================================== */
  /* EDIT PACKAGE */
  /* ===================================================== */

  const editPackage = (pkg) => {

    setEditingPackage(pkg.id);

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
        pkg.short_description || "",

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
  /* UPDATE PACKAGE */
  /* ===================================================== */

  const updatePackage = async () => {

    try {

      await fetchWithAuth(

        `/packages/${editingPackage}`,

        {
          method: "PUT",

          body: JSON.stringify({

            ...formData,

            included:
              formData.included
                .split(","),

            excluded:
              formData.excluded
                .split(","),

            pickup_points:
              formData.pickup_points
                .split(","),

            gallery:
              formData.gallery
                .split(","),

          }),
        }

      );

      fetchPackages();

      setShowModal(false);

      resetForm();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to update package"
      );

    }

  };

  /* ===================================================== */
  /* DELETE */
  /* ===================================================== */

  const deletePackage = async (id) => {

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

      fetchPackages();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to delete package"
      );

    }

  };

  /* ===================================================== */
  /* FILTER */
  /* ===================================================== */

  const filteredPackages =
    packages.filter((pkg) =>

      `${pkg.title} ${pkg.location}`

        .toLowerCase()

        .includes(
          search.toLowerCase()
        )

    );

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-lg font-medium text-slate-500">
          Loading packages...
        </div>

      </div>

    );

  }

  /* ===================================================== */
  /* PAGE */
  /* ===================================================== */

  return (

    <div className="min-h-screen bg-[#F5F7FA] p-8">

      {/* HEADER */}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

        <div>

          <h1 className="text-4xl font-bold text-slate-900">
            Maharashtra Packages
          </h1>

          <p className="mt-2 text-slate-500">
            Manage trekking and adventure travel packages
          </p>

        </div>

        <div className="flex items-center gap-4">

          {/* SEARCH */}

          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-[320px] rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          {/* BUTTON */}

          <button
            onClick={() => {

              resetForm();

              setShowModal(true);

            }}
            className="flex items-center gap-3 rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
          >

            <FaPlus />

            Add Package

          </button>

        </div>

      </div>

      {/* GRID */}

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

        {filteredPackages.map((pkg) => (

          <div
            key={pkg.id}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >

            {/* IMAGE */}

            <img
              src={
                pkg.featured_image ||

                "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
              }
              alt={pkg.title}
              className="h-60 w-full object-cover"
            />

            {/* CONTENT */}

            <div className="p-6">

              <div className="mb-4 flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">

                    {pkg.title}

                  </h2>

                  <p className="mt-1 text-slate-500">

                    {pkg.location}

                  </p>

                </div>

                <div className="rounded-2xl bg-indigo-50 px-4 py-2 font-semibold text-indigo-600">

                  ₹ {pkg.price}

                </div>

              </div>

              {/* INFO */}

              <div className="mb-5 space-y-3">

                <div className="flex items-center gap-3 text-slate-700">

                  <FaMapMarkedAlt className="text-indigo-500" />

                  <span>

                    {pkg.region}

                  </span>

                </div>

                <div className="flex items-center gap-3 text-slate-700">

                  <FaClock className="text-amber-500" />

                  <span>

                    {pkg.duration}

                  </span>

                </div>

                <div className="flex items-center gap-3 text-slate-700">

                  <FaMoneyBillWave className="text-emerald-500" />

                  <span>

                    ₹ {pkg.price}

                  </span>

                </div>

              </div>

              {/* DESCRIPTION */}

              <p className="mb-5 leading-relaxed text-slate-600">

                {pkg.short_description}

              </p>

              {/* TAGS */}

              <div className="mb-6 flex flex-wrap gap-2">

                <div className="rounded-xl bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">

                  {pkg.category}

                </div>

                <div className="rounded-xl bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">

                  {pkg.difficulty}

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    editPackage(pkg)
                  }
                  className="flex-1 rounded-2xl bg-amber-500 py-3 font-semibold text-white transition hover:bg-amber-600"
                >

                  Edit

                </button>

                <button
                  onClick={() =>
                    deletePackage(
                      pkg.id
                    )
                  }
                  className="flex-1 rounded-2xl bg-rose-500 py-3 font-semibold text-white transition hover:bg-rose-600"
                >

                  Delete

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>
        {/* ===================================================== */}
{/* MODAL */}
{/* ===================================================== */}

{showModal && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl">

      {/* HEADER */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold text-slate-900">

            {editingPackage
              ? "Edit Package"
              : "Add Package"}

          </h2>

          <p className="mt-2 text-slate-500">

            Manage Maharashtra trekking and travel packages

          </p>

        </div>

        <button
          onClick={() => {

            setShowModal(false);

            resetForm();

          }}
          className="rounded-2xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"
        >

          Close

        </button>

      </div>

      {/* FORM */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* TITLE */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Package Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Rajmachi Trek"
          />

        </div>

        {/* LOCATION */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Location
          </label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Lonavala"
          />

        </div>

        {/* REGION */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Region
          </label>

          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Western Ghats"
          />

        </div>

        {/* CATEGORY */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Trekking"
          />

        </div>

        {/* PRICE */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Price
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="2999"
          />

        </div>

        {/* DURATION */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Duration
          </label>

          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="2 Days / 1 Night"
          />

        </div>

        {/* DIFFICULTY */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Difficulty
          </label>

          <input
            type="text"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Moderate"
          />

        </div>

        {/* TREK DISTANCE */}

        <div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Trek Distance
          </label>

          <input
            type="text"
            name="trek_distance"
            value={formData.trek_distance}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="12 KM"
          />

        </div>

        {/* IMAGE */}

        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Featured Image URL
          </label>

          <input
            type="text"
            name="featured_image"
            value={formData.featured_image}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://..."
          />

        </div>

        {/* SHORT DESCRIPTION */}

        <div className="md:col-span-2">

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Short Description
          </label>

          <textarea
            rows={4}
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Short adventure description..."
          />

        </div>

      </div>

      {/* BUTTONS */}

      <div className="mt-8 flex justify-end gap-4">

        <button
          onClick={() => {

            setShowModal(false);

            resetForm();

          }}
          className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
        >

          Cancel

        </button>

        <button
          onClick={() => {

            if (editingPackage) {

              updatePackage();

            } else {

              addPackage();

            }

          }}
          className="rounded-2xl bg-indigo-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700"
        >

          {editingPackage
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
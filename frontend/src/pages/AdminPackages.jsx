import { useEffect, useState } from "react";

import { fetchWithAuth } from "../utils/api";

import {
  FaBoxOpen,
  FaSearch,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaClock,
  FaTrash,
  FaEdit,
  FaPlus,
} from "react-icons/fa";

export default function AdminPackages() {

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

      destination: "",

      duration: "",

      price: "",

      description: "",

      image: "",

      services: "",

      category: "",

      difficulty: "",

      group_size: "",

      best_season: "",

      altitude: "",

      included: "",

      excluded: "",

      itinerary: "",

      hotel_details: "",

      transport_details: "",

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

      destination: "",

      duration: "",

      price: "",

      description: "",

      image: "",

      services: "",

      category: "",

      difficulty: "",

      group_size: "",

      best_season: "",

      altitude: "",

      included: "",

      excluded: "",

      itinerary: "",

      hotel_details: "",

      transport_details: "",

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

          body: JSON.stringify(
            formData
          ),
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

      destination:
        pkg.destination || "",

      duration:
        pkg.duration || "",

      price:
        pkg.price || "",

      description:
        pkg.description || "",

      image:
        pkg.image || "",

      services:
        pkg.services || "",

      category:
        pkg.category || "",

      difficulty:
        pkg.difficulty || "",

      group_size:
        pkg.group_size || "",

      best_season:
        pkg.best_season || "",

      altitude:
        pkg.altitude || "",

      included:
        pkg.included || "",

      excluded:
        pkg.excluded || "",

      itinerary:
        pkg.itinerary || "",

      hotel_details:
        pkg.hotel_details || "",

      transport_details:
        pkg.transport_details || "",

      gallery:
        pkg.gallery || "",

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

          body: JSON.stringify(
            formData
          ),
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

      `${pkg.title} ${pkg.destination}`

        .toLowerCase()

        .includes(
          search.toLowerCase()
        )

    );

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f4f7ff] to-[#eef5ff] p-8">

      {/* HEADER */}

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-900">

            Package Management

          </h1>

          <p className="text-gray-500 mt-2">

            Manage expedition and travel packages

          </p>

        </div>

        <div className="flex items-center gap-4">

          <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none w-[300px]"
            />

          </div>

          <button
            onClick={() => {

              resetForm();

              setShowModal(true);

            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg"
          >

            <FaPlus />

            Add Package

          </button>

        </div>

      </div>

      {/* GRID */}

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredPackages.map((pkg) => (

          <div
            key={pkg.id}
            className="bg-white rounded-[30px] overflow-hidden shadow-lg border border-gray-100"
          >

            <img
              src={
                pkg.image ||

                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
              }
              alt={pkg.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-6">

              <div className="flex justify-between items-start gap-4 mb-4">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">

                    {pkg.title}

                  </h2>

                  <p className="text-gray-500 mt-1">

                    {pkg.destination}

                  </p>

                </div>

                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-semibold">

                  ₹ {pkg.price}

                </div>

              </div>

              <div className="space-y-3 mb-5">

                <div className="flex items-center gap-3 text-gray-700">

                  <FaMapMarkedAlt className="text-blue-500" />

                  <span>

                    {pkg.destination}

                  </span>

                </div>

                <div className="flex items-center gap-3 text-gray-700">

                  <FaClock className="text-yellow-500" />

                  <span>

                    {pkg.duration}

                  </span>

                </div>

                <div className="flex items-center gap-3 text-gray-700">

                  <FaMoneyBillWave className="text-green-500" />

                  <span>

                    ₹ {pkg.price}

                  </span>

                </div>

              </div>

              <p className="text-gray-600 leading-relaxed mb-5">

                {pkg.description}

              </p>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    editPackage(pkg)
                  }
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 rounded-2xl"
                >

                  Edit

                </button>

                <button
                  onClick={() =>
                    deletePackage(
                      pkg.id
                    )
                  }
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white py-3 rounded-2xl"
                >

                  Delete

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}

     {showModal && (

  <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-6">

    <div className="bg-white w-full max-w-6xl rounded-[32px] shadow-2xl max-h-[92vh] overflow-hidden flex flex-col">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex justify-between items-center p-8 border-b border-slate-200 bg-white sticky top-0 z-10">

        <div>

          <h2 className="text-3xl font-black text-slate-900">

            {editingPackage

              ? "Edit Expedition Package"

              : "Create New Expedition Package"}

          </h2>

          <p className="text-slate-500 mt-2">

            Manage premium trekking and adventure experiences

          </p>

        </div>

        <button
          onClick={() => {

            setShowModal(false);

            resetForm();

          }}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold transition"
        >

          Close

        </button>

      </div>

      {/* ===================================================== */}
      {/* SCROLLABLE BODY */}
      {/* ===================================================== */}

      <div className="overflow-y-auto px-8 py-8 space-y-8">

        {/* ===================================================== */}
        {/* BASIC DETAILS */}
        {/* ===================================================== */}

        <div>

          <h3 className="text-2xl font-bold text-slate-900 mb-6">

            Basic Information

          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">

                Package Title

              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Kedarkantha Winter Trek"
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">

                Destination

              </label>

              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Uttarakhand"
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">

                Duration

              </label>

              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="6 Days / 5 Nights"
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">

                Price

              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="12999"
                className="w-full border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-500"
              />

            </div>

          </div>

        </div>

        {/* ===================================================== */}
        {/* TREK DETAILS */}
        {/* ===================================================== */}

        <div>

          <h3 className="text-2xl font-bold text-slate-900 mb-6">

            Trek Details

          </h3>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">

                Services

              </label>

              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                placeholder="Meals, Camping, Guide"
                className="w-full border border-slate-200 rounded-2xl px-5 py-4"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">

                Category

              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Winter Trek"
                className="w-full border border-slate-200 rounded-2xl px-5 py-4"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">

                Difficulty

              </label>

              <input
                type="text"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                placeholder="Easy to Moderate"
                className="w-full border border-slate-200 rounded-2xl px-5 py-4"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">

                Group Size

              </label>

              <input
                type="text"
                name="group_size"
                value={formData.group_size}
                onChange={handleChange}
                placeholder="15 People"
                className="w-full border border-slate-200 rounded-2xl px-5 py-4"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">

                Best Season

              </label>

              <input
                type="text"
                name="best_season"
                value={formData.best_season}
                onChange={handleChange}
                placeholder="December to February"
                className="w-full border border-slate-200 rounded-2xl px-5 py-4"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">

                Altitude

              </label>

              <input
                type="text"
                name="altitude"
                value={formData.altitude}
                onChange={handleChange}
                placeholder="12,500 ft"
                className="w-full border border-slate-200 rounded-2xl px-5 py-4"
              />

            </div>

          </div>

        </div>

        {/* ===================================================== */}
        {/* IMAGE */}
        {/* ===================================================== */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Cover Image URL

          </label>

          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-slate-200 rounded-2xl px-5 py-4"
          />

        </div>

        {/* ===================================================== */}
        {/* DESCRIPTION */}
        {/* ===================================================== */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Description

          </label>

          <textarea
            rows="5"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the trekking experience..."
            className="w-full border border-slate-200 rounded-2xl px-5 py-4"
          />

        </div>

        {/* ===================================================== */}
        {/* INCLUDED / EXCLUDED */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Included

            </label>

            <textarea
              rows="6"
              name="included"
              value={formData.included}
              onChange={handleChange}
              placeholder="Meals, Stay, Guide..."
              className="w-full border border-slate-200 rounded-2xl px-5 py-4"
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Excluded

            </label>

            <textarea
              rows="6"
              name="excluded"
              value={formData.excluded}
              onChange={handleChange}
              placeholder="Insurance, Personal expenses..."
              className="w-full border border-slate-200 rounded-2xl px-5 py-4"
            />

          </div>

        </div>

        {/* ===================================================== */}
        {/* ITINERARY */}
        {/* ===================================================== */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Day-wise Itinerary

          </label>

          <textarea
            rows="8"
            name="itinerary"
            value={formData.itinerary}
            onChange={handleChange}
            placeholder="Day 1 - Arrival..."
            className="w-full border border-slate-200 rounded-2xl px-5 py-4"
          />

        </div>

        {/* ===================================================== */}
        {/* HOTEL & TRANSPORT */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Hotel Details

            </label>

            <textarea
              rows="6"
              name="hotel_details"
              value={formData.hotel_details}
              onChange={handleChange}
              placeholder="Swiss camps, hotel stay..."
              className="w-full border border-slate-200 rounded-2xl px-5 py-4"
            />

          </div>

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Transport Details

            </label>

            <textarea
              rows="6"
              name="transport_details"
              value={formData.transport_details}
              onChange={handleChange}
              placeholder="Tempo Traveller..."
              className="w-full border border-slate-200 rounded-2xl px-5 py-4"
            />

          </div>

        </div>

        {/* ===================================================== */}
        {/* GALLERY */}
        {/* ===================================================== */}

        <div>

          <label className="block text-sm font-semibold text-slate-700 mb-2">

            Gallery URLs

          </label>

          <textarea
            rows="5"
            name="gallery"
            value={formData.gallery}
            onChange={handleChange}
            placeholder="https://image1.jpg, https://image2.jpg"
            className="w-full border border-slate-200 rounded-2xl px-5 py-4"
          />

        </div>

        {/* ===================================================== */}
        {/* RATING + FEATURED */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-2 gap-6">

          <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">

              Rating

            </label>

            <input
              type="number"
              step="0.1"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="4.8"
              className="w-full border border-slate-200 rounded-2xl px-5 py-4"
            />

          </div>

          <div className="flex items-center gap-4 pt-10">

            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5"
            />

            <label className="font-semibold text-slate-700">

              Featured Package

            </label>

          </div>

        </div>

      </div>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <div className="border-t border-slate-200 p-8 flex justify-end bg-white">

        <button
          onClick={
            editingPackage
              ? updatePackage
              : addPackage
          }
          className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition"
        >

          {editingPackage

            ? "Update Package"

            : "Create Package"}

        </button>

      </div>

    </div>

  </div>

)}   </div>

  );

}
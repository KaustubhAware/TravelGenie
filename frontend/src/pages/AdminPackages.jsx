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

  const [formData, setFormData] =
    useState({
      title: "",
      destination: "",
      duration: "",
      price: "",
      description: "",
      image: "",
      services: "",
    });

  // =====================================================
  // FETCH PACKAGES
  // =====================================================

  const fetchPackages = async () => {

    try {

      setLoading(true);

      const res = await fetchWithAuth(
        "/packages"
      );

      const data = await res.json();

      setPackages(data.packages || []);

    } catch (err) {

      console.error(err);

      alert("Failed to load packages");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchPackages();

  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });

  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setFormData({
      title: "",
      destination: "",
      duration: "",
      price: "",
      description: "",
      image: "",
      services: "",
    });

    setEditingPackage(null);

  };

  // =====================================================
  // ADD PACKAGE
  // =====================================================

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

      alert("Failed to add package");

    }

  };

  // =====================================================
  // EDIT PACKAGE
  // =====================================================

  const editPackage = (pkg) => {

    setEditingPackage(pkg.id);

    setFormData({
      title: pkg.title || "",
      destination:
        pkg.destination || "",
      duration:
        pkg.duration || "",
      price: pkg.price || "",
      description:
        pkg.description || "",
      image: pkg.image || "",
      services:
        pkg.services || "",
    });

    setShowModal(true);

  };

  // =====================================================
  // UPDATE PACKAGE
  // =====================================================

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

      alert("Failed to update package");

    }

  };

  // =====================================================
  // DELETE PACKAGE
  // =====================================================

  const deletePackage = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this package?"
      );

    if (!confirmDelete) return;

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

  // =====================================================
  // FILTER PACKAGES
  // =====================================================

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

      {/* ================================================= */}
      {/* ================= HEADER ======================== */}
      {/* ================================================= */}

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-900">

            Package Management

          </h1>

          <p className="text-gray-500 mt-2">

            Manage travel packages and agency offerings

          </p>

        </div>

        <div className="flex items-center gap-4">

          {/* SEARCH */}

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
              className="pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none w-[300px] focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* ADD BUTTON */}

          <button
            onClick={() => {

              resetForm();

              setShowModal(true);

            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg hover:opacity-90 transition"
          >

            <FaPlus />

            Add Package

          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* ================= LOADING ======================= */}
      {/* ================================================= */}

      {loading ? (

        <div className="text-center py-20 text-gray-500 text-lg">

          Loading packages...

        </div>

      ) : (

        <>

          {/* ================================================= */}
          {/* ================= PACKAGE GRID ================= */}
          {/* ================================================= */}

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredPackages.map((pkg) => (

              <div
                key={pkg.id}
                className="bg-white rounded-[30px] overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition"
              >

                {/* IMAGE */}

                <img
                  src={
                    pkg.image ||
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                  }
                  alt={pkg.title}
                  className="w-full h-56 object-cover"
                />

                {/* CONTENT */}

                <div className="p-6">

                  {/* TITLE */}

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

                  {/* INFO */}

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

                  {/* DESCRIPTION */}

                  <p className="text-gray-600 leading-relaxed mb-5">

                    {pkg.description}

                  </p>

                  {/* SERVICES */}

                  <div className="mb-6">

                    <h3 className="font-semibold text-gray-900 mb-3">

                      Included Services

                    </h3>

                    <div className="flex flex-wrap gap-2">

                      {(pkg.services || "")
                        .split(",")
                        .map(
                          (
                            service,
                            index
                          ) => (

                            <span
                              key={index}
                              className="bg-[#f4f7ff] text-blue-700 px-3 py-2 rounded-xl text-sm"
                            >

                              {service.trim()}

                            </span>

                          )
                        )}

                    </div>

                  </div>

                  {/* ACTION BUTTONS */}

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        editPackage(pkg)
                      }
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition"
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
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition"
                    >

                      <FaTrash />

                      Delete

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* EMPTY STATE */}

          {filteredPackages.length === 0 && (

            <div className="text-center py-24">

              <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">

                <FaBoxOpen className="text-blue-600 text-4xl" />

              </div>

              <h2 className="text-2xl font-bold text-gray-900">

                No Packages Found

              </h2>

              <p className="text-gray-500 mt-3">

                Add travel packages to start managing tours

              </p>

            </div>

          )}

        </>

      )}

      {/* ================================================= */}
      {/* ================= MODAL ========================= */}
      {/* ================================================= */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-6">

          <div className="bg-white w-full max-w-3xl rounded-[32px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-8">

              <div>

                <h2 className="text-3xl font-bold text-gray-900">

                  {editingPackage
                    ? "Edit Package"
                    : "Add New Package"}

                </h2>

                <p className="text-gray-500 mt-2">

                  Create and manage travel offerings

                </p>

              </div>

              <button
                onClick={() => {

                  setShowModal(false);

                  resetForm();

                }}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-2xl"
              >

                Close

              </button>

            </div>

            {/* FORM */}

            <div className="grid md:grid-cols-2 gap-6">

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Package Title"
                className="border border-gray-200 rounded-2xl px-4 py-3"
              />

              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Destination"
                className="border border-gray-200 rounded-2xl px-4 py-3"
              />

              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Duration"
                className="border border-gray-200 rounded-2xl px-4 py-3"
              />

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="border border-gray-200 rounded-2xl px-4 py-3"
              />

            </div>

            <div className="mt-6">

              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3"
              />

            </div>

            <div className="mt-6">

              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                placeholder="Hotel, Flights, Breakfast"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3"
              />

            </div>

            <div className="mt-6">

              <textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Package Description"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3"
              />

            </div>

            <div className="flex justify-end mt-8">

              <button
                onClick={
                  editingPackage
                    ? updatePackage
                    : addPackage
                }
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:opacity-90 transition"
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
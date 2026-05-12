import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { auth } from "../firebase";

import {
  FaPlaneDeparture,
  FaCalendarAlt,
  FaUsers,
  FaWallet,
  FaMapMarkedAlt,
  FaArrowRight,
} from "react-icons/fa";

export default function Booking() {

  const location = useLocation();

  const navigate = useNavigate();

  const tripData = location.state || {};

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    departure: "",
    returnDate: "",
    adults: "1",
    children: "0",
    notes: "",
  });

  useEffect(() => {

    if (!tripData?.destination) {
      console.warn("Opened booking without trip data");
    }

  }, [tripData]);

  /* ================= INPUT STYLE ================= */

  const inputStyle =
    "w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white";

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {

    let newErrors = {};

    if (!form.firstName) newErrors.firstName = "Required";

    if (!form.lastName) newErrors.lastName = "Required";

    if (!form.email) {
      newErrors.email = "Required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email";
    }

    if (!form.phone) {
      newErrors.phone = "Required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Invalid phone";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    if (!validateForm()) {

      toast.error("Please fix form errors");

      return;

    }

    const user = auth.currentUser;

    if (!user) {

      toast.error("Please login first");

      navigate("/login");

      return;

    }

    setLoading(true);

    try {

      const token = await user.getIdToken();

      const res = await fetch(
        "http://127.0.0.1:8000/api/save-booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            destination: tripData.destination,
            budget: tripData.cost || tripData.budget,
            days: tripData.days,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Booking failed");
      }

      toast.success("Booking saved!");

      navigate("/payment", {
        state: {
          ...form,
          ...tripData,
          booking_id: data.booking_id,
        },
      });

    } catch (err) {

      console.error(err);

      toast.error(err.message || "Server error");

    } finally {

      setLoading(false);

    }

  };

  return (

    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-[#f5f9ff] px-4 md:px-6 pt-4 pb-10">

        {/* ================= HEADER ================= */}

        <div className="max-w-7xl mx-auto mb-8">

          <div className="flex items-center justify-between flex-wrap gap-4">

            <div>

              <h1 className="text-4xl font-bold text-gray-900">
                Complete Your Booking
              </h1>

              <p className="text-gray-500 mt-2">
                Fill traveler information and confirm your trip
              </p>

            </div>

            {/* STEP */}

            <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">

              <div className="flex items-center gap-4 text-sm font-medium">

                <span className="text-blue-600">
                  1. Booking
                </span>

                <span className="text-gray-300">→</span>

                <span className="text-gray-400">
                  2. Payment
                </span>

                <span className="text-gray-300">→</span>

                <span className="text-gray-400">
                  3. Success
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* ================================================= */}
          {/* ================= LEFT FORM ===================== */}
          {/* ================================================= */}

          <div className="bg-white border border-gray-200 rounded-[32px] shadow-sm p-8">

            <div className="mb-8">

              <h2 className="text-2xl font-bold text-gray-900">
                Traveler Information
              </h2>

              <p className="text-gray-500 mt-2">
                Enter traveler details carefully
              </p>

            </div>

            {/* FORM GRID */}

            <div className="grid md:grid-cols-2 gap-5">

              {/* FIRST NAME */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  First Name
                </label>

                <input
                  name="firstName"
                  placeholder="John"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputStyle}
                />

                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.firstName}
                  </p>
                )}

              </div>

              {/* LAST NAME */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Last Name
                </label>

                <input
                  name="lastName"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={handleChange}
                  className={inputStyle}
                />

                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.lastName}
                  </p>
                )}

              </div>

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>

                <input
                  name="email"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputStyle}
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* PHONE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Phone Number
                </label>

                <input
                  name="phone"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputStyle}
                />

                {errors.phone && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.phone}
                  </p>
                )}

              </div>

              {/* DEPARTURE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Departure Date
                </label>

                <input
                  name="departure"
                  type="date"
                  value={form.departure}
                  onChange={handleChange}
                  className={inputStyle}
                />

              </div>

              {/* RETURN */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Return Date
                </label>

                <input
                  name="returnDate"
                  type="date"
                  value={form.returnDate}
                  onChange={handleChange}
                  className={inputStyle}
                />

              </div>

              {/* ADULTS */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Adults
                </label>

                <input
                  name="adults"
                  type="number"
                  value={form.adults}
                  onChange={handleChange}
                  className={inputStyle}
                />

              </div>

              {/* CHILDREN */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Children
                </label>

                <input
                  name="children"
                  type="number"
                  value={form.children}
                  onChange={handleChange}
                  className={inputStyle}
                />

              </div>

            </div>

            {/* NOTES */}

            <div className="mt-6">

              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Additional Notes
              </label>

              <textarea
                name="notes"
                rows="5"
                placeholder="Special requests, preferences, etc."
                value={form.notes}
                onChange={handleChange}
                className={inputStyle}
              />

            </div>

            {/* BUTTON */}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center gap-3"
            >

              {loading
                ? "Processing Booking..."
                : "Continue to Payment"}

              {!loading && <FaArrowRight />}

            </button>

          </div>

          {/* ================================================= */}
          {/* ================= RIGHT SUMMARY ================= */}
          {/* ================================================= */}

          <div className="bg-white border border-gray-200 rounded-[32px] shadow-sm p-7 sticky top-24">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Trip Summary
                </h2>

                <p className="text-gray-500 mt-2">
                  Booking overview
                </p>

              </div>

              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">

                <FaMapMarkedAlt className="text-blue-600 text-2xl" />

              </div>

            </div>

            {/* DESTINATION */}

            <div className="space-y-5">

              <div className="bg-gray-50 rounded-2xl p-5">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                    <FaPlaneDeparture className="text-blue-600" />

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Destination
                    </p>

                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                      {tripData.destination || "-"}
                    </h3>

                  </div>

                </div>

              </div>

              {/* DAYS */}

              <div className="bg-gray-50 rounded-2xl p-5">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                    <FaCalendarAlt className="text-blue-600" />

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Duration
                    </p>

                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                      {tripData.days || "-"} Days
                    </h3>

                  </div>

                </div>

              </div>

              {/* TRAVELERS */}

              <div className="bg-gray-50 rounded-2xl p-5">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                    <FaUsers className="text-blue-600" />

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Travelers
                    </p>

                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                      {form.adults} Adults, {form.children} Children
                    </h3>

                  </div>

                </div>

              </div>

            </div>

            {/* PRICE */}

            <div className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-7 text-white">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-blue-100">
                    Total Cost
                  </p>

                  <h2 className="text-4xl font-bold mt-2">
                    ₹ {tripData.cost || tripData.budget || 0}
                  </h2>

                </div>

                <FaWallet className="text-4xl text-white/80" />

              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}
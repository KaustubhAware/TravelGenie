import {
  useState,
  useEffect,
  useMemo,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Toaster,
  toast,
} from "react-hot-toast";

import {
  auth,
} from "../firebase";

import {
  API_BASE,
} from "../services/httpClient";

import {
  validateBookingForm,
} from "../utils/validators";

import {
  FaPlaneDeparture,
  FaCalendarAlt,
  FaUsers,
  FaWallet,
  FaMapMarkedAlt,
  FaArrowRight,
  FaMountain,
  FaHotel,
  FaStar,
} from "react-icons/fa";

export default function Booking() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const tripData =
    location.state || {};

  const packageData =
    tripData.package || {};

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [form, setForm] =
    useState({

      firstName: "",

      lastName: "",

      email: "",

      phone: "",

      departure: "",

      returnDate: "",

      adults: "1",

      children: "0",

      notes: "",

      special_request: "",

    });

  /* ===================================================== */
  /* PACKAGE CHECK */
  /* ===================================================== */

  useEffect(() => {

    console.log(
      "BOOKING PACKAGE:",
      packageData
    );

    if (
      !packageData?.id
    ) {

      console.warn(
        "Opened booking without package data"
      );

    }

  }, [packageData]);

  /* ===================================================== */
  /* TOTAL TRAVELERS */
  /* ===================================================== */

  const totalTravelers =
    useMemo(() => {

      return (
        Number(form.adults || 0) +
        Number(form.children || 0)
      );

    }, [
      form.adults,
      form.children,
    ]);

  /* ===================================================== */
  /* TOTAL PRICE */
  /* ===================================================== */

  const totalPrice =
    useMemo(() => {

      const basePrice =
        Number(
          packageData.price || 0
        );

      return (
        basePrice *
        Math.max(
          totalTravelers,
          1
        )
      );

    }, [
      packageData.price,
      totalTravelers,
    ]);

  /* ===================================================== */
  /* INPUT STYLE */
  /* ===================================================== */

  const inputStyle =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-800 outline-none transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white";

  /* ===================================================== */
  /* HANDLE CHANGE */
  /* ===================================================== */

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

      setErrors({

        ...errors,

        [e.target.name]:
          "",

      });

    };

  /* ===================================================== */
  /* VALIDATION */
  /* ===================================================== */

  const validateForm =
    () => {

      let newErrors =
        validateBookingForm(form);

      setErrors(
        newErrors
      );

      return (
        Object.keys(
          newErrors
        ).length === 0
      );

    };

  /* ===================================================== */
  /* SUBMIT */
  /* ===================================================== */

  const handleSubmit =
    async () => {

      if (!validateForm()) {

        toast.error(
          "Please fix form errors"
        );

        return;

      }

      const user =
        auth.currentUser;

      if (!user) {

        toast.error(
          "Please login first"
        );

        navigate("/login");

        return;

      }

      setLoading(true);

      try {

        const token =
          await user.getIdToken();

        const payload = {

          ...form,

          destination:
            packageData.destination ||

            tripData.destination ||

            "Unknown",

          budget:
            totalPrice,

          days:
            parseInt(
              packageData.duration
            ) || 1,

          package_id:
            packageData.id,

          package_title:
            packageData.title,

          package_image:
            packageData.image,

          travel_date:
            form.departure,

          travelers:
            totalTravelers,

          special_request:
            form.special_request,

        };

        console.log(
          "BOOKING PAYLOAD:",
          payload
        );

        const res =
          await fetch(

            `${API_BASE}/save-booking`,

            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

              },

              body: JSON.stringify(
                payload
              ),

            }
          );

        const data =
          await res.json();

        if (
          !res.ok ||
          data.error
        ) {

          throw new Error(

            data.error ||

            data.detail ||

            "Booking failed"

          );

        }

        toast.success(
          "Booking submitted successfully"
        );

        navigate(
          "/dashboard/bookings",

          {

            state: {

              ...payload,

              booking_id:
                data.booking_id,

            },

          }
        );

      } catch (err) {

        console.error(err);

        toast.error(

          err.message ||

          "Server error"

        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <>

      <Toaster position="top-right" />

      <div className="min-h-screen bg-slate-50 px-4 md:px-6 pt-4 pb-10">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="max-w-7xl mx-auto mb-8">

          <div className="flex items-center justify-between flex-wrap gap-4">

            <div>

              <h1 className="text-4xl font-black text-slate-900">

                Complete Your Trek Booking

              </h1>

              <p className="text-slate-500 mt-3">

                Confirm traveler details and reserve your adventure package

              </p>

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">

              <div className="flex items-center gap-4 text-sm font-semibold">

                <span className="text-emerald-600">

                  1. Booking

                </span>

                <span className="text-slate-300">

                  →

                </span>

                <span className="text-slate-400">

                  2. Payment

                </span>

                <span className="text-slate-300">

                  →

                </span>

                <span className="text-slate-400">

                  3. Success

                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================== */}
        {/* MAIN GRID */}
        {/* ===================================================== */}

        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-8 items-start">

          {/* ===================================================== */}
          {/* LEFT */}
          {/* ===================================================== */}

          <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm p-8">

            <div className="mb-8">

              <h2 className="text-3xl font-black text-slate-900">

                Traveler Information

              </h2>

              <p className="text-slate-500 mt-2">

                Fill traveler details carefully before confirming booking

              </p>

            </div>

            {/* FORM */}

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">

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

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">

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

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">

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

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">

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

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">

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

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">

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

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">

                  Adults

                </label>

                <input
                  name="adults"
                  type="number"
                  min="1"
                  value={form.adults}
                  onChange={handleChange}
                  className={inputStyle}
                />

              </div>

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-3">

                  Children

                </label>

                <input
                  name="children"
                  type="number"
                  min="0"
                  value={form.children}
                  onChange={handleChange}
                  className={inputStyle}
                />

              </div>

            </div>

            {/* SPECIAL REQUEST */}

            <div className="mt-6">

              <label className="block text-sm font-semibold text-slate-700 mb-3">

                Special Requests

              </label>

              <textarea
                name="special_request"
                rows="5"
                placeholder="Meal preference, room type, pickup request, medical notes, etc."
                value={form.special_request}
                onChange={handleChange}
                className={inputStyle}
              />

            </div>

            {/* NOTES */}

            <div className="mt-6">

              <label className="block text-sm font-semibold text-slate-700 mb-3">

                Additional Notes

              </label>

              <textarea
                name="notes"
                rows="5"
                placeholder="Additional travel preferences..."
                value={form.notes}
                onChange={handleChange}
                className={inputStyle}
              />

            </div>

            {/* BUTTON */}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition duration-300 flex items-center justify-center gap-3"
            >

              {loading
                ? "Processing Booking..."
                : "Confirm Trek Booking"}

              {!loading && (
                <FaArrowRight />
              )}

            </button>

          </div>

          {/* ===================================================== */}
          {/* RIGHT SIDEBAR */}
          {/* ===================================================== */}

          <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden sticky top-24">

            {/* IMAGE */}

            <div className="relative h-[240px]">

              <img
                src={
                  packageData.image ||

                  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
                }
                alt={
                  packageData.title
                }
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-5 left-5">

                <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">

                  {packageData.category ||

                    "Adventure"}

                </span>

              </div>

            </div>

            {/* CONTENT */}

            <div className="p-7">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-2xl font-black text-slate-900 leading-tight">

                    {packageData.title ||

                      "Travel Package"}

                  </h2>

                  <p className="text-slate-500 mt-2">

                    {packageData.destination ||

                      "-"}

                  </p>

                </div>

                <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-2 rounded-xl">

                  <FaStar />

                  <span className="font-bold">

                    {packageData.rating ||

                      4.8}

                  </span>

                </div>

              </div>

              {/* DETAILS */}

              <div className="space-y-4 mt-8">

                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">

                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                    <FaCalendarAlt className="text-emerald-600" />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">

                      Duration

                    </p>

                    <h3 className="font-bold text-slate-900">

                      {packageData.duration ||

                        "-"}

                    </h3>

                  </div>

                </div>

                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">

                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                    <FaUsers className="text-emerald-600" />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">

                      Travelers

                    </p>

                    <h3 className="font-bold text-slate-900">

                      {totalTravelers}

                    </h3>

                  </div>

                </div>

                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">

                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                    <FaMountain className="text-emerald-600" />

                  </div>

                  <div>

                    <p className="text-sm text-slate-500">

                      Difficulty

                    </p>

                    <h3 className="font-bold text-slate-900">

                      {packageData.difficulty ||

                        "Moderate"}

                    </h3>

                  </div>

                </div>

                {packageData.hotel_details && (

                  <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">

                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">

                      <FaHotel className="text-emerald-600" />

                    </div>

                    <div>

                      <p className="text-sm text-slate-500">

                        Stay

                      </p>

                      <h3 className="font-bold text-slate-900">

                        Included

                      </h3>

                    </div>

                  </div>

                )}

              </div>

              {/* PRICE */}

              <div className="mt-8 bg-slate-900 rounded-3xl p-7 text-white">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-white/70">

                      Total Cost

                    </p>

                    <h2 className="text-4xl font-black mt-2">

                      ₹ {totalPrice.toLocaleString()}

                    </h2>

                  </div>

                  <FaWallet className="text-4xl text-white/80" />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>

  );

}
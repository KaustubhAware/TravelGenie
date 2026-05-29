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
  API_BASE,
  apiRequest,
} from "../../services/httpClient";
import { hasAuthToken } from "../../utils/authToken";
import { resolveImageUrl } from "../../utils/imageUrl";

import {
  validateBookingForm,
} from "../../utils/validators";

import {
  FaCalendarAlt,
  FaUsers,
  FaWallet,
  FaArrowRight,
  FaMountain,
  FaHotel,
  FaStar,
  FaCheckCircle,
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

  const selectedBatch =
    tripData.selected_batch || null;

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

    if (!packageData?.id) {

      console.warn(
        "Booking opened without package"
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
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-800 outline-none transition-all duration-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white";

  /* ===================================================== */
  /* CHANGE */
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

      const newErrors =
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
        hasAuthToken();

      if (!user) {

        toast.error(
          "Please login first"
        );

        navigate("/login");

        return;

      }

      setLoading(true);

      try {

        const payload = {

          ...form,

          destination:
            packageData.location ||

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

          trip_batch_id:
            selectedBatch?.id,

          package_title:
            packageData.title,

          package_image:
            packageData.featured_image ||
            packageData.image,

          travel_date:
            form.departure,

          travelers:
            totalTravelers,

          special_request:
            form.special_request,

        };

        const data = await apiRequest("/save-booking", {
          method: "POST",
          body: JSON.stringify(payload),
        });

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

      <div className="min-h-screen bg-slate-50 px-4 md:px-6 py-8">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="max-w-[1600px] mx-auto mb-6">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

            <div>

              <h1 className="text-3xl font-black text-slate-900">

                Complete Your Trek Booking

              </h1>

              <p className="text-slate-500 mt-2">

                Confirm traveler details and reserve your adventure package.

              </p>

            </div>

            {/* STEPS */}

            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">

              <div className="flex items-center gap-4">

                <StepItem
                  active
                  label="Booking"
                />

                <Line />

                <StepItem
                  label="Payment"
                />

                <Line />

                <StepItem
                  label="Success"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================== */}
        {/* MAIN GRID */}
        {/* ===================================================== */}

        <div className="max-w-[1600px] mx-auto grid xl:grid-cols-[1fr_390px] gap-7 items-start">

          {/* ===================================================== */}
          {/* LEFT */}
          {/* ===================================================== */}

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

            <div className="mb-8">

              <h2 className="text-2xl font-black text-slate-900">

                Traveler Information

              </h2>

              <p className="text-slate-500 mt-2">

                Fill traveler details carefully before confirming your booking.

              </p>

            </div>

            {/* FORM */}

            <div className="grid md:grid-cols-2 gap-5">

              <InputField
                label="First Name"
                name="firstName"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
                error={errors.firstName}
                inputStyle={inputStyle}
              />

              <InputField
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                error={errors.lastName}
                inputStyle={inputStyle}
              />

              <InputField
                label="Email Address"
                name="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                inputStyle={inputStyle}
              />

              <InputField
                label="Phone Number"
                name="phone"
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                inputStyle={inputStyle}
              />

              <InputField
                label="Departure Date"
                type="date"
                name="departure"
                value={form.departure}
                onChange={handleChange}
                inputStyle={inputStyle}
              />

              <InputField
                label="Return Date"
                type="date"
                name="returnDate"
                value={form.returnDate}
                onChange={handleChange}
                inputStyle={inputStyle}
              />

              <InputField
                label="Adults"
                type="number"
                min="1"
                name="adults"
                value={form.adults}
                onChange={handleChange}
                inputStyle={inputStyle}
              />

              <InputField
                label="Children"
                type="number"
                min="0"
                name="children"
                value={form.children}
                onChange={handleChange}
                inputStyle={inputStyle}
              />

            </div>

            {/* SPECIAL REQUEST */}

            <div className="mt-6">

              <label className="block text-sm font-semibold text-slate-700 mb-3">

                Special Requests

              </label>

              <textarea
                name="special_request"
                rows="4"
                placeholder="Meal preference, pickup request, medical notes..."
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
                rows="4"
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
              className="w-full mt-8 bg-orange-500 hover:bg-orange-600 transition text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
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

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden sticky top-24 shadow-sm">

            {/* IMAGE */}

            <div className="relative h-[200px]">

              <img
                src={resolveImageUrl(
                  packageData.featured_image ||

                  packageData.image,
                  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
                )}
                alt={
                  packageData.title
                }
                className="w-full h-full object-cover"
              />

            </div>

            {/* CONTENT */}

            <div className="p-7">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <h2 className="text-2xl font-black text-slate-900">

                    {packageData.title ||

                      "Travel Package"}

                  </h2>

                  <p className="text-slate-500 mt-2">

                    {packageData.location ||

                      packageData.destination ||

                      "-"}

                  </p>

                </div>

                <div className="flex items-center gap-2 bg-orange-50 text-orange-500 px-3 py-2 rounded-xl">

                  <FaStar />

                  <span className="font-bold">

                    {packageData.rating ||

                      4.8}

                  </span>

                </div>

              </div>

              {/* DETAILS */}

              <div className="space-y-4 mt-7">

                <SidebarInfo
                  icon={<FaCalendarAlt />}
                  title="Duration"
                  value={
                    packageData.duration ||
                    "-"
                  }
                />

                {selectedBatch && (
                  <SidebarInfo
                    icon={<FaCalendarAlt />}
                    title="Selected Batch"
                    value={`${selectedBatch.start_date} to ${selectedBatch.end_date}`}
                  />
                )}

                <SidebarInfo
                  icon={<FaUsers />}
                  title="Travelers"
                  value={totalTravelers}
                />

                <SidebarInfo
                  icon={<FaMountain />}
                  title="Difficulty"
                  value={
                    packageData.difficulty ||
                    "Moderate"
                  }
                />

                {packageData.hotel_details && (

                  <SidebarInfo
                    icon={<FaHotel />}
                    title="Stay"
                    value="Included"
                  />

                )}

              </div>

              {/* PRICE */}

              <div className="mt-7 bg-orange-50 border border-orange-100 rounded-2xl p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">

                      Total Cost

                    </p>

                    <h2 className="text-4xl font-black text-slate-900 mt-2">

                      ₹ {totalPrice.toLocaleString()}

                    </h2>

                  </div>

                  <FaWallet className="text-4xl text-orange-500" />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>

  );

}

/* ===================================================== */
/* COMPONENTS */
/* ===================================================== */

function StepItem({
  active,
  label,
}) {

  return (

    <div className="flex items-center gap-2">

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
          active
            ? "bg-orange-500 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >

        {active
          ? <FaCheckCircle />
          : "•"}

      </div>

      <span
        className={`text-sm font-semibold ${
          active
            ? "text-orange-500"
            : "text-slate-400"
        }`}
      >

        {label}

      </span>

    </div>

  );

}

function Line() {

  return (
    <div className="w-10 h-[2px] bg-slate-200" />
  );

}

function SidebarInfo({
  icon,
  title,
  value,
}) {

  return (

    <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4">

      <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-orange-500">

        {icon}

      </div>

      <div>

        <p className="text-sm text-slate-500">

          {title}

        </p>

        <h3 className="font-bold text-slate-900">

          {value}

        </h3>

      </div>

    </div>

  );

}

function InputField({
  label,
  error,
  inputStyle,
  ...props
}) {

  return (

    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-3">

        {label}

      </label>

      <input
        {...props}
        className={inputStyle}
      />

      {error && (

        <p className="text-red-500 text-sm mt-2">

          {error}

        </p>

      )}

    </div>

  );

}

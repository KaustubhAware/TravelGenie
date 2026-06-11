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

import { apiRequest } from "../../services/httpClient";
import { packageService } from "../../services/packageService";
import { getUserToken } from "../../utils/authToken";
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

const toInputDate = (value) => {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 10);
};

const formatBatchDate = (value) => {
  const normalized = toInputDate(value);
  if (!normalized) {
    return "-";
  }

  const date = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function Booking() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const tripData =
    location.state || {};

  const packageData =
    tripData.package || {};

  const [batches, setBatches] =
    useState([]);

  const [selectedBatch, setSelectedBatch] =
    useState(tripData.selected_batch || null);

  const [loading, setLoading] =
    useState(false);

  const [batchesLoading, setBatchesLoading] =
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

  useEffect(() => {
    const slug = packageData.slug;

    if (!slug) {
      setBatches([]);
      return undefined;
    }

    let cancelled = false;

    const loadBatches = async () => {
      try {
        setBatchesLoading(true);
        const batchData = await packageService.getBatches(slug);
        const upcoming = batchData.batches || [];

        if (cancelled) {
          return;
        }

        setBatches(upcoming);

        setSelectedBatch((current) => {
          if (!current) {
            return upcoming[0] || null;
          }

          return (
            upcoming.find((batch) => batch.id === current.id) ||
            current
          );
        });
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setBatches([]);
        }
      } finally {
        if (!cancelled) {
          setBatchesLoading(false);
        }
      }
    };

    loadBatches();

    return () => {
      cancelled = true;
    };
  }, [packageData.slug]);

  useEffect(() => {
    if (selectedBatch?.start_date && selectedBatch?.end_date) {
      setForm((current) => ({
        ...current,
        departure: toInputDate(selectedBatch.start_date),
        returnDate: toInputDate(selectedBatch.end_date),
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      departure: "",
      returnDate: "",
    }));
  }, [
    selectedBatch?.id,
    selectedBatch?.start_date,
    selectedBatch?.end_date,
  ]);

  const datesLocked = Boolean(selectedBatch);

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
      if (
        datesLocked &&
        (e.target.name === "departure" ||
          e.target.name === "returnDate")
      ) {
        return;
      }

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

      setErrors({

        ...errors,

        [e.target.name]:
          "",

        batch: "",

      });

    };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setErrors((current) => ({
      ...current,
      batch: "",
      departure: "",
      returnDate: "",
    }));
  };

  const handleClearBatch = () => {
    setSelectedBatch(null);
    setErrors((current) => ({
      ...current,
      batch: "",
      departure: "",
      returnDate: "",
    }));
  };

  /* ===================================================== */
  /* VALIDATION */
  /* ===================================================== */

  const validateForm =
    () => {

      const newErrors =
        validateBookingForm(form, {
          selectedBatch,
          batchesAvailable: batches.length > 0,
        });

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
        if (batches.length > 0 && !selectedBatch) {
          toast.error("Please select a departure batch");
        } else {
          toast.error("Please fix form errors");
        }

        return;

      }

      const user =
        getUserToken();

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
            selectedBatch?.id || null,

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

            </div>

            {/* FORM */}

            {batches.length > 0 && (
              <div className="mb-8">
                <div className="mb-4">
                  <h3 className="text-xl font-black text-slate-900">
                    Select Departure Batch
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Travel dates are set automatically from your batch.
                  </p>
                </div>

                {batchesLoading ? (
                  <p className="text-sm text-slate-500">
                    Loading available batches...
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {batches.map((batch) => (
                      <button
                        key={batch.id}
                        type="button"
                        onClick={() => handleBatchSelect(batch)}
                        className={`text-left rounded-2xl border p-5 transition ${
                          selectedBatch?.id === batch.id
                            ? "border-orange-400 bg-orange-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="font-black text-slate-900">
                            {formatBatchDate(batch.start_date)}
                            {" "}
                            -
                            {" "}
                            {formatBatchDate(batch.end_date)}
                          </p>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            {batch.seats_left ?? 0} seats left
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600">
                          Pickup:
                          {" "}
                          {batch.pickup_location || "Pune"}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {errors.batch && (
                  <p className="text-red-500 text-sm mt-3">
                    {errors.batch}
                  </p>
                )}

                {selectedBatch && (
                  <button
                    type="button"
                    onClick={handleClearBatch}
                    className="mt-4 text-sm font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Clear batch selection
                  </button>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">

              <InputField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                error={errors.firstName}
                inputStyle={inputStyle}
              />

              <InputField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                error={errors.lastName}
                inputStyle={inputStyle}
              />

              <InputField
                label="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                inputStyle={inputStyle}
              />

              <InputField
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                inputStyle={inputStyle}
              />

              <InputField
                label="Travel Start Date"
                type="date"
                name="departure"
                value={form.departure}
                onChange={handleChange}
                inputStyle={`${inputStyle} ${
                  datesLocked ? "cursor-not-allowed bg-slate-100 text-slate-600" : ""
                }`}
                readOnly={datesLocked}
                min={datesLocked ? toInputDate(selectedBatch?.start_date) : undefined}
                max={datesLocked ? toInputDate(selectedBatch?.start_date) : undefined}
                helperText={
                  datesLocked
                    ? "Locked to selected batch start date"
                    : ""
                }
                error={errors.departure}
              />

              <InputField
                label="Travel End Date"
                type="date"
                name="returnDate"
                value={form.returnDate}
                onChange={handleChange}
                inputStyle={`${inputStyle} ${
                  datesLocked ? "cursor-not-allowed bg-slate-100 text-slate-600" : ""
                }`}
                readOnly={datesLocked}
                min={datesLocked ? toInputDate(selectedBatch?.end_date) : undefined}
                max={datesLocked ? toInputDate(selectedBatch?.end_date) : undefined}
                helperText={
                  datesLocked
                    ? "Locked to selected batch end date"
                    : ""
                }
                error={errors.returnDate}
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

                {selectedBatch ? (
                  <BatchSummaryCard batch={selectedBatch} />
                ) : batches.length > 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                    Select a batch to lock your travel dates.
                  </div>
                ) : null}

                <SidebarInfo
                  icon={<FaCalendarAlt />}
                  title="Duration"
                  value={
                    packageData.duration ||
                    "-"
                  }
                />

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

function BatchSummaryCard({ batch }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-500">
        Selected Batch
      </p>
      <h3 className="mt-2 text-lg font-black text-slate-900">
        {formatBatchDate(batch.start_date)}
        {" "}
        -
        {" "}
        {formatBatchDate(batch.end_date)}
      </h3>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">Batch dates:</span>
          {" "}
          {formatBatchDate(batch.start_date)}
          {" "}
          to
          {" "}
          {formatBatchDate(batch.end_date)}
        </p>
        <p>
          <span className="font-semibold text-slate-800">Seats available:</span>
          {" "}
          {batch.seats_left ?? 0}
        </p>
        {batch.pickup_location && (
          <p>
            <span className="font-semibold text-slate-800">Pickup:</span>
            {" "}
            {batch.pickup_location}
          </p>
        )}
      </div>
    </div>
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
  helperText,
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

      {helperText && (
        <p className="text-slate-500 text-xs mt-2">
          {helperText}
        </p>
      )}

      {error && (

        <p className="text-red-500 text-sm mt-2">

          {error}

        </p>

      )}

    </div>

  );

}

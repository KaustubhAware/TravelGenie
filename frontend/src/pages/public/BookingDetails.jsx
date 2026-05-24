import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import { exportInvoicePDF } from "../../utils/exportPDF";

import { API_BASE } from "../../services/httpClient";

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaFileInvoice,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaUserTie,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";

/* ===================================================== */
/* TIMELINE */
/* ===================================================== */

const timeline = [

  [
    "pending",
    "Booking submitted",
  ],

  [
    "under_review",
    "Agency review",
  ],

  [
    "approved",
    "Booking approved",
  ],

  [
    "payment_pending",
    "Payment requested",
  ],

  [
    "paid",
    "Payment completed",
  ],

  [
    "completed",
    "Trip completed",
  ],

];

/* ===================================================== */
/* PAGE */
/* ===================================================== */

export default function BookingDetails() {

  const { bookingId } =
    useParams();

  const navigate =
    useNavigate();

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* ===================================================== */
  /* LOAD */
  /* ===================================================== */

  const { user, authReady } = useFirebaseAuth();

  useEffect(() => {

    let mounted = true;

    const loadBooking =
      async (firebaseUser) => {

      try {

        if (!firebaseUser) {
          if (mounted) setLoading(false);
          return;
        }

        const token =
          await firebaseUser.getIdToken();

        const res =
          await fetch(

            `${API_BASE}/bookings/${bookingId}`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        const data =
          await res.json();

        if (!res.ok) {

          throw new Error(

            data.detail ||

            "Booking not found"

          );

        }

        if (mounted) {

          setBooking(
            data.booking
          );

        }

      } catch (err) {

        console.error(err);

      } finally {

        if (mounted) {

          setLoading(false);

        }

      }

    };

    if (!authReady) return;

    if (!user) {
      navigate("/login");
      return;
    }

    loadBooking(user);

    return () => {
      mounted = false;
    };

  }, [bookingId, navigate, authReady, user]);

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-slate-500">

            Loading booking details...

          </p>

        </div>

      </div>

    );

  }

  /* ===================================================== */
  /* NOT FOUND */
  /* ===================================================== */

  if (!booking) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">

        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-lg w-full">

          <h1 className="text-3xl font-black text-slate-900">

            Booking not found

          </h1>

          <p className="text-slate-500 mt-3">

            The requested booking does not exist.

          </p>

          <button
            onClick={() =>

              navigate(
                "/dashboard/bookings"
              )

            }
            className="mt-7 bg-orange-500 hover:bg-orange-600 transition text-white px-6 py-3 rounded-xl font-semibold"
          >

            Back to bookings

          </button>

        </div>

      </div>

    );

  }

  /* ===================================================== */
  /* STATUS */
  /* ===================================================== */

  const activeIndex =
    timeline.findIndex(

      ([status]) =>

        status ===
        booking.status

    );

  const canInvoice =

    booking.status === "paid" ||

    booking.status === "completed";

  const canPay =

    booking.status === "approved" ||

    booking.status === "payment_pending";

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <div className="min-h-screen bg-slate-50 pb-14">

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8 pt-8">

        {/* BREADCRUMB */}

        <div className="flex items-center gap-2 text-sm text-slate-400 mb-5">

          <span>

            Dashboard

          </span>

          <span>

            &gt;

          </span>

          <span>

            Bookings

          </span>

          <span>

            &gt;

          </span>

          <span className="text-slate-700 font-semibold">

            {booking.booking_id}

          </span>

        </div>

        {/* HERO CARD */}

        <div className="relative h-[340px] rounded-3xl overflow-hidden border border-slate-200">

          <img
            src={
              booking.package_image ||

              "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80"
            }
            alt={
              booking.package_title
            }
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8">

            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">

              {/* LEFT */}

              <div>

                <p className="uppercase tracking-[0.25em] text-white/70 text-sm font-semibold">

                  TravelGenie Booking

                </p>

                <h1 className="text-4xl font-black text-white mt-3">

                  {booking.package_title ||

                    booking.destination}

                </h1>

                {/* INFO */}

                <div className="flex flex-wrap gap-5 mt-5 text-white/85">

                  <div className="flex items-center gap-2">

                    <FaMapMarkedAlt />

                    <span>

                      {booking.package_location ||

                        booking.destination}

                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <FaCalendarAlt />

                    <span>

                      {booking.package_duration ||

                        `${booking.days} Days`}

                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <FaUsers />

                    <span>

                      {booking.travelers || 1}
                      {" "}
                      Travelers

                    </span>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}

              <div className="flex flex-wrap gap-3">

                {canPay && (

                  <button
                    onClick={() =>

                      navigate(
                        "/dashboard/payments",
                        {
                          state: {
                            ...booking,
                            cost:
                              booking.total_cost,
                          },
                        }
                      )

                    }
                    className="bg-orange-500 hover:bg-orange-600 transition text-white px-6 py-3 rounded-xl font-semibold"
                  >

                    Pay Now

                  </button>

                )}

                {canInvoice && (

                  <button
                    onClick={() =>

                      exportInvoicePDF(
                        booking
                      )

                    }
                    className="bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold flex items-center gap-3 shadow-sm"
                  >

                    <FaFileInvoice />

                    Download Invoice

                  </button>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8 mt-7">

        <div className="grid xl:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ===================================================== */}
          {/* LEFT */}
          {/* ===================================================== */}

          <div className="space-y-6">

            {/* SUMMARY */}

            <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">

              <h2 className="text-2xl font-black text-slate-900 mb-7">

                Trip Summary

              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                <InfoCard
                  icon={<FaMapMarkedAlt />}
                  label="Destination"
                  value={
                    booking.package_location ||

                    booking.destination
                  }
                />

                <InfoCard
                  icon={<FaCalendarAlt />}
                  label="Travel Date"
                  value={
                    booking.travel_date ||

                    "Not selected"
                  }
                />

                <InfoCard
                  icon={<FaMoneyBillWave />}
                  label="Total Cost"
                  value={`₹ ${
                    booking.total_cost ||

                    booking.budget
                  }`}
                />

                <InfoCard
                  icon={<FaUsers />}
                  label="Travelers"
                  value={`${
                    booking.travelers || 1
                  } People`}
                />

              </div>

            </div>

            {/* CUSTOMER */}

            <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">

              <h2 className="text-2xl font-black text-slate-900 mb-7">

                Traveler Information

              </h2>

              <div className="grid md:grid-cols-3 gap-5">

                <Detail
                  label="Name"
                  value={booking.name}
                />

                <Detail
                  label="Email"
                  value={booking.email}
                />

                <Detail
                  label="Phone"
                  value={booking.phone}
                />

              </div>

            </div>

            {/* SPECIAL REQUEST */}

            <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">

                  <FaClipboardList />

                </div>

                <div>

                  <h2 className="text-2xl font-black text-slate-900">

                    Special Request

                  </h2>

                  <p className="text-slate-500 text-sm mt-1">

                    Customer notes & preferences

                  </p>

                </div>

              </div>

              <p className="text-slate-700 leading-relaxed">

                {booking.special_request ||

                  "No special request added."}

              </p>

            </div>

            {/* NOTES */}

            <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200">

              <div className="flex items-center gap-3 mb-5">

                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">

                  <FaUserTie />

                </div>

                <div>

                  <h2 className="text-2xl font-black text-slate-900">

                    Agency Notes

                  </h2>

                  <p className="text-slate-500 text-sm mt-1">

                    Travel operator updates

                  </p>

                </div>

              </div>

              <p className="text-slate-700 leading-relaxed">

                {booking.internal_notes ||

                  "Agency team has not added any notes yet."}

              </p>

            </div>

          </div>

          {/* ===================================================== */}
          {/* RIGHT */}
          {/* ===================================================== */}

          <div className="space-y-6">

            {/* TIMELINE */}

            <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200 sticky top-24">

              <h2 className="text-2xl font-black text-slate-900 mb-7">

                Booking Timeline

              </h2>

              <div className="space-y-6">

                {timeline.map(

                  ([status, label], index) => {

                    const done =

                      activeIndex === -1

                        ? status === booking.status

                        : index <= activeIndex;

                    return (

                      <div
                        key={status}
                        className="flex gap-4"
                      >

                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                            done
                              ? "bg-orange-500 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >

                          {done

                            ? <FaCheckCircle />

                            : <FaClock />}

                        </div>

                        <div>

                          <h3 className="font-semibold text-slate-900">

                            {label}

                          </h3>

                          <p className="text-sm text-slate-500 mt-1">

                            {done
                              ? "Completed"
                              : "Awaiting update"}

                          </p>

                        </div>

                      </div>

                    );

                  }

                )}

              </div>

              {/* STATUS */}

              <div className="mt-8 bg-orange-50 rounded-2xl p-6 border border-orange-100">

                <p className="text-sm text-slate-500">

                  Current Status

                </p>

                <h3 className="text-2xl font-black text-orange-600 mt-2 capitalize">

                  {booking.status?.replace(
                    "_",
                    " "
                  )}

                </h3>

                <p className="text-sm text-slate-600 mt-3">

                  Payment Status:
                  {" "}

                  <span className="font-semibold capitalize">

                    {booking.payment_status ||

                      "unpaid"}

                  </span>

                </p>

              </div>

              {/* BOOKING ID */}

              <div className="mt-5 border border-slate-200 rounded-2xl p-5">

                <p className="text-sm text-slate-500">

                  Booking ID

                </p>

                <h3 className="font-semibold text-slate-900 mt-2">

                  {booking.booking_id}

                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

/* ===================================================== */
/* INFO CARD */
/* ===================================================== */

function InfoCard({
  icon,
  label,
  value,
}) {

  return (

    <div className="bg-slate-50 rounded-2xl p-5">

      <div className="flex items-center gap-4">

        <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">

          {icon}

        </div>

        <div>

          <p className="text-sm text-slate-500">

            {label}

          </p>

          <h3 className="font-semibold text-slate-900 mt-1">

            {value || "-"}

          </h3>

        </div>

      </div>

    </div>

  );

}

/* ===================================================== */
/* DETAIL */
/* ===================================================== */

function Detail({
  label,
  value,
}) {

  return (

    <div className="bg-slate-50 rounded-2xl p-5">

      <p className="text-sm text-slate-500">

        {label}

      </p>

      <h3 className="font-semibold text-slate-900 mt-2 break-words">

        {value || "-"}

      </h3>

    </div>

  );

}
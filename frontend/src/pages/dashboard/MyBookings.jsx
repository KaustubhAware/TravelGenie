import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { exportInvoicePDF } from "../../utils/exportPDF";

import { bookingService } from "../../services/bookingService";

import { hasAuthToken } from "../../utils/authToken";
import { resolveDestinationImage } from "../../utils/imageUrl";

import { DASHBOARD_ROUTES } from "../../constants/routesPath";

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaFileInvoice,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";

/* ===================================================== */
/* STATUS CONFIG */
/* ===================================================== */

const statusConfig = {

  pending: {
    label: "Requested",
    className:
      "bg-yellow-100 text-yellow-700",
    icon: FaClock,
  },

  under_review: {
    label: "Under Review",
    className:
      "bg-orange-100 text-orange-700",
    icon: FaClock,
  },

  payment_pending: {
    label: "Payment Pending",
    className:
      "bg-orange-100 text-orange-700",
    icon: FaMoneyBillWave,
  },

  approved: {
    label: "Approved",
    className:
      "bg-orange-100 text-orange-700",
    icon: FaCheckCircle,
  },

  paid: {
    label: "Paid",
    className:
      "bg-emerald-100 text-emerald-700",
    icon: FaCheckCircle,
  },

  completed: {
    label: "Completed",
    className:
      "bg-green-100 text-green-700",
    icon: FaCheckCircle,
  },

  rejected: {
    label: "Rejected",
    className:
      "bg-red-100 text-red-700",
    icon: FaTimesCircle,
  },

  cancelled: {
    label: "Cancelled",
    className:
      "bg-gray-100 text-gray-700",
    icon: FaTimesCircle,
  },

};

/* ===================================================== */
/* PAGE */
/* ===================================================== */

export default function MyBookings() {

  const navigate =
    useNavigate();

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  /* ===================================================== */
  /* LOAD BOOKINGS */
  /* ===================================================== */

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      if (!hasAuthToken()) {
        setBookings([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await bookingService.getMyBookings();

        if (isMounted) {
          setBookings(data.bookings || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ===================================================== */
  /* STATS */
  /* ===================================================== */

  const stats = useMemo(
    () => ({

      requested:
        bookings.filter((b) =>
          [
            "pending",
            "under_review",
          ].includes(b.status)
        ).length,

      approved:
        bookings.filter((b) =>
          [
            "approved",
            "payment_pending",
          ].includes(b.status)
        ).length,

      completed:
        bookings.filter((b) =>
          [
            "paid",
            "completed",
          ].includes(b.status)
        ).length,

      cancelled:
        bookings.filter((b) =>
          [
            "cancelled",
            "rejected",
          ].includes(b.status)
        ).length,

    }),
    [bookings]
  );

  /* ===================================================== */
  /* PAYMENT */
  /* ===================================================== */

  const goToPayment =
    (booking) => {

      navigate(
        DASHBOARD_ROUTES.payments,
        {
          state: {
            ...booking,
            cost:
              booking.total_cost ||
              booking.budget,
          },
        }
      );

    };

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-slate-500">

            Loading bookings...

          </p>

        </div>

      </div>

    );

  }

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <div className="min-h-screen bg-slate-50 px-4 md:px-6 py-8">

      <div className="max-w-[1600px] mx-auto">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="flex flex-wrap justify-between gap-4 items-end mb-8">

          <div>

            <p className="uppercase tracking-[0.25em] text-orange-500 text-sm font-semibold">

              TravelGenie Dashboard

            </p>

            <h1 className="text-4xl font-black text-slate-900 mt-3">

              My Bookings

            </h1>

            <p className="text-slate-500 mt-3">

              Track approvals, payments,
              invoices, and travel status.

            </p>

          </div>

        </div>

        {/* ===================================================== */}
        {/* STATS */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-4 gap-5 mb-8">

          {[
            [
              "Requested",
              stats.requested,
            ],
            [
              "Approved",
              stats.approved,
            ],
            [
              "Completed",
              stats.completed,
            ],
            [
              "Cancelled",
              stats.cancelled,
            ],
          ].map(([label, value]) => (

            <div
              key={label}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >

              <p className="text-slate-500 text-sm">

                {label}

              </p>

              <h2 className="text-4xl font-black text-slate-900 mt-3">

                {value}

              </h2>

            </div>

          ))}

        </div>

        {/* ===================================================== */}
        {/* EMPTY */}
        {/* ===================================================== */}

        {!loading &&
          bookings.length === 0 && (

          <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">

            <h2 className="text-3xl font-black text-slate-900">

              No Trips Booked Yet

            </h2>

            <p className="text-slate-500 mt-4">

              Start exploring trekking
              adventures and submit
              your first booking.

            </p>

            <button
              onClick={() =>
                navigate("/dashboard/packages")
              }
              className="mt-8 bg-orange-500 hover:bg-orange-600 transition text-white px-7 py-4 rounded-xl font-semibold"
            >

              Explore Packages

            </button>

          </div>

        )}

        {/* ===================================================== */}
        {/* BOOKINGS */}
        {/* ===================================================== */}

        <div className="grid lg:grid-cols-2 gap-6">

          {bookings.map((booking) => {

            const config =
              statusConfig[
                booking.status
              ] ||
              statusConfig.pending;

            const StatusIcon =
              config.icon;

            const canPay = [
              "approved",
              "payment_pending",
            ].includes(
              booking.status
            );

            const canInvoice = [
              "paid",
              "completed",
            ].includes(
              booking.status
            );

            return (

              <div
                key={booking.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >

                {/* ===================================================== */}
                {/* IMAGE */}
                {/* ===================================================== */}

                <div className="relative h-52">

                  <img
                    src={resolveDestinationImage(
                      booking.package_image,
                      booking.destination || booking.package_title
                    )}
                    alt={
                      booking.package_title ||
                      booking.destination
                    }
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                  {/* STATUS */}

                  <div className="absolute top-5 right-5">

                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm ${config.className}`}
                    >

                      <StatusIcon />

                      {config.label}

                    </div>

                  </div>

                  {/* TITLE */}

                  <div className="absolute bottom-0 left-0 right-0 p-6">

                    <h2 className="text-3xl font-black text-white">

                      {booking.package_title ||
                        booking.destination}

                    </h2>

                    <p className="text-white/80 mt-2">

                      Booking ID:
                      {" "}
                      {booking.booking_id}

                    </p>

                  </div>

                </div>

                {/* ===================================================== */}
                {/* CONTENT */}
                {/* ===================================================== */}

                <div className="p-6">

                  {/* INFO */}

                  <div className="space-y-4">

                    <InfoRow
                      icon={
                        <FaCalendarAlt />
                      }
                      label="Travel Date"
                      value={
                        booking.travel_date ||
                        `${booking.days} Days`
                      }
                    />

                    <InfoRow
                      icon={
                        <FaMoneyBillWave />
                      }
                      label="Total Cost"
                      value={`Rs ${Number(
                        booking.total_cost ||
                        booking.budget ||
                        0
                      ).toLocaleString("en-IN")}`}
                    />

                    <InfoRow
                      icon={
                        <FaUsers />
                      }
                      label="Travelers"
                      value={`${
                        booking.travelers || 1
                      } People`}
                    />

                    <InfoRow
                      icon={
                        <FaMapMarkedAlt />
                      }
                      label="Destination"
                      value={
                        booking.destination
                      }
                    />

                  </div>

                  {/* AGENT */}

                  {booking.assigned_agent && (

                    <div className="mt-6 bg-orange-50 rounded-xl p-5 border border-orange-100">

                      <p className="text-sm text-orange-600">

                        Assigned Agent

                      </p>

                      <h3 className="font-semibold text-slate-900 mt-2">

                        {
                          booking.assigned_agent
                        }

                      </h3>

                    </div>

                  )}

                  {/* ACTIONS */}

                  <div className="mt-7 pt-6 border-t border-slate-200 flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        navigate(
                          DASHBOARD_ROUTES.bookingDetail(
                            booking.booking_id
                          )
                        )
                      }
                      className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                    >

                      View Details

                    </button>

                    {canPay && (

                      <button
                        onClick={() =>
                          goToPayment(
                            booking
                          )
                        }
                        className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 transition text-white font-semibold"
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
                        className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-black transition text-white font-semibold flex items-center gap-2"
                      >

                        <FaFileInvoice />

                        Invoice

                      </button>

                    )}

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

}

/* ===================================================== */
/* INFO ROW */
/* ===================================================== */

function InfoRow({
  icon,
  label,
  value,
}) {

  return (

    <div className="flex items-center gap-4 text-slate-700">

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

  );

}

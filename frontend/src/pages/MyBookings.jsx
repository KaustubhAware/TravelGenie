import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { auth } from "../firebase";

import { exportInvoicePDF } from "../utils/exportPDF";

import { bookingService } from "../services/bookingService";

import { hasAuthToken } from "../utils/authToken";

import { DASHBOARD_ROUTES } from "../constants/routes";

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
      "bg-indigo-100 text-indigo-700",
    icon: FaClock,
  },

  payment_pending: {
    label: "Payment Pending",
    className:
      "bg-sky-100 text-sky-700",
    icon: FaMoneyBillWave,
  },

  approved: {
    label: "Approved",
    className:
      "bg-blue-100 text-blue-700",
    icon: FaCheckCircle,
  },

  paid: {
    label: "Paid",
    className:
      "bg-green-100 text-green-700",
    icon: FaCheckCircle,
  },

  completed: {
    label: "Completed",
    className:
      "bg-emerald-100 text-emerald-700",
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
      "bg-gray-200 text-gray-700",
    icon: FaTimesCircle,
  },

};

export default function MyBookings() {

  const navigate = useNavigate();

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // LOAD BOOKINGS
  // =====================================================

  useEffect(() => {

    let isMounted = true;

    const loadBookings = async () => {

      try {

        const user = auth.currentUser;

        if (!user || !hasAuthToken()) {

          return;

        }

        const token =
          await user.getIdToken();

        if (token) {

          localStorage.setItem(
            "token",
            token
          );

        }

        const data =
          await bookingService.getMyBookings();

        if (isMounted) {

          setBookings(
            data.bookings || []
          );

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

  // =====================================================
  // STATS
  // =====================================================

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

  // =====================================================
  // PAYMENT
  // =====================================================

  const goToPayment = (
    booking
  ) => {

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

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-[#f7f8f5] flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-gray-500">

            Loading bookings...

          </p>

        </div>

      </div>

    );

  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-[#f7f8f5] px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-wrap justify-between gap-4 items-end mb-10">

          <div>

            <p className="uppercase tracking-[0.25em] text-blue-600 text-sm font-semibold">

              TravelGenie Portal

            </p>

            <h1 className="text-5xl font-bold text-gray-900 mt-3">

              My Bookings

            </h1>

            <p className="text-gray-500 mt-3">

              Track approvals, payment requests,
              invoices, and expedition progress.

            </p>

          </div>

        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        <div className="grid md:grid-cols-4 gap-5 mb-10">

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
              className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm"
            >

              <p className="text-gray-500 text-sm">

                {label}

              </p>

              <h2 className="text-4xl font-bold text-gray-900 mt-3">

                {value}

              </h2>

            </div>

          ))}

        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {!loading &&
          bookings.length === 0 && (

          <div className="bg-white rounded-[32px] border border-gray-100 p-14 text-center">

            <h2 className="text-3xl font-bold text-gray-800">

              No bookings found

            </h2>

            <p className="text-gray-500 mt-4">

              Start exploring Maharashtra
              adventures and submit your
              first booking request.

            </p>

            <button
              onClick={() =>
                navigate("/packages")
              }
              className="mt-8 bg-blue-600 hover:bg-blue-700 transition text-white px-7 py-4 rounded-2xl font-semibold"
            >

              Explore Packages

            </button>

          </div>

        )}

        {/* =====================================================
            BOOKINGS GRID
        ===================================================== */}

        <div className="grid lg:grid-cols-2 gap-7">

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
                className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-lg transition"
              >

                {/* =====================================================
                    IMAGE
                ===================================================== */}

                <div className="relative h-64">

                  <img
                    src={
                      booking.package_image ||
                      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80"
                    }
                    alt={
                      booking.package_title ||
                      booking.destination
                    }
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  <div className="absolute top-5 right-5">

                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 backdrop-blur-md ${config.className}`}
                    >

                      <StatusIcon />

                      {config.label}

                    </div>

                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">

                    <h2 className="text-3xl font-bold text-white">

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

                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div className="p-7">

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
                      value={`Rs. ${
                        booking.total_cost ||
                        booking.budget
                      }`}
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

                    <div className="mt-6 bg-blue-50 rounded-2xl p-5">

                      <p className="text-sm text-blue-700">

                        Assigned Agent

                      </p>

                      <h3 className="font-semibold text-blue-900 mt-2">

                        {
                          booking.assigned_agent
                        }

                      </h3>

                    </div>

                  )}

                  {/* ACTIONS */}

                  <div className="mt-7 pt-6 border-t border-gray-100 flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        navigate(
                          DASHBOARD_ROUTES.bookingDetail(
                            booking.booking_id
                          )
                        )
                      }
                      className="px-5 py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
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
                        className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold"
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
                        className="px-5 py-3 rounded-2xl bg-gray-900 hover:bg-black transition text-white font-semibold flex items-center gap-2"
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

// =====================================================
// INFO ROW
// =====================================================

function InfoRow({
  icon,
  label,
  value,
}) {

  return (

    <div className="flex items-center gap-4 text-gray-700">

      <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">

        {icon}

      </div>

      <div>

        <p className="text-sm text-gray-500">

          {label}

        </p>

        <h3 className="font-semibold text-gray-900 mt-1">

          {value || "-"}

        </h3>

      </div>

    </div>

  );

}
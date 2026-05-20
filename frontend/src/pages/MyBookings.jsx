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
} from "react-icons/fa";

const statusConfig = {
  pending: {
    label: "Requested",
    className: "bg-yellow-100 text-yellow-700",
    icon: FaClock,
  },
  under_review: {
    label: "Under Review",
    className: "bg-indigo-100 text-indigo-700",
    icon: FaClock,
  },
  payment_pending: {
    label: "Payment Pending",
    className: "bg-sky-100 text-sky-700",
    icon: FaMoneyBillWave,
  },
  approved: {
    label: "Approved",
    className: "bg-primary/10 text-primary",
    icon: FaCheckCircle,
  },
  paid: {
    label: "Paid",
    className: "bg-green-100 text-green-700",
    icon: FaCheckCircle,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700",
    icon: FaCheckCircle,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700",
    icon: FaTimesCircle,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-200 text-gray-700",
    icon: FaTimesCircle,
  },
};

export default function MyBookings() {

  const navigate = useNavigate();

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !hasAuthToken()) return;

        const token = await user.getIdToken();
        if (token) {
          localStorage.setItem("token", token);
        }

        const data =
          await bookingService.getMyBookings();

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

  const stats = useMemo(() => ({
    requested: bookings.filter((b) =>
      ["pending", "under_review"].includes(b.status)
    ).length,
    approved: bookings.filter((b) =>
      ["approved", "payment_pending"].includes(b.status)
    ).length,
    completed: bookings.filter((b) =>
      ["paid", "completed"].includes(b.status)
    ).length,
    cancelled: bookings.filter((b) =>
      ["cancelled", "rejected"].includes(b.status)
    ).length,
  }), [bookings]);

  const goToPayment = (booking) => {
    navigate(DASHBOARD_ROUTES.payments, {
      state: {
        ...booking,
        cost: booking.total_cost || booking.budget,
      },
    });
  };

  return (
    <div className="min-h-screen bg-surface px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            My Bookings
          </h1>
          <p className="text-gray-500 mt-2">
            Track booking requests, approvals, payments, and invoices
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">
          {[
            ["Requested", stats.requested],
            ["Approved", stats.approved],
            ["Completed", stats.completed],
            ["Cancelled", stats.cancelled],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              <p className="text-gray-500 text-sm">{label}</p>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {value}
              </h2>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-500">
            Loading bookings...
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              No bookings found
            </h2>
            <p className="text-gray-500 mt-3">
              Submit a booking request to begin agency review
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {bookings.map((booking) => {
            const config =
              statusConfig[booking.status] ||
              statusConfig.pending;
            const StatusIcon = config.icon;
            const canPay = [
              "approved",
              "payment_pending",
            ].includes(booking.status);
            const canInvoice = [
              "paid",
              "completed",
            ].includes(booking.status);

            return (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {booking.destination}
                    </h2>
                    <p className="text-gray-500 mt-2">
                      Booking ID: {booking.booking_id}
                    </p>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${config.className}`}
                  >
                    <StatusIcon />
                    {config.label}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaCalendarAlt className="text-primary" />
                    <span>{booking.days} Days</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaMoneyBillWave className="text-primary" />
                    <span>Rs. {booking.total_cost || booking.budget}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaMapMarkedAlt className="text-primary" />
                    <span>{booking.name}</span>
                  </div>
                </div>

                {booking.assigned_agent && (
                  <div className="mt-5 bg-primary/10 rounded-2xl p-4 text-sm text-primary">
                    Assigned Agent: {booking.assigned_agent}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      navigate(DASHBOARD_ROUTES.bookingDetail(booking.booking_id))
                    }
                    className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50"
                  >
                    View Details
                  </button>

                  {canPay && (
                    <button
                      onClick={() => goToPayment(booking)}
                      className="px-5 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark"
                    >
                      Pay Now
                    </button>
                  )}

                  {canInvoice && (
                    <button
                      onClick={() =>
                        exportInvoicePDF(booking)
                      }
                      className="px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black flex items-center gap-2"
                    >
                      <FaFileInvoice />
                      Invoice
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

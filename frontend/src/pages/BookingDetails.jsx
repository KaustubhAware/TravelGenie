import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { auth } from "../firebase";
import { exportInvoicePDF } from "../utils/exportPDF";
import { API_BASE } from "../services/httpClient";

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaFileInvoice,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaUserTie,
} from "react-icons/fa";

const timeline = [
  ["pending", "Request submitted"],
  ["under_review", "Agency review"],
  ["payment_pending", "Payment pending"],
  ["paid", "Payment received"],
  ["completed", "Trip completed"],
];

export default function BookingDetails() {

  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const loadBooking = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          navigate("/login");
          return;
        }

        const token = await user.getIdToken();

        const res = await fetch(
          `${API_BASE}/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "Booking not found");
        }

        if (mounted) {
          setBooking(data.booking);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadBooking();

    return () => {
      mounted = false;
    };
  }, [bookingId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f9ff] flex items-center justify-center text-gray-500">
        Loading booking details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#f5f9ff] flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Booking not found
          </h1>
          <button
            onClick={() => navigate("/dashboard/bookings")}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Back to bookings
          </button>
        </div>
      </div>
    );
  }

  const activeIndex =
    timeline.findIndex(([status]) =>
      status === booking.status
    );

  const canInvoice =
    booking.status === "paid" ||
    booking.status === "completed";

  const canPay =
    booking.status === "approved" ||
    booking.status === "payment_pending";

  return (
    <div className="min-h-screen bg-[#f5f9ff] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Booking Details
            </h1>
            <p className="text-gray-500 mt-2">
              {booking.booking_id}
            </p>
          </div>

          <div className="flex gap-3">
            {canPay && (
              <button
                onClick={() =>
                  navigate("/dashboard/payments", {
                    state: {
                      ...booking,
                      cost: booking.total_cost,
                    },
                  })
                }
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Pay Now
              </button>
            )}
            {canInvoice && (
              <button
                onClick={() =>
                  exportInvoicePDF(booking)
                }
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              >
                <FaFileInvoice />
                Invoice
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Trip Summary
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <InfoCard
                  icon={<FaMapMarkedAlt />}
                  label="Destination"
                  value={booking.destination}
                />
                <InfoCard
                  icon={<FaCalendarAlt />}
                  label="Duration"
                  value={`${booking.days} Days`}
                />
                <InfoCard
                  icon={<FaMoneyBillWave />}
                  label="Total Cost"
                  value={`Rs. ${booking.total_cost || booking.budget}`}
                />
                <InfoCard
                  icon={<FaUserTie />}
                  label="Assigned Agent"
                  value={booking.assigned_agent || "Pending assignment"}
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Customer Information
              </h2>
              <div className="grid md:grid-cols-3 gap-4 text-gray-700">
                <Detail label="Name" value={booking.name} />
                <Detail label="Email" value={booking.email} />
                <Detail label="Phone" value={booking.phone} />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Agency Notes
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {booking.internal_notes ||
                  "The agency team has not added notes yet."}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Booking Timeline
            </h2>

            <div className="space-y-5">
              {timeline.map(([status, label], index) => {
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        done
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {done ? <FaCheckCircle /> : <FaClock />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {label}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {done ? "Completed" : "Awaiting update"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-blue-50 rounded-2xl p-5">
              <p className="text-sm text-gray-500">
                Current Status
              </p>
              <h3 className="text-xl font-bold text-blue-700 mt-1">
                {booking.status?.replace("_", " ")}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Payment: {booking.payment_status || "unpaid"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white text-blue-600 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h3 className="font-semibold text-gray-900 mt-1">
            {value || "-"}
          </h3>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className="font-semibold text-gray-900 mt-1">
        {value || "-"}
      </h3>
    </div>
  );
}

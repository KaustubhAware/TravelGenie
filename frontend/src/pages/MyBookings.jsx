// src/pages/MyBookings.jsx

import {
  useEffect,
  useState,
} from "react";

import { auth } from "../firebase";

import {
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

export default function MyBookings() {

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();

        const res = await fetch(
          "http://127.0.0.1:8000/api/my-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

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

  return (

    <div className="min-h-screen bg-[#f5f9ff] px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-gray-900">

            My Bookings

          </h1>

          <p className="text-gray-500 mt-2">

            View your booking history

          </p>

        </div>

        {/* LOADING */}

        {loading && (

          <div className="text-center py-20 text-gray-500">

            Loading bookings...

          </div>

        )}

        {/* EMPTY */}

        {!loading &&
          bookings.length === 0 && (

          <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">

            <h2 className="text-2xl font-bold text-gray-800">

              No bookings found

            </h2>

            <p className="text-gray-500 mt-3">

              Start planning your first trip

            </p>

          </div>

        )}

        {/* BOOKINGS */}

        <div className="grid lg:grid-cols-2 gap-6">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm"
            >

              {/* TOP */}

              <div className="flex items-start justify-between mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">

                    {booking.destination}

                  </h2>

                  <p className="text-gray-500 mt-2">

                    Booking ID:
                    {" "}
                    {booking.booking_id}

                  </p>

                </div>

                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                    booking.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >

                  {booking.status === "paid"
                    ? <FaCheckCircle />
                    : <FaClock />}

                  {booking.status}

                </div>

              </div>

              {/* DETAILS */}

              <div className="space-y-4">

                <div className="flex items-center gap-3 text-gray-700">

                  <FaCalendarAlt className="text-blue-600" />

                  <span>
                    {booking.days} Days
                  </span>

                </div>

                <div className="flex items-center gap-3 text-gray-700">

                  <FaMoneyBillWave className="text-blue-600" />

                  <span>
                    ₹ {booking.budget}
                  </span>

                </div>

                <div className="flex items-center gap-3 text-gray-700">

                  <FaMapMarkedAlt className="text-blue-600" />

                  <span>
                    {booking.name}
                  </span>

                </div>

              </div>

              {/* DATE */}

              <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">

                Created:
                {" "}
                {booking.created_at}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}
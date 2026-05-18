import { useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { API_BASE } from "../services/httpClient";
import { toast, Toaster } from "react-hot-toast";

import {
  FaLock,
  FaCreditCard,
  FaWallet,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";

export default function Payment() {

  const location = useLocation();

  const navigate = useNavigate();

  const data = location.state || {};

  const [loading, setLoading] = useState(false);

  /* ================= PROTECT ROUTE ================= */

  useEffect(() => {

    const user = auth.currentUser;

    if (!user) {

      toast.error("Please login first");

      navigate("/login");

      return;

    }

    if (!data?.booking_id) {

      toast.error("Booking missing");

      navigate("/plan");

    }

  }, [data, navigate]);

  /* ================= HANDLE PAYMENT ================= */

  const handlePayment = async () => {

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
        `${API_BASE}/update-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: data.booking_id,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || result.error) {

        throw new Error(result.error || "Payment failed");

      }

      toast.success("Payment successful!");

      navigate("/booking-success", {
        state: data,
      });

    } catch (err) {

      console.error(err);

      toast.error(err.message || "Payment failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <>
   

      <Toaster position="top-right" />

      <div className="min-h-screen bg-[#f5f9ff] px-4 md:px-6 py-6">

        <div className="max-w-7xl mx-auto">

          {/* ================= HEADER ================= */}

          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">

            <div>

              <h1 className="text-4xl font-bold text-gray-900">
                Secure Payment
              </h1>

              <p className="text-gray-500 mt-2">
                Complete simulated payment after agency approval
              </p>

            </div>

            {/* STEPS */}

            <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">

              <div className="flex items-center gap-4 text-sm font-medium">

                <span className="text-green-600">
                  1. Booking
                </span>

                <span className="text-gray-300">→</span>

                <span className="text-blue-600">
                  2. Payment
                </span>

                <span className="text-gray-300">→</span>

                <span className="text-gray-400">
                  3. Success
                </span>

              </div>

            </div>

          </div>

          {/* ================= MAIN GRID ================= */}

          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">

            {/* ================================================= */}
            {/* ================= LEFT PAYMENT ================== */}
            {/* ================================================= */}

            <div className="bg-white border border-gray-200 rounded-[30px] shadow-sm p-7">

              {/* TOP */}

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Payment Details
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Enter your card information securely
                  </p>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">

                  <FaCreditCard className="text-blue-600 text-xl" />

                </div>

              </div>

              {/* FORM */}

              <div className="space-y-5">

                {/* CARD NUMBER */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-3">

                    Card Number

                  </label>

                  <div className="relative">

                    <FaCreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-14 pr-5 py-4 text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                    />

                  </div>

                </div>

                {/* EXPIRY + CVV */}

                <div className="grid grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-3">

                      Expiry Date

                    </label>

                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                    />

                  </div>

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-3">

                      CVV

                    </label>

                    <input
                      type="password"
                      placeholder="***"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                    />

                  </div>

                </div>

                {/* CARD HOLDER */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-3">

                    Cardholder Name

                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                  />

                </div>

                {/* SECURITY BOX */}

                <div className="bg-green-50 border border-green-100 rounded-3xl p-5">

                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">

                      <FaShieldAlt className="text-green-600 text-lg" />

                    </div>

                    <div>

                      <h3 className="font-semibold text-green-700">
                        Secure Checkout
                      </h3>

                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">

                        Your payment details are encrypted and securely processed.

                      </p>

                    </div>

                  </div>

                </div>

                {/* PAY BUTTON */}

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center gap-3"
                >

                  {loading
                    ? "Processing Payment..."
                    : `Pay Rs. ${data.cost || data.total_cost || data.budget || 0}`}

                  {!loading && <FaArrowRight />}

                </button>

                {/* LOCK */}

                <div className="flex items-center justify-center gap-3 text-sm text-gray-500">

                  <FaLock />

                  256-bit encrypted secure payment

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* ================= RIGHT SUMMARY ================= */}
            {/* ================================================= */}

            <div className="bg-white border border-gray-200 rounded-[30px] shadow-sm p-6 sticky top-24">

              {/* TITLE */}

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Trip Summary
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Booking overview
                  </p>

                </div>

                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">

                  <FaWallet className="text-blue-600 text-xl" />

                </div>

              </div>

              {/* DESTINATION */}

              <div className="space-y-4">

                <div className="bg-gray-50 rounded-2xl p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center">

                      <FaMapMarkedAlt className="text-blue-600" />

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Destination
                      </p>

                      <h3 className="font-semibold text-gray-900 mt-1">

                        {data.destination || "-"}

                      </h3>

                    </div>

                  </div>

                </div>

                {/* DAYS */}

                <div className="bg-gray-50 rounded-2xl p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center">

                      <FaCalendarAlt className="text-blue-600" />

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Duration
                      </p>

                      <h3 className="font-semibold text-gray-900 mt-1">

                        {data.days || "-"} Days

                      </h3>

                    </div>

                  </div>

                </div>

              </div>

              {/* PRICE */}

              <div className="mt-6 border border-gray-200 rounded-3xl p-5">

                <h3 className="font-semibold text-gray-900 mb-5">
                  Payment Summary
                </h3>

                <div className="space-y-4">

                  <div className="flex justify-between text-gray-600">

                    <span>Trip Cost</span>

                    <span>
                      Rs. {data.cost || data.total_cost || data.budget || 0}
                    </span>

                  </div>

                  <div className="flex justify-between text-gray-600">

                    <span>Taxes & Fees</span>

                    <span>Rs. 0</span>

                  </div>

                  <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">

                    <span>Total</span>

                    <span>
                      Rs. {data.cost || data.total_cost || data.budget || 0}
                    </span>

                  </div>

                </div>

              </div>

              {/* INFO */}

              <div className="mt-5 bg-blue-50 rounded-3xl p-5">

                <div className="flex gap-4">

                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center">

                    <FaShieldAlt className="text-blue-600" />

                  </div>

                  <div>

                    <h3 className="font-semibold text-blue-700">
                      Protected Payment
                    </h3>

                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">

                      All payment transactions are encrypted and secure.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}

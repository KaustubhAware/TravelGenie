import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useEffect,
} from "react";

import { auth } from "../../firebase";

import { API_BASE } from "../../services/httpClient";

import {
  toast,
  Toaster,
} from "react-hot-toast";

import {
  FaLock,
  FaCreditCard,
  FaWallet,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaArrowRight,
  FaShieldAlt,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

export default function Payment() {

  const location = useLocation();

  const navigate = useNavigate();

  const data = location.state || {};

  const [loading, setLoading] =
    useState(false);

  // =====================================================
  // PROTECT ROUTE
  // =====================================================

  useEffect(() => {

    const user = auth.currentUser;

    if (!user) {

      toast.error(
        "Please login first"
      );

      navigate("/login");

      return;

    }

    if (!data?.booking_id) {

      toast.error(
        "Booking missing"
      );

      navigate(
        "/dashboard/bookings"
      );

    }

  }, [data, navigate]);

  // =====================================================
  // HANDLE PAYMENT
  // =====================================================

  const handlePayment = async () => {

  const user = auth.currentUser;

  if (!user) {

    toast.error("Please login first");

    navigate("/login");

    return;

  }

  setLoading(true);

  try {

    const token =
      await user.getIdToken();

    // =====================================================
    // CREATE ORDER
    // =====================================================

    const orderRes = await fetch(

      `${API_BASE}/create-order`,

      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({

          booking_id:
            data.booking_id,

          amount:
            data.cost ||
            data.total_cost ||
            data.budget ||
            0,

        }),

      }
    );

    const orderData =
      await orderRes.json();

    if (!orderRes.ok) {

      throw new Error(
        orderData.detail ||
        "Order creation failed"
      );

    }

    // =====================================================
    // RAZORPAY OPTIONS
    // =====================================================

    const options = {

      key:
        import.meta.env
          .VITE_RAZORPAY_KEY_ID,

      amount:
        orderData.order.amount,

      currency: "INR",

      name: "TravelGenie",

      description:
        "Trek Booking Payment",

      order_id:
        orderData.order.id,

      handler:
        async function (
          response
        ) {

          // =====================================================
          // VERIFY PAYMENT
          // =====================================================

          const verifyRes =
            await fetch(

              `${API_BASE}/verify-payment`,

              {

                method: "POST",

                headers: {

                  "Content-Type":
                    "application/json",

                  Authorization:
                    `Bearer ${token}`,

                },

                body: JSON.stringify({

                  booking_id:
                    data.booking_id,

                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,

                }),

              }

            );

          const verifyData =
            await verifyRes.json();

          if (!verifyRes.ok) {

            throw new Error(
              verifyData.detail
            );

          }

          toast.success(
            "Payment successful!"
          );

          navigate(
            "/dashboard/booking-success",
            {
              state: {
                ...data,
                paymentSuccess: true,
              },
            }
          );

        },

      theme: {

        color: "#f97316",

      },

    };

    const razorpay =
      new window.Razorpay(
        options
      );

    razorpay.open();

  } catch (err) {

    console.error(err);

    toast.error(
      err.message ||
      "Payment failed"
    );

  } finally {

    setLoading(false);

  }

};
  // =====================================================
  // UI
  // =====================================================

  return (

    <>

      <Toaster position="top-right" />

      <div className="min-h-screen bg-[#f7f8f5] pb-12">

        {/* =====================================================
            HERO
        ===================================================== */}

        <div className="relative h-[340px] overflow-hidden">

          <img
            src={
              data.package_image ||
              "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80"
            }
            alt={
              data.package_title ||
              data.destination
            }
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />

          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-10">

            <div className="flex flex-wrap justify-between gap-6 items-end">

              <div>

                <p className="uppercase tracking-[0.25em] text-white/70 text-sm font-semibold">

                  Secure Checkout

                </p>

                <h1 className="text-5xl font-bold text-white mt-3">

                  {data.package_title ||
                    data.destination}

                </h1>

                <div className="flex flex-wrap gap-5 mt-5 text-white/85">

                  <div className="flex items-center gap-2">

                    <FaMapMarkedAlt />

                    <span>

                      {data.package_location ||
                        data.destination}

                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <FaCalendarAlt />

                    <span>

                      {data.package_duration ||
                        `${data.days} Days`}

                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <FaUsers />

                    <span>

                      {data.travelers || 1} Travelers

                    </span>

                  </div>

                </div>

              </div>

              {/* STEP */}

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-7 py-5">

                <div className="flex items-center gap-5 text-sm font-semibold text-white">

                  <span className="text-green-300">

                    1. Booking

                  </span>

                  <span className="text-white/40">

                    →

                  </span>

                  <span className="text-blue-300">

                    2. Payment

                  </span>

                  <span className="text-white/40">

                    →

                  </span>

                  <span className="text-white/60">

                    3. Success

                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            MAIN
        ===================================================== */}

        <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">

          <div className="grid lg:grid-cols-[1fr_400px] gap-7 items-start">

            {/* =====================================================
                LEFT
            ===================================================== */}

            <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm p-8">

              {/* TITLE */}

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h2 className="text-3xl font-bold text-gray-900">

                    Payment Details

                  </h2>

                  <p className="text-gray-500 mt-2">

                    Complete your secure booking payment

                  </p>

                </div>

                <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center">

                  <FaCreditCard className="text-blue-600 text-2xl" />

                </div>

              </div>

              {/* FORM */}

              <div className="space-y-6">

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
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-14 pr-5 py-4 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                    />

                  </div>

                </div>

                {/* EXPIRY */}

                <div className="grid grid-cols-2 gap-5">

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-3">

                      Expiry Date

                    </label>

                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                    />

                  </div>

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-3">

                      CVV

                    </label>

                    <input
                      type="password"
                      placeholder="***"
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                    />

                  </div>

                </div>

                {/* HOLDER */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-3">

                    Cardholder Name

                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:bg-white"
                  />

                </div>

                {/* SECURITY */}

                <div className="bg-green-50 border border-green-100 rounded-3xl p-6">

                  <div className="flex items-start gap-5">

                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">

                      <FaShieldAlt className="text-green-600 text-xl" />

                    </div>

                    <div>

                      <h3 className="font-semibold text-green-700 text-lg">

                        Secure Checkout

                      </h3>

                      <p className="text-gray-600 mt-2 leading-relaxed">

                        Your payment information is encrypted and protected with secure processing systems.

                      </p>

                    </div>

                  </div>

                </div>

                {/* BUTTON */}

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-5 rounded-2xl font-semibold text-lg shadow-md flex items-center justify-center gap-3"
                >

                  {loading
                    ? "Processing Payment..."
                    : `Pay Rs. ${
                        data.cost ||
                        data.total_cost ||
                        data.budget ||
                        0
                      }`}

                  {!loading && (
                    <FaArrowRight />
                  )}

                </button>

                {/* LOCK */}

                <div className="flex items-center justify-center gap-3 text-sm text-gray-500">

                  <FaLock />

                  256-bit encrypted secure payment

                </div>

              </div>

            </div>

            {/* =====================================================
                RIGHT
            ===================================================== */}

            <div className="space-y-6 sticky top-24">

              {/* SUMMARY */}

              <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm p-7">

                <div className="flex items-center justify-between mb-7">

                  <div>

                    <h2 className="text-2xl font-bold text-gray-900">

                      Booking Summary

                    </h2>

                    <p className="text-gray-500 mt-2">

                      Expedition overview

                    </p>

                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">

                    <FaWallet className="text-blue-600 text-xl" />

                  </div>

                </div>

                <div className="space-y-5">

                  <SummaryRow
                    icon={<FaMapMarkedAlt />}
                    label="Destination"
                    value={
                      data.package_location ||
                      data.destination
                    }
                  />

                  <SummaryRow
                    icon={<FaCalendarAlt />}
                    label="Duration"
                    value={
                      data.package_duration ||
                      `${data.days} Days`
                    }
                  />

                  <SummaryRow
                    icon={<FaUsers />}
                    label="Travelers"
                    value={`${
                      data.travelers || 1
                    } People`}
                  />

                </div>

                {/* PRICE */}

                <div className="mt-7 border border-gray-100 rounded-3xl p-6">

                  <h3 className="font-semibold text-gray-900 mb-5">

                    Payment Summary

                  </h3>

                  <div className="space-y-4">

                    <div className="flex justify-between text-gray-600">

                      <span>

                        Package Cost

                      </span>

                      <span>

                        Rs. {
                          data.cost ||
                          data.total_cost ||
                          data.budget ||
                          0
                        }

                      </span>

                    </div>

                    <div className="flex justify-between text-gray-600">

                      <span>

                        Taxes & Fees

                      </span>

                      <span>

                        Rs. 0

                      </span>

                    </div>

                    <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">

                      <span>

                        Total

                      </span>

                      <span>

                        Rs. {
                          data.cost ||
                          data.total_cost ||
                          data.budget ||
                          0
                        }

                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* PAYMENT SECURITY */}

              <div className="bg-blue-50 rounded-[32px] p-7 border border-blue-100">

                <div className="flex gap-5">

                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">

                    <FaCheckCircle className="text-blue-600 text-xl" />

                  </div>

                  <div>

                    <h3 className="font-semibold text-blue-700 text-lg">

                      Protected Payment

                    </h3>

                    <p className="text-gray-600 mt-2 leading-relaxed">

                      All transactions are encrypted and processed securely.

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

// =====================================================
// SUMMARY ROW
// =====================================================

function SummaryRow({
  icon,
  label,
  value,
}) {

  return (

    <div className="bg-gray-50 rounded-2xl p-5">

      <div className="flex items-center gap-4">

        <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-blue-600">

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

    </div>

  );

}
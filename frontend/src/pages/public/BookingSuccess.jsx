import { useNavigate, useLocation } from "react-router-dom";

import { useEffect } from "react";
import { auth } from "../../firebase";

import {
  FaCheckCircle,
  FaPlaneDeparture,
  FaCalendarAlt,
  FaWallet,
  FaTicketAlt,
  FaArrowRight,
} from "react-icons/fa";

export default function BookingSuccess() {

  const navigate = useNavigate();

  const location = useLocation();

  const data = location.state || {};

  useEffect(() => {

    const user = auth.currentUser;

    // 🔐 LOGIN CHECK

    if (!user) {

      navigate("/login");

      return;

    }

    // 🔐 DATA CHECK

    if (!data || !data.booking_id) {

      navigate("/dashboard/ai-planner");

    }

  }, [data, navigate]);

  // ✅ SAFE COST

  const totalAmount = data.cost || data.budget || 0;

  return (

    <>
      

      <div className="min-h-screen bg-surface px-4 md:px-6 py-8">

        <div className="max-w-5xl mx-auto">

          {/* ================= SUCCESS CARD ================= */}

          <div className="bg-white border border-gray-200 rounded-[36px] shadow-sm overflow-hidden">

            {/* TOP SECTION */}

            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-12 text-center text-white relative overflow-hidden">

              {/* CIRCLE */}

              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-6 border border-white/30">

                <FaCheckCircle className="text-5xl text-white" />

              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">

                Booking Confirmed

              </h1>

              <p className="text-lg text-green-50 max-w-2xl mx-auto leading-relaxed">

                Your trip has been successfully booked and payment
                has been confirmed. Get ready for an unforgettable
                travel experience.

              </p>

            </div>

            {/* CONTENT */}

            <div className="p-8 md:p-10">

              <div className="grid lg:grid-cols-[1fr_350px] gap-8">

                {/* ================================================= */}
                {/* ================= LEFT DETAILS ================== */}
                {/* ================================================= */}

                <div>

                  {/* BOOKING INFO */}

                  <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 mb-8">

                    <div className="flex items-center justify-between flex-wrap gap-4">

                      <div>

                        <p className="text-sm text-gray-500 mb-2">
                          Booking ID
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900">
                          {data.booking_id || "-"}
                        </h2>

                      </div>

                      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">

                        <FaTicketAlt className="text-2xl text-green-500" />

                      </div>

                    </div>

                  </div>

                  {/* TRIP DETAILS */}

                  <div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">

                      Trip Details

                    </h2>

                    <div className="space-y-5">

                      {/* DESTINATION */}

                      <div className="bg-white border border-gray-200 rounded-3xl p-5">

                        <div className="flex items-center gap-4">

                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">

                            <FaPlaneDeparture className="text-primary text-xl" />

                          </div>

                          <div>

                            <p className="text-sm text-gray-500">
                              Destination
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mt-1">

                              {data.destination || "-"}

                            </h3>

                          </div>

                        </div>

                      </div>

                      {/* DURATION */}

                      <div className="bg-white border border-gray-200 rounded-3xl p-5">

                        <div className="flex items-center gap-4">

                          <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">

                            <FaCalendarAlt className="text-purple-600 text-xl" />

                          </div>

                          <div>

                            <p className="text-sm text-gray-500">
                              Duration
                            </p>

                            <h3 className="text-xl font-semibold text-gray-900 mt-1">

                              {data.days
                                ? `${data.days} Days`
                                : "-"}

                            </h3>

                          </div>

                        </div>

                      </div>

                      {/* PAYMENT */}

                      <div className="bg-white border border-gray-200 rounded-3xl p-5">

                        <div className="flex items-center gap-4">

                          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">

                            <FaWallet className="text-green-600 text-xl" />

                          </div>

                          <div>

                            <p className="text-sm text-gray-500">
                              Total Paid
                            </p>

                            <h3 className="text-2xl font-bold text-green-600 mt-1">

                              ₹ {totalAmount}

                            </h3>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ================================================= */}
                {/* ================= RIGHT PANEL =================== */}
                {/* ================================================= */}

                <div>

                  {/* STATUS */}

                  <div className="bg-primary-dark rounded-[32px] p-8 text-white">

                    <div className="mb-8">

                      <p className="text-sm text-white/70 mb-3">
                        Booking Status
                      </p>

                      <h2 className="text-3xl font-bold">
                        Successfully Confirmed
                      </h2>

                    </div>

                    {/* TIMELINE */}

                    <div className="space-y-6">

                      <div className="flex gap-4">

                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">

                          ✓

                        </div>

                        <div>

                          <h3 className="font-semibold">
                            Booking Completed
                          </h3>

                          <p className="text-sm text-white/70 mt-1">
                            Your booking has been successfully saved
                          </p>

                        </div>

                      </div>

                      <div className="flex gap-4">

                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">

                          ✉

                        </div>

                        <div>

                          <h3 className="font-semibold">
                            Confirmation Email
                          </h3>

                          <p className="text-sm text-white/70 mt-1">
                            Booking details will be shared shortly
                          </p>

                        </div>

                      </div>

                      <div className="flex gap-4">

                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">

                          ✈

                        </div>

                        <div>

                          <h3 className="font-semibold">
                            Ready To Travel
                          </h3>

                          <p className="text-sm text-white/70 mt-1">
                            Prepare for your amazing journey
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* BUTTONS */}

                  <div className="space-y-4 mt-6">

                    <button
                      onClick={() => navigate("/")}
                      className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-semibold transition duration-300"
                    >

                      Go To Home

                    </button>

                    <button
                      onClick={() => navigate("/dashboard/saved")}
                      className="w-full border border-gray-300 hover:bg-gray-100 text-gray-800 py-4 rounded-2xl font-semibold transition duration-300 flex items-center justify-center gap-3"
                    >

                      View Saved Trips

                      <FaArrowRight />

                    </button>

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

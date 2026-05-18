import { useCallback, useEffect, useState } from "react";
import { analyticsService } from "../services/analyticsService";
import { bookingService } from "../services/bookingService";

import AdminLayout from "../layouts/AdminLayout";

import StatCard from "../components/admin/StatCard";
import BookingTable from "../components/admin/BookingTable";

import RevenueChart from "../components/admin/charts/RevenueChart";
import StatusChart from "../components/admin/charts/StatusChart";
import DestinationChart from "../components/admin/charts/DestinationChart";
import RevenueTrendChart from "../components/admin/charts/RevenueTrendChart";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

import {
  FaSuitcaseRolling,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

export default function AdminDashboard() {

  /* ================================================= */
  /* ================= STATES ======================== */
  /* ================================================= */

  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    approved: 0,
    pending: 0,
    cancelled: 0,
    payment_pending: 0,
    under_review: 0,
    completed: 0,
    cancellation_rate: 0,
    conversion_rate: 0,
    revenue: 0,
    clients: 0,
  });

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [revenueTrend, setRevenueTrend] =
    useState([]);

  const [topDestinations, setTopDestinations] =
    useState([]);

  const [advancedAnalytics, setAdvancedAnalytics] =
    useState({
      retention_rate: 0,
      monthly: [],
      destinations: [],
      status_breakdown: [],
    });

  const [activityLogs, setActivityLogs] =
    useState([]);

  const [page, setPage] =
    useState(1);

  const [statusFilter, setStatusFilter] =
    useState("all");

  const itemsPerPage = 5;

  /* ================================================= */
  /* ================= FETCH DATA ==================== */
  /* ================================================= */

  const fetchData = useCallback(async () => {

    try {

      setLoading(true);

      /* STATS */

      const statsData =
        await analyticsService.getStats();

      setStats(statsData);

      /* BOOKINGS */

      const bookingsData =
        await bookingService.getAdminBookings();

      setBookings(
        bookingsData.bookings || []
      );

      /* REVENUE TREND */

      const trendData =
        await analyticsService.getRevenueByDate();

      setRevenueTrend(
        trendData.data || []
      );

      /* TOP DESTINATIONS */

      const topData =
        await analyticsService.getTopDestinations();

      setTopDestinations(
        topData.data || []
      );

      const advancedData =
        await analyticsService.getAdvanced();

      setAdvancedAnalytics(
        advancedData || {}
      );

      const logsData =
        await analyticsService.getActivityLogs();

      setActivityLogs(
        logsData.logs || []
      );

    } catch (err) {

      console.error(err);

      alert(
        "Failed to load dashboard"
      );

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {

    fetchData();

  }, [fetchData]);

  /* ================================================= */
  /* ================= UPDATE STATUS ================= */
  /* ================================================= */

  const updateStatus = async (
    booking_id,
    status
  ) => {

    try {

      await bookingService.updateStatus(
        booking_id,
        status
      );

      fetchData();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to update status"
      );

    }

  };

  const reviewBooking = async (
    payload
  ) => {

    try {

      await bookingService.reviewBooking(payload);

      fetchData();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to update review"
      );

    }

  };

  /* ================================================= */
  /* ================= CANCEL BOOKING ================ */
  /* ================================================= */

  const cancelBooking = async (
    booking_id
  ) => {

    const confirmDelete =
      window.confirm(
        "Cancel this booking?"
      );

    if (!confirmDelete) return;

    try {

      await bookingService.cancelBooking(booking_id);

      fetchData();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to cancel booking"
      );

    }

  };

  /* ================================================= */
  /* ================= FILTER BOOKINGS =============== */
  /* ================================================= */

  const filteredBookings =
    bookings
      .filter((b) =>
        statusFilter === "all"
          ? true
          : b.status === statusFilter
      )
      .filter((b) =>
        `${b.destination} ${b.name}`
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

  const totalPages = Math.ceil(
    filteredBookings.length /
      itemsPerPage
  );

  const paginatedBookings =
    filteredBookings.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

  /* ================================================= */
  /* ================= CHART DATA ==================== */
  /* ================================================= */

  const revenueData = {

    labels: ["Revenue"],

    datasets: [
      {
        label: "Revenue",

        data: [
          stats.revenue || 0,
        ],

        backgroundColor:
          "#2563eb",

        borderRadius: 16,
      },
    ],
  };

  const statusData = {

    labels: [
      "Paid",
      "Approved",
      "Payment Pending",
      "Pending",
      "Cancelled",
    ],

    datasets: [
      {
        data: [
          stats.paid || 0,
          stats.approved || 0,
          stats.payment_pending || 0,
          stats.pending || 0,
          stats.cancelled || 0,
        ],

        backgroundColor: [
          "#22c55e",
          "#2563eb",
          "#0ea5e9",
          "#facc15",
          "#94a3b8",
        ],
      },
    ],
  };

  const lineData = {

    labels: revenueTrend.map(
      (i) => i.date || ""
    ),

    datasets: [
      {
        label:
          "Revenue Trend",

        data: revenueTrend.map(
          (i) =>
            i.revenue || 0
        ),

        borderColor:
          "#2563eb",

        backgroundColor:
          "#2563eb",

        tension: 0.4,

        fill: false,
      },
    ],
  };

  const topDestData = {

    labels:
      topDestinations.map(
        (i) =>
          i.destination || ""
      ),

    datasets: [
      {
        label: "Bookings",

        data:
          topDestinations.map(
            (i) =>
              i.count || 0
          ),

        backgroundColor:
          "#0ea5e9",

        borderRadius: 12,
      },
    ],
  };

  /* ================================================= */
  /* ================= RETURN ======================== */
  /* ================================================= */

  return (

    <AdminLayout
      search={search}
      setSearch={setSearch}
    >

      {loading ? (

        <div className="text-center py-20 text-gray-500 text-lg">

          Loading dashboard...

        </div>

      ) : (

        <>

          {/* ================================================= */}
          {/* ================= STATS ========================= */}
          {/* ================================================= */}

          <div className="grid md:grid-cols-2 xl:grid-cols-6 gap-6 mb-8">

            <StatCard
              title="Total Bookings"
              value={stats.total}
              icon={
                <FaSuitcaseRolling className="text-blue-600 text-2xl" />
              }
              bgColor="bg-blue-50"
              textColor="text-gray-900"
            />

            <StatCard
              title="Paid Bookings"
              value={stats.paid}
              icon={
                <FaCheckCircle className="text-green-600 text-2xl" />
              }
              bgColor="bg-green-50"
              textColor="text-green-600"
            />

            <StatCard
              title="Pending"
              value={stats.pending}
              icon={
                <FaClock className="text-yellow-500 text-2xl" />
              }
              bgColor="bg-yellow-50"
              textColor="text-yellow-500"
            />

            <StatCard
              title="Payment Pending"
              value={stats.payment_pending}
              icon={
                <FaClock className="text-sky-600 text-2xl" />
              }
              bgColor="bg-sky-50"
              textColor="text-sky-600"
            />

            <StatCard
              title="Total Revenue"
              value={`Rs. ${stats.revenue}`}
              icon={
                <FaMoneyBillWave className="text-cyan-600 text-2xl" />
              }
              bgColor="bg-cyan-50"
              textColor="text-cyan-600"
            />

            <StatCard
              title="Total Clients"
              value={stats.clients}
              icon={
                <FaUsers className="text-indigo-600 text-2xl" />
              }
              bgColor="bg-indigo-50"
              textColor="text-indigo-600"
            />

          </div>

          {/* ================================================= */}
          {/* ================= MAIN CHARTS ================== */}
          {/* ================================================= */}

          <div className="grid lg:grid-cols-2 gap-6 mb-8">

            <RevenueChart
              revenueData={
                revenueData
              }
            />

            <StatusChart
              statusData={
                statusData
              }
            />

          </div>

          {/* ================================================= */}
          {/* ================= REVENUE TREND ================ */}
          {/* ================================================= */}

          <RevenueTrendChart
            lineData={lineData}
          />

          {/* ================================================= */}
          {/* ================= DESTINATIONS ================= */}
          {/* ================================================= */}

          <DestinationChart
            topDestData={
              topDestData
            }
          />

          <div className="grid md:grid-cols-4 gap-5 mb-8">

            {[
              ["Pending Requests", stats.pending || 0, "text-yellow-600", "bg-yellow-50"],
              ["Approved Bookings", stats.approved || 0, "text-blue-600", "bg-blue-50"],
              ["Rejected Requests", bookings.filter((b) => b.status === "rejected").length, "text-red-600", "bg-red-50"],
              ["Payment Pending", stats.payment_pending || 0, "text-sky-600", "bg-sky-50"],
            ].map(([title, value, text, bg]) => (

              <div
                key={title}
                className={`${bg} border border-white rounded-2xl p-5`}
              >

                <p className="text-gray-600 text-sm">
                  {title}
                </p>

                <h3 className={`text-3xl font-bold mt-2 ${text}`}>
                  {value}
                </h3>

              </div>

            ))}

          </div>

          <div className="grid lg:grid-cols-[1fr_420px] gap-6 mb-8">

            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-lg">

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    Advanced Operations Analytics
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Conversion, retention, and destination performance
                  </p>

                </div>

                <div className="bg-blue-50 text-blue-700 rounded-2xl px-5 py-3 font-bold">
                  {advancedAnalytics.retention_rate || 0}% retention
                </div>

              </div>

              <div className="grid md:grid-cols-3 gap-4">

                {(advancedAnalytics.destinations || []).slice(0, 3).map((item) => (

                  <div
                    key={item.destination}
                    className="bg-[#f8fbff] rounded-2xl p-5"
                  >

                    <p className="text-gray-500 text-sm">
                      {item.destination}
                    </p>

                    <h3 className="text-2xl font-bold text-gray-900 mt-2">
                      {item.bookings}
                    </h3>

                    <p className="text-sm text-green-600 mt-1">
                      Rs. {item.revenue}
                    </p>

                  </div>

                ))}

              </div>

            </div>

            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-lg">

              <h2 className="text-2xl font-bold text-gray-900 mb-5">
                Recent Activity
              </h2>

              <div className="space-y-4 max-h-72 overflow-y-auto">

                {activityLogs.length === 0 && (
                  <p className="text-gray-500">
                    No activity logs yet
                  </p>
                )}

                {activityLogs.map((log, index) => (

                  <div
                    key={`${log.entity_id}-${index}`}
                    className="border border-gray-100 rounded-2xl p-4"
                  >

                    <p className="font-semibold text-gray-800">
                      {log.action?.replaceAll("_", " ")}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {log.entity_type} {log.entity_id} by {log.actor}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* ================= BOOKINGS ===================== */}
          {/* ================================================= */}

          <BookingTable
            paginatedBookings={
              paginatedBookings
            }
            statusFilter={
              statusFilter
            }
            setStatusFilter={
              setStatusFilter
            }
            setPage={setPage}
            updateStatus={
              updateStatus
            }
            reviewBooking={
              reviewBooking
            }
            cancelBooking={
              cancelBooking
            }
            page={page}
            totalPages={
              totalPages
            }
          />

        </>

      )}

    </AdminLayout>

  );
}

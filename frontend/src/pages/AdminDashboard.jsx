import { fetchWithAuth } from "../utils/api";
import { useCallback, useEffect, useState } from "react";

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
    pending: 0,
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

      const statsRes =
        await fetchWithAuth(
          "/admin/stats"
        );

      setStats(await statsRes.json());

      /* BOOKINGS */

      const bookingsRes =
        await fetchWithAuth(
          "/get-bookings"
        );

      const bookingsData =
        await bookingsRes.json();

      setBookings(
        bookingsData.bookings || []
      );

      /* REVENUE TREND */

      const trendRes =
        await fetchWithAuth(
          "/admin/revenue-by-date"
        );

      const trendData =
        await trendRes.json();

      setRevenueTrend(
        trendData.data || []
      );

      /* TOP DESTINATIONS */

      const topRes =
        await fetchWithAuth(
          "/admin/top-destinations"
        );

      const topData =
        await topRes.json();

      setTopDestinations(
        topData.data || []
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

      await fetchWithAuth(
        "/admin/update-status",
        {
          method: "POST",

          body: JSON.stringify({
            booking_id,
            status,
          }),
        }
      );

      fetchData();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to update status"
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

      await fetchWithAuth(
        "/admin/cancel-booking",
        {
          method: "POST",

          body: JSON.stringify({
            booking_id,
          }),
        }
      );

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
      "Pending",
    ],

    datasets: [
      {
        data: [
          stats.paid || 0,
          stats.pending || 0,
        ],

        backgroundColor: [
          "#22c55e",
          "#facc15",
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

          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">

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
              title="Total Revenue"
              value={`₹ ${stats.revenue}`}
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
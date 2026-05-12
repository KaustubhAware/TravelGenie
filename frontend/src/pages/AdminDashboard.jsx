import { fetchWithAuth } from "../utils/api";
import { useCallback, useEffect, useState } from "react";

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

import { Bar, Pie, Line } from "react-chartjs-2";

import {
  FaChartBar,
  FaSuitcaseRolling,
  FaMoneyBillWave,
  FaClock,
  FaSearch,
  FaSignOutAlt,
  FaMapMarkedAlt,
  FaCheckCircle,
  FaTimesCircle,
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

/* ================= API ================= */

const API = "http://127.0.0.1:8000/api";

export default function AdminDashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    revenue: 0,
  });

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [revenueTrend, setRevenueTrend] = useState([]);

  const [topDestinations, setTopDestinations] = useState([]);

  const [page, setPage] = useState(1);

  const itemsPerPage = 5;

  const [statusFilter, setStatusFilter] = useState("all");

  /* ================= LOGOUT ================= */

  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/admin/login";

  };

  /* ================= FETCH DATA ================= */

  const fetchData = useCallback(async () => {

    try {

      setLoading(true);

      const statsRes = await fetchWithAuth("/admin/stats");

      setStats(await statsRes.json());

      const bookingsRes = await fetchWithAuth("/get-bookings");

      const bookingsData = await bookingsRes.json();

      setBookings(bookingsData.bookings || []);

      const trendRes = await fetchWithAuth("/admin/revenue-by-date");

      const trendData = await trendRes.json();

      setRevenueTrend(trendData.data || []);

      const topRes = await fetchWithAuth("/admin/top-destinations");

      const topData = await topRes.json();

      setTopDestinations(topData.data || []);

    } catch (err) {

      console.error(err);

      alert("Failed to load dashboard");

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {

    fetchData();

  }, [fetchData]);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (booking_id, status) => {

    try {

      await fetchWithAuth("/admin/update-status", {
        method: "POST",
        body: JSON.stringify({
          booking_id,
          status,
        }),
      });

      fetchData();

    } catch (err) {

      console.error(err);

      alert("Failed to update status");

    }

  };

  /* ================= CANCEL ================= */

  const cancelBooking = async (booking_id) => {

    const confirmDelete = window.confirm(
      "Cancel this booking?"
    );

    if (!confirmDelete) return;

    try {

      await fetchWithAuth("/admin/cancel-booking", {
        method: "POST",
        body: JSON.stringify({
          booking_id,
        }),
      });

      fetchData();

    } catch (err) {

      console.error(err);

      alert("Failed to cancel booking");

    }

  };

  /* ================= FILTER ================= */

  const filteredBookings = bookings
    .filter((b) =>
      statusFilter === "all"
        ? true
        : b.status === statusFilter
    )
    .filter((b) =>
      `${b.destination} ${b.name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(
    filteredBookings.length / itemsPerPage
  );

  const paginatedBookings = filteredBookings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  /* ================= CHARTS ================= */

  const revenueData = {
    labels: ["Revenue"],
    datasets: [
      {
        data: [stats.revenue || 0],
        backgroundColor: "#2563eb",
        borderRadius: 12,
      },
    ],
  };

  const statusData = {
    labels: ["Paid", "Pending"],
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
        label: "Revenue Trend",
        data: revenueTrend.map(
          (i) => i.revenue || 0
        ),
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        tension: 0.4,
      },
    ],
  };

  const topDestData = {
    labels: topDestinations.map(
      (i) => i.destination || ""
    ),

    datasets: [
      {
        data: topDestinations.map(
          (i) => i.count || 0
        ),
        backgroundColor: "#0ea5e9",
        borderRadius: 10,
      },
    ],
  };

  return (

    <div className="min-h-screen bg-[#f5f9ff] flex">

      {/* ================================================= */}
      {/* ================= SIDEBAR ======================= */}
      {/* ================================================= */}

      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 min-h-screen transition-all duration-300 flex flex-col shadow-sm`}
      >

        {/* LOGO */}

        <div className="p-5 border-b border-gray-100">

          <button
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl font-semibold"
          >

            {sidebarOpen
              ? "TravelGenie Admin"
              : "TG"}

          </button>

        </div>

        {/* MENU */}

        <div className="p-5 flex-1">

          <div className="space-y-4">

            <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-2xl font-medium">

              <FaChartBar />

              {sidebarOpen && "Dashboard"}

            </div>

            <div className="flex items-center gap-3 text-gray-600 px-4 py-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition">

              <FaSuitcaseRolling />

              {sidebarOpen && "Bookings"}

            </div>

            <div className="flex items-center gap-3 text-gray-600 px-4 py-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition">

              <FaMoneyBillWave />

              {sidebarOpen && "Analytics"}

            </div>

          </div>

        </div>

        {/* LOGOUT */}

        <div className="p-5 border-t border-gray-100">

          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl flex items-center justify-center gap-3 transition"
          >

            <FaSignOutAlt />

            {sidebarOpen && "Logout"}

          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* ================= MAIN CONTENT ================== */}
      {/* ================================================= */}
<div className="flex-1 overflow-y-auto">
     <div className="px-8 pt-8">

  <div className="flex items-center justify-between mb-8">

    <div>

      <h1 className="text-3xl font-bold text-gray-900">
        Admin Panel
      </h1>

      <p className="text-gray-500 mt-1">
        Monitor bookings and revenue
      </p>

    </div>

    <div className="relative w-[320px]">

      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        placeholder="Search bookings..."
        value={search}
        onChange={(e) => {

          setSearch(e.target.value);

          setPage(1);

        }}
        className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

    </div>

  </div>

</div>

        {/* CONTENT */}

      <div className="px-8 pb-8">

          {/* LOADING */}

          {loading && (

            <div className="text-center py-20 text-gray-500">

              Loading dashboard...

            </div>

          )}

          {/* ================================================= */}
          {/* ================= STATS ========================= */}
          {/* ================================================= */}

          {!loading && (

            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                {/* TOTAL */}

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-gray-500 text-sm">
                        Total Bookings
                      </p>

                      <h2 className="text-4xl font-bold text-gray-900 mt-3">

                        {stats.total}

                      </h2>

                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">

                      <FaSuitcaseRolling className="text-blue-600 text-xl" />

                    </div>

                  </div>

                </div>

                {/* PAID */}

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-gray-500 text-sm">
                        Paid Bookings
                      </p>

                      <h2 className="text-4xl font-bold text-green-600 mt-3">

                        {stats.paid}

                      </h2>

                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">

                      <FaCheckCircle className="text-green-600 text-xl" />

                    </div>

                  </div>

                </div>

                {/* PENDING */}

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-gray-500 text-sm">
                        Pending
                      </p>

                      <h2 className="text-4xl font-bold text-yellow-500 mt-3">

                        {stats.pending}

                      </h2>

                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center">

                      <FaClock className="text-yellow-500 text-xl" />

                    </div>

                  </div>

                </div>

                {/* REVENUE */}

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-gray-500 text-sm">
                        Total Revenue
                      </p>

                      <h2 className="text-4xl font-bold text-cyan-600 mt-3">

                        ₹ {stats.revenue}

                      </h2>

                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">

                      <FaMoneyBillWave className="text-cyan-600 text-xl" />

                    </div>

                  </div>

                </div>

              </div>

              {/* ================================================= */}
              {/* ================= CHARTS ======================= */}
              {/* ================================================= */}

              <div className="grid lg:grid-cols-2 gap-6 mb-8">

                {/* REVENUE */}

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

                  <h2 className="text-xl font-semibold text-gray-900 mb-5">

                    Revenue Overview

                  </h2>

                  <Bar data={revenueData} />

                </div>

                {/* STATUS */}

                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

                  <h2 className="text-xl font-semibold text-gray-900 mb-5">

                    Booking Status

                  </h2>

                  <div className="w-[250px] mx-auto">

                    <Pie data={statusData} />

                  </div>

                </div>

              </div>

              {/* LINE */}

              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm mb-8">

                <h2 className="text-xl font-semibold text-gray-900 mb-5">

                  Revenue Trend

                </h2>

                <Line data={lineData} />

              </div>

              {/* DESTINATIONS */}

              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm mb-8">

                <h2 className="text-xl font-semibold text-gray-900 mb-5">

                  Top Destinations

                </h2>

                <Bar data={topDestData} />

              </div>

              {/* ================================================= */}
              {/* ================= BOOKINGS ===================== */}
              {/* ================================================= */}

              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">

                {/* TOP */}

                <div className="flex flex-wrap gap-4 justify-between mb-6">

                  <div>

                    <h2 className="text-2xl font-bold text-gray-900">

                      Booking Management

                    </h2>

                    <p className="text-gray-500 mt-1">
                      Manage and monitor all bookings
                    </p>

                  </div>

                  {/* FILTER */}

                  <select
                    value={statusFilter}
                    onChange={(e) => {

                      setStatusFilter(
                        e.target.value
                      );

                      setPage(1);

                    }}
                    className="border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50 outline-none"
                  >

                    <option value="all">
                      All Status
                    </option>

                    <option value="paid">
                      Paid
                    </option>

                    <option value="pending">
                      Pending
                    </option>

                  </select>

                </div>

                {/* TABLE */}

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead>

                      <tr className="border-b border-gray-200 text-left">

                        <th className="py-4 text-gray-600">
                          Destination
                        </th>

                        <th className="py-4 text-gray-600">
                          Customer
                        </th>

                        <th className="py-4 text-gray-600">
                          Status
                        </th>

                        <th className="py-4 text-gray-600">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {paginatedBookings.map((b) => (

                        <tr
                          key={b.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >

                          <td className="py-5">

                            <div className="flex items-center gap-3">

                              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                                <FaMapMarkedAlt className="text-blue-600" />

                              </div>

                              <span className="font-medium text-gray-800">

                                {b.destination}

                              </span>

                            </div>

                          </td>

                          <td className="py-5 text-gray-700">

                            {b.name}

                          </td>

                          <td className="py-5">

                            <span
                              className={`px-4 py-2 rounded-full text-sm font-medium ${
                                b.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >

                              {b.status}

                            </span>

                          </td>

                          <td className="py-5">

                            <div className="flex gap-3">

                              <button
                                onClick={() =>
                                  updateStatus(
                                    b.booking_id,
                                    "paid"
                                  )
                                }
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition"
                              >

                                Paid

                              </button>

                              <button
                                onClick={() =>
                                  cancelBooking(
                                    b.booking_id
                                  )
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                              >

                                Cancel

                              </button>

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

                {/* PAGINATION */}

                <div className="flex justify-center gap-3 mt-8">

                  <button
                    onClick={() =>
                      setPage(page - 1)
                    }
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-100 rounded-xl disabled:opacity-50"
                  >

                    Prev

                  </button>

                  {[...Array(totalPages)].map(
                    (_, i) => (

                      <button
                        key={i}
                        onClick={() =>
                          setPage(i + 1)
                        }
                        className={`px-4 py-2 rounded-xl ${
                          page === i + 1
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >

                        {i + 1}

                      </button>

                    )
                  )}

                  <button
                    onClick={() =>
                      setPage(page + 1)
                    }
                    disabled={
                      page === totalPages
                    }
                    className="px-4 py-2 bg-gray-100 rounded-xl disabled:opacity-50"
                  >

                    Next

                  </button>

                </div>

              </div>

            </>

          )}

        </div>

      </div>

    </div>

  );
}
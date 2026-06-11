import {
  useCallback,
  useMemo,
  useState,
} from "react";

import { useOutletContext } from "react-router-dom";

import {
  FaSuitcaseRolling,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

import StatCard from "../../components/ui/StatCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import BookingTable from "../../components/admin/BookingTable";

import { analyticsService } from "../../services/analyticsService";

import { bookingService } from "../../services/bookingService";

import DestinationChart from "../../components/admin/charts/DestinationChart";

import RevenueChart from "../../components/admin/charts/RevenueChart";

import RevenueTrendChart from "../../components/admin/charts/RevenueTrendChart";

import StatusChart from "../../components/admin/charts/StatusChart";

import {
  generateDashboardAnalytics,
} from "../../utils/adminAnalytics";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";

/* ===================================================== */
/* ADMIN DASHBOARD */
/* ===================================================== */

export default function AdminDashboard() {

  const [stats, setStats] =
    useState({
      total: 0,
      paid: 0,
      approved: 0,
      pending: 0,
      revenue: 0,
      clients: 0,
      payment_pending: 0,
    });

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const outletContext = useOutletContext() || {};
  const search = outletContext.search ?? "";
  const setSearch = outletContext.setSearch ?? (() => {});

  const [page, setPage] =
    useState(1);

  const [statusFilter, setStatusFilter] =
    useState("all");

  const itemsPerPage = 5;

  /* ===================================================== */
  /* FETCH DATA */
  /* ===================================================== */

  const fetchData =
    useCallback(async (options = {}) => {

      const { silent = false } = options;

      try {

        setError("");

        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const [statsData, bookingsData] =
          await Promise.all([
            analyticsService.getStats(),
            bookingService.getAdminBookings(),
          ]);

        setStats(statsData);
        setBookings(bookingsData.bookings || []);

      } catch (error) {

        console.error(
          "Dashboard Error:",
          error
        );
        setError(
          error?.message ||
          "Failed to load dashboard data."
        );

      } finally {

        if (silent) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }

      }

    }, []);

  useAutoRefresh(
    ({ silent = false } = {}) => fetchData({ silent }),
    {
      intervalMs: 30000,
      immediate: true,
    }
  );

  /* ===================================================== */
  /* REAL ANALYTICS */
  /* ===================================================== */

  const analytics =
    useMemo(() => {

      return generateDashboardAnalytics(
        bookings
      );

    }, [bookings]);

  /* ===================================================== */
  /* UPDATE STATUS */
  /* ===================================================== */

  const updateStatus =
    async (
      booking_id,
      status
    ) => {

      try {

        await bookingService.updateStatus(
          booking_id,
          status
        );

        fetchData({ silent: true });

      } catch (error) {

        console.error(error);

      }

    };

  /* ===================================================== */
  /* REVIEW BOOKING */
  /* ===================================================== */

  const reviewBooking =
    async (payload) => {

      try {

        await bookingService.reviewBooking(
          payload
        );

        fetchData({ silent: true });

      } catch (error) {

        console.error(error);

      }

    };

  /* ===================================================== */
  /* CANCEL BOOKING */
  /* ===================================================== */

  const cancelBooking =
    async (booking_id) => {

      const confirmDelete =
        window.confirm(
          "Cancel this booking?"
        );

      if (!confirmDelete) return;

      try {

        await bookingService.cancelBooking(
          booking_id
        );

        fetchData({ silent: true });

      } catch (error) {

        console.error(error);

      }

    };

  /* ===================================================== */
  /* FILTER BOOKINGS */
  /* ===================================================== */

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

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredBookings.length /
        itemsPerPage
      )
    );

  const paginatedBookings =
    filteredBookings.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  /* ===================================================== */
  /* PAGE */
  /* ===================================================== */

  return (

    <div className="space-y-8 relative">
      {refreshing && (
        <div className="absolute right-0 top-0 z-10 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
          Refreshing analytics...
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Overview
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Operations Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Live booking, revenue, and destination analytics.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">
            Pending: {analytics.pendingBookings}
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
            Paid: {analytics.paidBookings}
          </span>
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Bookings"
          value={analytics.totalBookings}
          icon={
            <FaSuitcaseRolling className="text-orange-500 text-2xl" />
          }
          bgColor="bg-orange-50"
          textColor="text-slate-900"
        />

        <StatCard
          title="Revenue"
          value={`Rs. ${analytics.paidRevenue.toLocaleString("en-IN")}`}
          icon={
            <FaMoneyBillWave className="text-green-600 text-2xl" />
          }
          bgColor="bg-green-50"
          textColor="text-green-600"
        />

        <StatCard
          title="Completed"
          value={analytics.completedBookings}
          icon={
            <FaCheckCircle className="text-orange-600 text-2xl" />
          }
          bgColor="bg-orange-50"
          textColor="text-orange-600"
        />

        <StatCard
          title="Customers"
          value={stats.clients}
          icon={
            <FaUsers className="text-orange-600 text-2xl" />
          }
          bgColor="bg-orange-50"
          textColor="text-orange-600"
        />

      </div>

      {/* ===================================================== */}
      {/* CHART ROW 1 */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* REVENUE TREND */}

        <div className="xl:col-span-2 h-full">

          <RevenueTrendChart
            lineData={
              analytics.revenueTrendData
            }
          />

        </div>

        {/* STATUS */}

        <div className="h-full">

          <StatusChart
            statusData={
              analytics.statusData
            }
          />

        </div>

      </div>

      {/* ===================================================== */}
      {/* CHART ROW 2 */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <RevenueChart
          revenueData={
            analytics.revenueTrendData
          }
        />

        <DestinationChart
          topDestData={
            analytics.destinationData
          }
        />

      </div>

      {/* ===================================================== */}
      {/* BOOKINGS */}
      {/* ===================================================== */}

      <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">

        {/* HEADER */}

        <div className="border-b border-slate-200 px-8 py-7">

          <h2 className="text-2xl font-black text-slate-900">

            Recent Bookings

          </h2>

          <p className="mt-2 text-sm text-slate-500">

            Track booking requests, approvals,
            payments, and customer workflows.

          </p>

        </div>

        {/* TABLE */}

        <div className="p-0">

          <BookingTable
            paginatedBookings={paginatedBookings}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            setPage={setPage}
            updateStatus={updateStatus}
            reviewBooking={reviewBooking}
            cancelBooking={cancelBooking}
            page={page}
            totalPages={totalPages}
          />

        </div>

      </div>

    </div>

  );

}

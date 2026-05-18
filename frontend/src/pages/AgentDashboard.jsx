import {
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminLayout from "../layouts/AdminLayout";
import BookingTable from "../components/admin/BookingTable";
import { bookingService } from "../services/bookingService";

import {
  FaClipboardCheck,
  FaClock,
  FaRoute,
  FaUserTie,
} from "react-icons/fa";

export default function AgentDashboard() {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [page, setPage] =
    useState(1);

  const itemsPerPage = 8;

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data =
        await bookingService.getAdminBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load agent workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const assignedBookings = useMemo(() =>
    bookings.filter((booking) =>
      booking.assigned_agent ||
      ["under_review", "payment_pending", "paid"].includes(booking.status)
    ),
  [bookings]);

  const filteredBookings =
    assignedBookings
      .filter((booking) =>
        statusFilter === "all"
          ? true
          : booking.status === statusFilter
      )
      .filter((booking) =>
        `${booking.destination} ${booking.name} ${booking.assigned_agent || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / itemsPerPage)
  );

  const paginatedBookings =
    filteredBookings.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );

  const reviewBooking = async (payload) => {
    try {
      await bookingService.reviewBooking(payload);
      loadBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to update booking");
    }
  };

  const updateStatus = async (
    booking_id,
    status
  ) => {
    try {
      await bookingService.updateStatus(
        booking_id,
        status
      );
      loadBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <AdminLayout
      search={search}
      setSearch={setSearch}
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Agent Workspace
        </h1>
        <p className="text-gray-500 mt-2">
          Manage assigned requests, itinerary notes, and trip operations
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <AgentStat
          title="Assigned"
          value={assignedBookings.length}
          icon={<FaUserTie />}
        />
        <AgentStat
          title="Under Review"
          value={assignedBookings.filter((b) => b.status === "under_review").length}
          icon={<FaClock />}
        />
        <AgentStat
          title="Payment Pending"
          value={assignedBookings.filter((b) => b.status === "payment_pending").length}
          icon={<FaClipboardCheck />}
        />
        <AgentStat
          title="Trips Active"
          value={assignedBookings.filter((b) => b.status === "paid").length}
          icon={<FaRoute />}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">
          Loading agent bookings...
        </div>
      ) : (
        <BookingTable
          paginatedBookings={paginatedBookings}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setPage={setPage}
          updateStatus={updateStatus}
          reviewBooking={reviewBooking}
          page={page}
          totalPages={totalPages}
        />
      )}
    </AdminLayout>
  );
}

function AgentStat({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </h2>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}

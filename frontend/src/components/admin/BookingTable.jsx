import {
  Fragment,
  memo,
  useState,
} from "react";

import {
  FaMapMarkedAlt,
  FaCheck,
  FaTimes,
  FaCreditCard,
  FaClipboardList,
  FaFlagCheckered,
} from "react-icons/fa";

/* ===================================================== */
/* STATUS STYLES */
/* ===================================================== */

const statusStyles = {
  pending:
    "bg-yellow-100 text-yellow-700 border border-yellow-200",

  approved:
    "bg-blue-100 text-blue-700 border border-blue-200",

  under_review:
    "bg-indigo-100 text-indigo-700 border border-indigo-200",

  rejected:
    "bg-red-100 text-red-700 border border-red-200",

  cancelled:
    "bg-gray-100 text-gray-700 border border-gray-200",

  paid:
    "bg-green-100 text-green-700 border border-green-200",

  payment_pending:
    "bg-orange-100 text-orange-700 border border-orange-200",

  completed:
    "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

function BookingTable({

  paginatedBookings = [],

  statusFilter = "all",

  setStatusFilter = () => {},

  setPage = () => {},

  updateStatus = () => {},

  reviewBooking = () => {},

  cancelBooking = () => {},

  page = 1,

  totalPages = 1,

}) {

  const [reviewOpen, setReviewOpen] =
    useState(null);

  const [reviewForm, setReviewForm] =
    useState({
      internal_notes: "",
      assigned_agent: "",
      adjusted_price: "",
    });

  const [actionMenu, setActionMenu] =
    useState(null);

  /* ===================================================== */
  /* OPEN REVIEW */
  /* ===================================================== */

  const openReview = (booking) => {

    setReviewOpen(
      booking.booking_id
    );

    setReviewForm({

      internal_notes:
        booking.internal_notes || "",

      assigned_agent:
        booking.assigned_agent || "",

      adjusted_price:
        booking.total_cost ||
        booking.budget ||
        "",

    });

  };

  /* ===================================================== */
  /* SUBMIT REVIEW */
  /* ===================================================== */

  const submitReview = (
    booking,
    decision
  ) => {

    reviewBooking({

      booking_id:
        booking.booking_id,

      decision,

      internal_notes:
        reviewForm.internal_notes,

      assigned_agent:
        reviewForm.assigned_agent,

      adjusted_price:
        reviewForm.adjusted_price
          ? Number(
              reviewForm.adjusted_price
            )
          : null,

    });

    setReviewOpen(null);

  };

  return (

    <div className="bg-white border border-slate-200 rounded-[26px] shadow-sm overflow-hidden">

      {/* HEADER */}

      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <p className="text-[11px] uppercase tracking-[0.22em] text-blue-600 font-bold">

            Booking Operations

          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-1">

            Booking Management

          </h2>

          <p className="text-slate-500 mt-1 text-sm">

            Manage approvals, payments, and customer operations.

          </p>

        </div>

        <select
          value={statusFilter}
          onChange={(e) => {

            setStatusFilter(
              e.target.value
            );

            setPage(1);

          }}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
        >

          <option value="all">
            All Status
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="under_review">
            Under Review
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="payment_pending">
            Payment Pending
          </option>

          <option value="paid">
            Paid
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="cancelled">
            Cancelled
          </option>

          <option value="rejected">
            Rejected
          </option>

        </select>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-[1200px]">

          <thead className="bg-slate-50 border-b border-slate-200">

            <tr>

              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Destination
              </th>

              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Customer
              </th>

              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Budget
              </th>

              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Status
              </th>

              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {paginatedBookings.length === 0 && (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-20 text-slate-400"
                >

                  No bookings found

                </td>

              </tr>

            )}

            {paginatedBookings.map(
              (b, index) => (

                <Fragment
                  key={
                    b.id ||
                    b.booking_id ||
                    index
                  }
                >

                  <tr className="border-b border-slate-100 hover:bg-slate-50/70 transition">

                    {/* DESTINATION */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">

                          <FaMapMarkedAlt />

                        </div>

                        <div>

                          <h3 className="font-semibold text-slate-900">

                            {b.package_title ||
                              b.destination ||
                              "N/A"}

                          </h3>

                          <p className="text-xs text-slate-400 mt-1">

                            {b.booking_id}

                          </p>

                        </div>

                      </div>

                    </td>

                    {/* CUSTOMER */}

                    <td className="px-6 py-5">

                      <div>

                        <h3 className="font-semibold text-slate-800">

                          {b.name ||
                            "Unknown"}

                        </h3>

                        <p className="text-sm text-slate-400 mt-1">

                          {b.email ||
                            "No email"}

                        </p>

                      </div>

                    </td>

                    {/* BUDGET */}

                    <td className="px-6 py-5 font-semibold text-slate-800">

                      ₹
                      {b.total_cost ||
                        b.budget ||
                        0}

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          statusStyles[
                            b.status
                          ] ||
                          statusStyles.pending
                        }`}
                      >

                        {b.status?.replace(
                          "_",
                          " "
                        )}

                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5 min-w-[220px]">

                      <div className="relative flex items-center gap-2">

                        {/* REVIEW */}

                        <ActionButton
                          label="Review"
                          icon={<FaClipboardList />}
                          className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                          onClick={() =>
                            openReview(b)
                          }
                          disabled={[
                            "paid",
                            "cancelled",
                            "completed",
                          ].includes(b.status)}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setActionMenu(
                              actionMenu === b.booking_id
                                ? null
                                : b.booking_id
                            )
                          }
                          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          More
                        </button>

                        {actionMenu === b.booking_id && (
                          <div className="absolute right-0 top-11 z-30 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                            <MenuAction
                              icon={<FaCheck />}
                              label="Approve"
                              disabled={["approved", "paid", "completed"].includes(b.status)}
                              onClick={() => {
                                updateStatus(b.booking_id, "approved");
                                setActionMenu(null);
                              }}
                            />
                            <MenuAction
                              icon={<FaCreditCard />}
                              label="Request Payment"
                              disabled={b.status !== "approved"}
                              onClick={() => {
                                updateStatus(b.booking_id, "payment_pending");
                                setActionMenu(null);
                              }}
                            />
                            <MenuAction
                              icon={<FaCreditCard />}
                              label="Mark Paid"
                              disabled={!["payment_pending", "approved"].includes(b.status)}
                              onClick={() => {
                                updateStatus(b.booking_id, "paid");
                                setActionMenu(null);
                              }}
                            />
                            <MenuAction
                              icon={<FaFlagCheckered />}
                              label="Complete Trip"
                              disabled={b.status !== "paid"}
                              onClick={() => {
                                updateStatus(b.booking_id, "completed");
                                setActionMenu(null);
                              }}
                            />
                            <MenuAction
                              icon={<FaTimes />}
                              label="Reject"
                              danger
                              disabled={["rejected", "paid", "completed"].includes(b.status)}
                              onClick={() => {
                                updateStatus(b.booking_id, "rejected");
                                setActionMenu(null);
                              }}
                            />
                            <MenuAction
                              icon={<FaTimes />}
                              label="Cancel"
                              danger
                              disabled={["cancelled", "paid", "completed"].includes(b.status)}
                              onClick={() => {
                                cancelBooking(b.booking_id);
                                setActionMenu(null);
                              }}
                            />
                          </div>
                        )}

                      </div>

                    </td>

                  </tr>

                  {reviewOpen === b.booking_id && (

                    <tr className="border-b border-slate-100 bg-slate-50">

                      <td colSpan="5" className="px-6 py-5">

                        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-[1fr_1fr_180px_auto]">

                          <textarea
                            rows={3}
                            placeholder="Internal notes"
                            value={reviewForm.internal_notes}
                            onChange={(e) =>
                              setReviewForm({
                                ...reviewForm,
                                internal_notes: e.target.value,
                              })
                            }
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 md:col-span-2"
                          />

                          <input
                            placeholder="Assigned agent"
                            value={reviewForm.assigned_agent}
                            onChange={(e) =>
                              setReviewForm({
                                ...reviewForm,
                                assigned_agent: e.target.value,
                              })
                            }
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                          />

                          <input
                            type="number"
                            min="0"
                            placeholder="Adjusted price"
                            value={reviewForm.adjusted_price}
                            onChange={(e) =>
                              setReviewForm({
                                ...reviewForm,
                                adjusted_price: e.target.value,
                              })
                            }
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                          />

                          <div className="flex flex-wrap gap-2 md:col-span-4">

                            <ActionButton
                              label="Mark Review"
                              icon={<FaClipboardList />}
                              className="bg-indigo-600 text-white hover:bg-indigo-700"
                              onClick={() =>
                                submitReview(b, "under_review")
                              }
                            />

                            <ActionButton
                              label="Approve Payment"
                              icon={<FaCheck />}
                              className="bg-blue-600 text-white hover:bg-blue-700"
                              onClick={() =>
                                submitReview(b, "approve")
                              }
                            />

                            <ActionButton
                              label="Reject"
                              icon={<FaTimes />}
                              className="bg-red-500 text-white hover:bg-red-600"
                              onClick={() =>
                                submitReview(b, "reject")
                              }
                            />

                            <ActionButton
                              label="Close"
                              icon={<FaTimes />}
                              className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                              onClick={() =>
                                setReviewOpen(null)
                              }
                            />

                          </div>

                        </div>

                      </td>

                    </tr>

                  )}

                </Fragment>

              )
            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      <div className="flex items-center justify-between p-6 border-t border-slate-200">

        <p className="text-sm text-slate-500">

          Page {page} of {totalPages}

        </p>

        <div className="flex items-center gap-2">

          <button
            onClick={() =>
              setPage(page - 1)
            }
            disabled={page === 1}
            className="h-10 px-4 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 disabled:opacity-40"
          >

            Previous

          </button>

          <button
            onClick={() =>
              setPage(page + 1)
            }
            disabled={
              page === totalPages
            }
            className="h-10 px-4 rounded-xl bg-blue-600 text-sm font-semibold text-white disabled:opacity-40"
          >

            Next

          </button>

        </div>

      </div>

    </div>

  );

}

/* ACTION BUTTON */

function ActionButton({
  label,
  icon,
  className,
  onClick,
  disabled = false,
}) {

  return (

    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-9 px-3 rounded-lg text-xs font-semibold transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >

      {icon}

      {label}

    </button>

  );

}

function MenuAction({
  icon,
  label,
  onClick,
  disabled = false,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      <span className="text-sm">{icon}</span>
      {label}
    </button>
  );
}

export default memo(
  BookingTable
);

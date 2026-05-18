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
} from "react-icons/fa";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  under_review: "bg-indigo-100 text-indigo-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-700",
  paid: "bg-green-100 text-green-700",
  payment_pending: "bg-sky-100 text-sky-700",
  completed: "bg-emerald-100 text-emerald-700",
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

  const openReview = (booking) => {

    setReviewOpen(booking.booking_id);

    setReviewForm({
      internal_notes:
        booking.internal_notes || "",
      assigned_agent:
        booking.assigned_agent || "",
      adjusted_price:
        booking.total_cost || booking.budget || "",
    });

  };

  const submitReview = (booking, decision) => {

    reviewBooking({
      booking_id: booking.booking_id,
      decision,
      internal_notes:
        reviewForm.internal_notes,
      assigned_agent:
        reviewForm.assigned_agent,
      adjusted_price:
        reviewForm.adjusted_price
          ? Number(reviewForm.adjusted_price)
          : null,
    });

    setReviewOpen(null);

  };

  return (

    <div className="bg-white rounded-[28px] p-6 shadow-lg border border-gray-100">

      {/* =====================================================
          TOP
      ===================================================== */}

      <div className="flex flex-wrap gap-4 justify-between mb-8">

        <div>

          <h2 className="text-2xl font-bold text-gray-900">

            Booking Management

          </h2>

          <p className="text-gray-500 mt-1">

            Manage and monitor all bookings

          </p>

        </div>

        {/* =====================================================
            FILTER
        ===================================================== */}

        <select
          value={statusFilter}
          onChange={(e) => {

            setStatusFilter(e.target.value);

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

          <option value="approved">

            Approved

          </option>

          <option value="payment_pending">

            Payment Pending

          </option>

          <option value="under_review">

            Under Review

          </option>

          <option value="pending">

            Pending

          </option>

          <option value="rejected">

            Rejected

          </option>

          <option value="cancelled">

            Cancelled

          </option>

        </select>

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="overflow-x-auto">

        <table className="w-full border-separate border-spacing-y-3">

          {/* =====================================================
              TABLE HEADER
          ===================================================== */}

          <thead>

            <tr className="text-left">

              <th className="py-4 text-gray-500 font-semibold">

                Destination

              </th>

              <th className="py-4 text-gray-500 font-semibold">

                Customer

              </th>

              <th className="py-4 text-gray-500 font-semibold">

                Status

              </th>

              <th className="py-4 text-gray-500 font-semibold">

                Actions

              </th>

            </tr>

          </thead>

          {/* =====================================================
              TABLE BODY
          ===================================================== */}

          <tbody>

            {/* EMPTY STATE */}

            {paginatedBookings.length === 0 && (

              <tr>

                <td
                  colSpan="4"
                  className="text-center py-14 text-gray-400"
                >

                  No bookings found

                </td>

              </tr>

            )}

            {/* BOOKINGS */}

            {paginatedBookings?.map((b, index) => (

              <Fragment key={b.id || b.booking_id || index}>

              <tr
                className="bg-[#f9fbff] hover:bg-blue-50 transition"
              >

                {/* DESTINATION */}

                <td className="py-5 px-4 rounded-l-2xl">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">

                      <FaMapMarkedAlt className="text-blue-600" />

                    </div>

                    <span className="font-semibold text-gray-800">

                      {b.destination || "N/A"}

                    </span>

                    <span className="text-xs text-gray-400">

                      {b.booking_id}

                    </span>

                  </div>

                </td>

                {/* CUSTOMER */}

                <td className="py-5 px-4 text-gray-700 font-medium">

                  {b.name || "Unknown"}

                </td>

                {/* STATUS */}

                <td className="py-5 px-4">

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      statusStyles[b.status] || statusStyles.pending
                    }`}
                  >

                    {b.status || "pending"}

                  </span>

                </td>

                {/* ACTIONS */}

                <td className="py-5 px-4 rounded-r-2xl">

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        openReview(b)
                      }
                      disabled={["paid", "cancelled", "completed"].includes(b.status)}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 shadow-md text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                    >

                      <FaClipboardList />

                      Review

                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          b.booking_id,
                          "rejected"
                        )
                      }
                      disabled={["rejected", "paid", "cancelled"].includes(b.status)}
                      className="bg-red-500 hover:bg-red-600 disabled:opacity-40 shadow-md text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                    >

                      <FaTimes />

                      Reject

                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          b.booking_id,
                          "paid"
                        )
                      }
                      disabled={!["approved", "payment_pending"].includes(b.status)}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-40 shadow-md text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                    >

                      <FaCreditCard />

                      Paid

                    </button>

                    <button
                      onClick={() =>
                        cancelBooking(
                          b.booking_id
                        )
                      }
                      disabled={["cancelled", "paid"].includes(b.status)}
                      className="bg-gray-700 hover:bg-gray-800 disabled:opacity-40 shadow-md text-white px-4 py-2 rounded-xl transition"
                    >

                      Cancel

                    </button>

                  </div>

                </td>

              </tr>

              {reviewOpen === b.booking_id && (

                <tr>

                  <td
                    colSpan="4"
                    className="bg-white border border-blue-100 rounded-2xl p-5"
                  >

                    <div className="grid md:grid-cols-3 gap-4">

                      <input
                        value={reviewForm.assigned_agent}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            assigned_agent:
                              e.target.value,
                          })
                        }
                        placeholder="Assigned agent"
                        className="border border-gray-200 rounded-xl px-4 py-3"
                      />

                      <input
                        type="number"
                        value={reviewForm.adjusted_price}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            adjusted_price:
                              e.target.value,
                          })
                        }
                        placeholder="Final package price"
                        className="border border-gray-200 rounded-xl px-4 py-3"
                      />

                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            submitReview(
                              b,
                              "approve"
                            )
                          }
                          className="flex-1 bg-green-600 text-white rounded-xl px-4 py-3 font-semibold"
                        >

                          Approve

                        </button>

                        <button
                          onClick={() =>
                            submitReview(
                              b,
                              "review"
                            )
                          }
                          className="flex-1 bg-indigo-600 text-white rounded-xl px-4 py-3 font-semibold"
                        >

                          Review

                        </button>

                      </div>

                    </div>

                    <textarea
                      value={reviewForm.internal_notes}
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          internal_notes:
                            e.target.value,
                        })
                      }
                      placeholder="Internal review notes for agency team"
                      rows="3"
                      className="w-full mt-4 border border-gray-200 rounded-xl px-4 py-3"
                    />

                  </td>

                </tr>

              )}

              </Fragment>

            ))}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      <div className="flex justify-center gap-3 mt-10">

        <button
          onClick={() =>
            setPage(page - 1)
          }
          disabled={page === 1}
          className="px-5 py-2 bg-gray-100 rounded-xl disabled:opacity-50"
        >

          Prev

        </button>

        {[...Array(totalPages)].map((_, i) => (

          <button
            key={i}
            onClick={() =>
              setPage(i + 1)
            }
            className={`px-5 py-2 rounded-xl ${
              page === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >

            {i + 1}

          </button>

        ))}

        <button
          onClick={() =>
            setPage(page + 1)
          }
          disabled={page === totalPages}
          className="px-5 py-2 bg-gray-100 rounded-xl disabled:opacity-50"
        >

          Next

        </button>

      </div>

    </div>
  );
}

export default memo(BookingTable);

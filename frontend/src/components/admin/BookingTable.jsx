import {
  FaMapMarkedAlt,
} from "react-icons/fa";

export default function BookingTable({
  paginatedBookings,
  statusFilter,
  setStatusFilter,
  setPage,
  updateStatus,
  cancelBooking,
  page,
  totalPages,
}) {

  return (

    <div className="bg-white rounded-[28px] p-6 shadow-lg border border-gray-100">

      {/* TOP */}

      <div className="flex flex-wrap gap-4 justify-between mb-8">

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

          <option value="pending">
            Pending
          </option>

        </select>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full border-separate border-spacing-y-3">

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

          <tbody>

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

            {paginatedBookings.map((b) => (

              <tr
                key={b.id}
                className="bg-[#f9fbff] hover:bg-blue-50 transition"
              >

                {/* DESTINATION */}

                <td className="py-5 px-4 rounded-l-2xl">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">

                      <FaMapMarkedAlt className="text-blue-600" />

                    </div>

                    <span className="font-semibold text-gray-800">

                      {b.destination}

                    </span>

                  </div>

                </td>

                {/* CUSTOMER */}

                <td className="py-5 px-4 text-gray-700 font-medium">

                  {b.name}

                </td>

                {/* STATUS */}

                <td className="py-5 px-4">

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

                {/* ACTIONS */}

                <td className="py-5 px-4 rounded-r-2xl">

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        updateStatus(
                          b.booking_id,
                          "paid"
                        )
                      }
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 shadow-md text-white px-4 py-2 rounded-xl transition"
                    >

                      Paid

                    </button>

                    <button
                      onClick={() =>
                        cancelBooking(
                          b.booking_id
                        )
                      }
                      className="bg-gradient-to-r from-red-500 to-rose-500 hover:opacity-90 shadow-md text-white px-4 py-2 rounded-xl transition"
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
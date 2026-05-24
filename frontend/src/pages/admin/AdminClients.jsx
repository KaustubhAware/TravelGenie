import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  fetchWithAuth,
} from "../../utils/api";

import {
  FaUsers,
  FaSearch,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaMoneyBillWave,
  FaSuitcaseRolling,
} from "react-icons/fa";

// =====================================================
// ADMIN CLIENTS
// =====================================================

export default function AdminClients() {

  /* ===================================================== */
  /* STATES */
  /* ===================================================== */

  const [clients, setClients] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  /* ===================================================== */
  /* FETCH CLIENTS */
  /* ===================================================== */

  const fetchClients =
    async () => {

      try {

        setLoading(true);

        // =====================================================
        // fetchWithAuth already returns JSON
        // =====================================================

        const data =
          await fetchWithAuth(
            "/admin/clients"
          );

        console.log(
          "CLIENT DATA:",
          data
        );

        setClients(
          data.clients || []
        );

      } catch (err) {

        console.error(
          "CLIENT FETCH ERROR:",
          err
        );

        setClients([]);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    fetchClients();

  }, []);

  /* ===================================================== */
  /* DELETE CLIENT */
  /* ===================================================== */

  const deleteClient =
    async (id) => {

      if (!id) {

        alert(
          "Client ID missing"
        );

        return;

      }

      const confirmDelete =
        window.confirm(
          "Delete this client?"
        );

      if (!confirmDelete) return;

      try {

        await fetchWithAuth(
          `/admin/clients/${id}`,
          {
            method: "DELETE",
          }
        );

        setClients((prev) =>
          prev.filter(
            (client) =>
              client.id !== id
          )
        );

      } catch (err) {

        console.error(
          "DELETE ERROR:",
          err
        );

        alert(
          "Failed to delete client"
        );

      }

    };

  /* ===================================================== */
  /* FILTERED CLIENTS */
  /* ===================================================== */

  const filteredClients =
    useMemo(() => {

      return clients.filter(
        (client) =>

          `${client.full_name || ""}
           ${client.email || ""}`

            .toLowerCase()

            .includes(
              search.toLowerCase()
            )
      );

    }, [clients, search]);

  /* ===================================================== */
  /* STATS */
  /* ===================================================== */

  const totalClients =
    clients.length;

  const totalRevenue =
    clients.reduce(
      (acc, client) =>

        acc +
        Number(
          client.total_spent || 0
        ),

      0
    );

  const totalBookings =
    clients.reduce(
      (acc, client) =>

        acc +
        Number(
          client.total_bookings || 0
        ),

      0
    );

  /* ===================================================== */
  /* LOADING */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="flex min-h-[320px] items-center justify-center">

        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />

      </div>

    );

  }

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <div className="space-y-8">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>

          <h1 className="text-4xl font-black text-slate-900">

            Client Management

          </h1>

          <p className="text-slate-500 mt-2 text-lg">

            Manage travelers,
            customers,
            and bookings.

          </p>

        </div>

        {/* SEARCH */}

        <div className="relative w-full lg:w-[360px]">

          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full h-14 rounded-2xl border border-slate-200 bg-white pl-14 pr-5 outline-none shadow-sm focus:border-indigo-500"
          />

        </div>

      </div>

      {/* ===================================================== */}
      {/* STATS */}
      {/* ===================================================== */}

      <div className="grid md:grid-cols-3 gap-6">

        {/* CLIENTS */}

        <div className="bg-white border border-slate-200 rounded-[30px] p-7 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-medium">

                Total Clients

              </p>

              <h2 className="text-5xl font-black text-slate-900 mt-3">

                {totalClients}

              </h2>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">

              <FaUsers className="text-indigo-600 text-2xl" />

            </div>

          </div>

        </div>

        {/* BOOKINGS */}

        <div className="bg-white border border-slate-200 rounded-[30px] p-7 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-medium">

                Total Bookings

              </p>

              <h2 className="text-5xl font-black text-slate-900 mt-3">

                {totalBookings}

              </h2>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center">

              <FaSuitcaseRolling className="text-cyan-600 text-2xl" />

            </div>

          </div>

        </div>

        {/* REVENUE */}

        <div className="bg-white border border-slate-200 rounded-[30px] p-7 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 font-medium">

                Total Revenue

              </p>

              <h2 className="text-5xl font-black text-slate-900 mt-3">

                ₹{totalRevenue}

              </h2>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">

              <FaMoneyBillWave className="text-green-600 text-2xl" />

            </div>

          </div>

        </div>

      </div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            {/* HEADER */}

            <thead className="bg-[#f8fafc] border-b border-slate-200">

              <tr>

                <th className="text-left px-6 py-5 font-bold text-slate-600">

                  Client

                </th>

                <th className="text-left px-6 py-5 font-bold text-slate-600">

                  Email

                </th>

                <th className="text-left px-6 py-5 font-bold text-slate-600">

                  Phone

                </th>

                <th className="text-left px-6 py-5 font-bold text-slate-600">

                  Bookings

                </th>

                <th className="text-left px-6 py-5 font-bold text-slate-600">

                  Total Spent

                </th>

                <th className="text-center px-6 py-5 font-bold text-slate-600">

                  Actions

                </th>

              </tr>

            </thead>

            {/* BODY */}

            <tbody>

              {filteredClients.map(
                (client, index) => (

                  <tr
                    key={
                      client.id ||
                      index
                    }
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >

                    {/* CLIENT */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-lg">

                          {client.full_name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}

                        </div>

                        <div>

                          <h2 className="font-bold text-slate-900">

                            {client.full_name ||
                              "Unknown User"}

                          </h2>

                          <p className="text-sm text-slate-500">

                            Traveler

                          </p>

                        </div>

                      </div>

                    </td>

                    {/* EMAIL */}

                    <td className="px-6 py-5 text-slate-700">

                      <div className="flex items-center gap-3">

                        <FaEnvelope className="text-indigo-500" />

                        {client.email}

                      </div>

                    </td>

                    {/* PHONE */}

                    <td className="px-6 py-5 text-slate-700">

                      <div className="flex items-center gap-3">

                        <FaPhone className="text-green-500" />

                        {client.phone || "N/A"}

                      </div>

                    </td>

                    {/* BOOKINGS */}

                    <td className="px-6 py-5">

                      <span className="bg-cyan-50 text-cyan-700 px-4 py-2 rounded-2xl font-bold">

                        {
                          client.total_bookings || 0
                        }

                      </span>

                    </td>

                    {/* REVENUE */}

                    <td className="px-6 py-5">

                      <span className="bg-green-50 text-green-700 px-4 py-2 rounded-2xl font-bold">

                        ₹{
                          client.total_spent || 0
                        }

                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5">

                      <div className="flex justify-center">

                        <button
                          onClick={() =>
                            deleteClient(
                              client.id
                            )
                          }
                          className="h-11 px-5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold flex items-center gap-2 shadow-lg hover:opacity-90 transition"
                        >

                          <FaTrash />

                          Delete

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ===================================================== */}
      {/* EMPTY */}
      {/* ===================================================== */}

      {!loading &&
        filteredClients.length ===
        0 && (

        <div className="text-center py-24">

          <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">

            <FaUsers className="text-indigo-600 text-4xl" />

          </div>

          <h2 className="text-3xl font-black text-slate-900">

            No Clients Found

          </h2>

          <p className="text-slate-500 mt-4 text-lg">

            No customer records available.

          </p>

        </div>

      )}

    </div>

  );

}

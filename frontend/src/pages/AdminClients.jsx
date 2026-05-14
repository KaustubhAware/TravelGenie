    import { useEffect, useState } from "react";

    import { fetchWithAuth } from "../utils/api";

    import {
    FaUsers,
    FaSearch,
    FaTrash,
    FaEnvelope,
    FaPhone,
    FaMoneyBillWave,
    FaSuitcaseRolling,
    } from "react-icons/fa";

    export default function AdminClients() {

    const [clients, setClients] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    // =====================================================
    // FETCH CLIENTS
    // =====================================================

    const fetchClients = async () => {

        try {

        setLoading(true);

        const res =
            await fetchWithAuth(
            "/admin/clients"
            );

        const data =
            await res.json();

        console.log(data);

        setClients(
            data.clients || []
        );

        } catch (err) {

        console.error(err);

        alert(
            "Failed to load clients"
        );

        } finally {

        setLoading(false);

        }

    };

    useEffect(() => {

        fetchClients();

    }, []);

    // =====================================================
    // DELETE CLIENT
    // =====================================================

    const deleteClient = async (
        id
    ) => {

        console.log("DELETE ID:", id);

        if (!id) {

        alert(
            "Client ID missing from backend"
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

        fetchClients();

        } catch (err) {

        console.error(err);

        alert(
            "Failed to delete client"
        );

        }

    };

    // =====================================================
    // FILTER CLIENTS
    // =====================================================

    const filteredClients =
        clients.filter((client) =>
        `${client.full_name || ""} ${client.email || ""}`
            .toLowerCase()
            .includes(
            search.toLowerCase()
            )
        );

    // =====================================================
    // STATS
    // =====================================================

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

    return (

        <div className="min-h-screen bg-gradient-to-br from-[#f4f7ff] to-[#eef5ff] p-8">

        {/* ================================================= */}
        {/* ================= HEADER ======================== */}
        {/* ================================================= */}

        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

            <div>

            <h1 className="text-4xl font-bold text-gray-900">

                Client Management

            </h1>

            <p className="text-gray-500 mt-2">

                Manage agency customers and bookings

            </p>

            </div>

            {/* SEARCH */}

            <div className="relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={(e) =>
                setSearch(
                    e.target.value
                )
                }
                className="pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white outline-none w-[320px] focus:ring-2 focus:ring-blue-500"
            />

            </div>

        </div>

        {/* ================================================= */}
        {/* ================= STATS ========================= */}
        {/* ================================================= */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

            {/* CLIENTS */}

            <div className="bg-white rounded-[30px] p-6 shadow-lg border border-gray-100">

            <div className="flex justify-between items-center">

                <div>

                <p className="text-gray-500">

                    Total Clients

                </p>

                <h2 className="text-4xl font-bold mt-3">

                    {totalClients}

                </h2>

                </div>

                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">

                <FaUsers className="text-blue-600 text-2xl" />

                </div>

            </div>

            </div>

            {/* BOOKINGS */}

            <div className="bg-white rounded-[30px] p-6 shadow-lg border border-gray-100">

            <div className="flex justify-between items-center">

                <div>

                <p className="text-gray-500">

                    Total Bookings

                </p>

                <h2 className="text-4xl font-bold mt-3">

                    {totalBookings}

                </h2>

                </div>

                <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center">

                <FaSuitcaseRolling className="text-cyan-600 text-2xl" />

                </div>

            </div>

            </div>

            {/* REVENUE */}

            <div className="bg-white rounded-[30px] p-6 shadow-lg border border-gray-100">

            <div className="flex justify-between items-center">

                <div>

                <p className="text-gray-500">

                    Total Revenue

                </p>

                <h2 className="text-4xl font-bold mt-3">

                    ₹ {totalRevenue}

                </h2>

                </div>

                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">

                <FaMoneyBillWave className="text-green-600 text-2xl" />

                </div>

            </div>

            </div>

        </div>

        {/* ================================================= */}
        {/* ================= CLIENT TABLE ================== */}
        {/* ================================================= */}

        <div className="bg-white rounded-[30px] shadow-lg border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">

            <table className="w-full">

                <thead className="bg-[#f8fbff] border-b border-gray-100">

                <tr>

                    <th className="text-left px-6 py-5 text-gray-600 font-semibold">

                    Client

                    </th>

                    <th className="text-left px-6 py-5 text-gray-600 font-semibold">

                    Email

                    </th>

                    <th className="text-left px-6 py-5 text-gray-600 font-semibold">

                    Phone

                    </th>

                    <th className="text-left px-6 py-5 text-gray-600 font-semibold">

                    Bookings

                    </th>

                    <th className="text-left px-6 py-5 text-gray-600 font-semibold">

                    Total Spent

                    </th>

                    <th className="text-center px-6 py-5 text-gray-600 font-semibold">

                    Actions

                    </th>

                </tr>

                </thead>

                <tbody>

                {filteredClients.map(
                    (client, index) => (

                    <tr
                        key={
                        client.id ||
                        index
                        }
                        className="border-b border-gray-100 hover:bg-[#f8fbff] transition"
                    >

                        {/* CLIENT */}

                        <td className="px-6 py-5">

                        <div className="flex items-center gap-4">

                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-lg">

                            {client.full_name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}

                            </div>

                            <div>

                            <h2 className="font-semibold text-gray-900">

                                {client.full_name || "Unknown User"}

                            </h2>

                            <p className="text-sm text-gray-500">

                                Customer

                            </p>

                            </div>

                        </div>

                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-5 text-gray-700">

                        <div className="flex items-center gap-3">

                            <FaEnvelope className="text-blue-500" />

                            {client.email}

                        </div>

                        </td>

                        {/* PHONE */}

                        <td className="px-6 py-5 text-gray-700">

                        <div className="flex items-center gap-3">

                            <FaPhone className="text-green-500" />

                            {client.phone || "N/A"}

                        </div>

                        </td>

                        {/* BOOKINGS */}

                        <td className="px-6 py-5">

                        <span className="bg-cyan-50 text-cyan-700 px-4 py-2 rounded-2xl font-semibold">

                            {
                            client.total_bookings || 0
                            }

                        </span>

                        </td>

                        {/* SPENT */}

                        <td className="px-6 py-5">

                        <span className="bg-green-50 text-green-700 px-4 py-2 rounded-2xl font-semibold">

                            ₹ {
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
                            className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md hover:opacity-90 transition"
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

        {/* ================================================= */}
        {/* ================= EMPTY STATE =================== */}
        {/* ================================================= */}

        {!loading &&
            filteredClients.length ===
            0 && (

            <div className="text-center py-24">

                <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">

                <FaUsers className="text-blue-600 text-4xl" />

                </div>

                <h2 className="text-2xl font-bold text-gray-900">

                No Clients Found

                </h2>

                <p className="text-gray-500 mt-3">

                No customer records available

                </p>

            </div>

            )}

        </div>

    );

    }
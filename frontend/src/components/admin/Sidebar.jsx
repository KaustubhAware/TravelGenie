import { Link, useLocation } from "react-router-dom";

import {
  FaChartBar,
  FaSuitcaseRolling,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaMapMarkedAlt,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  logout,
}) {

  const location = useLocation();

  const menuClass = (path) =>
    `w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition font-medium ${
      location.pathname === path
        ? "bg-blue-50 text-blue-700 shadow-sm"
        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
    }`;

  return (

    <div
      className={`${
        sidebarOpen ? "w-72" : "w-24"
      } bg-white border-r border-gray-100 shadow-xl min-h-screen sticky top-0 transition-all duration-300 flex flex-col z-30`}
    >

      {/* LOGO */}

      <div className="p-6 border-b border-gray-100">

        <button
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition"
        >

          {sidebarOpen
            ? "Travel Agency CRM"
            : "TA"}

        </button>

      </div>

      {/* MENU */}

      <div className="flex-1 px-4 py-6 overflow-y-auto">

        <div className="space-y-2">

          {/* DASHBOARD */}

          <Link
            to="/admin"
            className={menuClass(
              "/admin"
            )}
          >

            <FaChartBar className="text-lg min-w-[20px]" />

            {sidebarOpen && (
              <span>Dashboard</span>
            )}

          </Link>

          {/* CLIENTS */}

          <Link
            to="/admin/clients"
            className={menuClass(
              "/admin/clients"
            )}
          >

            <FaUsers className="text-lg min-w-[20px]" />

            {sidebarOpen && (
              <span>Clients</span>
            )}

          </Link>

          {/* BOOKINGS */}

          <Link
            to="/admin/bookings"
            className={menuClass(
              "/admin/bookings"
            )}
          >

            <FaSuitcaseRolling className="text-lg min-w-[20px]" />

            {sidebarOpen && (
              <span>Bookings</span>
            )}

          </Link>

          {/* PACKAGES */}

          <Link
            to="/admin/packages"
            className={menuClass(
              "/admin/packages"
            )}
          >

            <FaMapMarkedAlt className="text-lg min-w-[20px]" />

            {sidebarOpen && (
              <span>Packages</span>
            )}

          </Link>

          <Link
            to="/agent"
            className={menuClass(
              "/agent"
            )}
          >

            <FaUserTie className="text-lg min-w-[20px]" />

            {sidebarOpen && (
              <span>Agent Panel</span>
            )}

          </Link>

          {/* ANALYTICS */}

          <Link
            to="/admin/analytics"
            className={menuClass(
              "/admin/analytics"
            )}
          >

            <FaMoneyBillWave className="text-lg min-w-[20px]" />

            {sidebarOpen && (
              <span>Analytics</span>
            )}

          </Link>

        </div>

      </div>

      {/* USER CARD */}

      {sidebarOpen && (

        <div className="mx-4 mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-5 text-white shadow-lg">

          <p className="text-sm opacity-90">
            Admin Panel
          </p>

          <h2 className="text-xl font-bold mt-1">
            TravelGenie
          </h2>

          <p className="text-sm mt-2 opacity-80">
            AI Powered Travel Agency SaaS
          </p>

        </div>

      )}

      {/* LOGOUT */}

      <div className="p-4 border-t border-gray-100">

        <button
          onClick={logout}
          className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:opacity-90 text-white py-3 rounded-2xl flex items-center justify-center gap-3 transition shadow-lg"
        >

          <FaSignOutAlt />

          {sidebarOpen && (
            <span>Logout</span>
          )}

        </button>

      </div>

    </div>

  );
}

import { Link, useLocation } from "react-router-dom";

import {
  FaChartBar,
  FaSuitcaseRolling,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaMapMarkedAlt,
  FaUsers,
  FaUserTie,
  FaMountain,
} from "react-icons/fa";

const links = [
  { to: "/admin", label: "Command Center", icon: FaChartBar },
  { to: "/admin/clients", label: "Customers", icon: FaUsers },
  { to: "/admin/bookings", label: "Bookings", icon: FaSuitcaseRolling },
  { to: "/admin/packages", label: "Packages", icon: FaMapMarkedAlt },
  { to: "/agent", label: "Guides", icon: FaUserTie },
  { to: "/admin/analytics", label: "Analytics", icon: FaMoneyBillWave },
];

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  logout,
}) {
  const location = useLocation();

  const menuClass = (path) =>
    `w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition font-semibold ${
      location.pathname === path
        ? "bg-white text-primary shadow-soft"
        : "text-white/68 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <aside
      className={`${
        sidebarOpen ? "lg:w-72" : "lg:w-24"
      } hidden min-h-screen flex-col border-r border-white/10 bg-primary-dark/96 text-white shadow-card backdrop-blur-xl transition-all duration-300 lg:sticky lg:top-0 lg:flex`}
    >
      <div className="border-b border-white/10 p-5">
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-white/8 p-4 text-left transition hover:bg-white/12"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-white">
            <FaMountain />
          </span>
          {sidebarOpen && (
            <span>
              <span className="font-heading block text-xl font-bold">TravelGenie</span>
              <span className="text-xs uppercase tracking-[0.18em] text-white/50">
                Ops command
              </span>
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">
          {links.map((item) => (
            <Link key={item.to} to={item.to} className={menuClass(item.to)}>
              <item.icon className="min-w-[20px] text-lg" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>

      {sidebarOpen && (
        <div className="mx-4 mb-4 rounded-3xl border border-white/10 bg-white/8 p-5">
          <p className="text-sm text-white/62">Active workflow</p>
          <h2 className="font-heading mt-1 text-xl font-bold">
            Expedition Operations
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Packages, departures, guides, bookings, and revenue.
          </p>
        </div>
      )}

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-accent py-3 font-semibold text-white shadow-lg transition hover:bg-accent-dark"
        >
          <FaSignOutAlt />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  FaChartPie,
  FaBoxOpen,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaUsers,
  FaUserTie,
  FaMountain,
  FaBars,
  FaStar,
} from "react-icons/fa";

/* ===================================================== */
/* NAVIGATION */
/* ===================================================== */

const links = [

  {
    to: "/admin",
    label: "Dashboard",
    icon: FaChartPie,
  },

  {
    to: "/admin/bookings",
    label: "Bookings",
    icon: FaCalendarCheck,
  },

  {
    to: "/admin/packages",
    label: "Packages",
    icon: FaBoxOpen,
  },

  {
    to: "/admin/clients",
    label: "Customers",
    icon: FaUsers,
  },

  {
    to: "/admin/analytics",
    label: "Analytics",
    icon: FaMoneyBillWave,
  },

  {
    to: "/admin/guides",
    label: "Guides",
    icon: FaUserTie,
  },

  {
    to: "/admin/vendors",
    label: "Vendors",
    icon: FaMountain,
  },

  {
    to: "/admin/reviews",
    label: "Reviews",
    icon: FaStar,
  },

];

/* ===================================================== */
/* COMPONENT */
/* ===================================================== */

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  logout,
}) {

  const location =
    useLocation();

  /* ===================================================== */
  /* ACTIVE */
  /* ===================================================== */

  const isActive = (path) =>

    location.pathname === path ||

    (path !== "/admin" &&
      location.pathname.startsWith(path));

  /* ===================================================== */
  /* MENU STYLE */
  /* ===================================================== */

  const menuClass = (path) =>

    `flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
      isActive(path)

        ? "bg-slate-100 text-slate-900 font-semibold"

        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    }`;

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <aside
      className={`hidden lg:flex flex-col shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ${
        sidebarOpen
          ? "w-[260px]"
          : "w-[92px]"
      }`}
    >

      {/* ===================================================== */}
      {/* TOP */}
      {/* ===================================================== */}

      <div className="h-[82px] border-b border-slate-200 px-5 flex items-center justify-between shrink-0">

        {/* LOGO */}

        <div className="flex items-center gap-4 overflow-hidden">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900">

            <FaMountain className="text-white text-lg" />

          </div>

          {sidebarOpen && (

            <div>

              <h2 className="text-slate-900 text-lg font-bold">

                TravelGenie

              </h2>

              <p className="text-slate-400 text-xs mt-1">

                Admin Dashboard

              </p>

            </div>

          )}

        </div>

        {/* TOGGLE */}

        {sidebarOpen && (

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >

            <FaBars />

          </button>

        )}

      </div>

      {/* ===================================================== */}
      {/* COLLAPSED BUTTON */}
      {/* ===================================================== */}

      {!sidebarOpen && (

        <div className="px-4 py-5">

          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="flex h-12 w-full items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >

            <FaBars />

          </button>

        </div>

      )}

      {/* ===================================================== */}
      {/* NAVIGATION */}
      {/* ===================================================== */}

      <div className="flex-1 overflow-y-auto px-4 py-6">

        {sidebarOpen && (

          <div className="mb-5 px-2">

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">

              Management

            </p>

          </div>

        )}

        <div className="space-y-1.5">

          {links.map((item) => (

            <Link
              key={item.to}
              to={item.to}
              className={menuClass(item.to)}
            >

              {/* ICON */}

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">

                <item.icon className="text-base" />

              </div>

              {/* TEXT */}

              {sidebarOpen && (

                <span className="truncate">

                  {item.label}

                </span>

              )}

            </Link>

          ))}

        </div>

      </div>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <div className="border-t border-slate-200 p-4">

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >

          <FaSignOutAlt />

          {sidebarOpen && (

            <span>

              Logout

            </span>

          )}

        </button>

      </div>

    </aside>

  );

}
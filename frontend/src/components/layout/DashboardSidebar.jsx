import {
  LayoutDashboard,
  Mountain,
  CalendarDays,
  Sparkles,
  User,
  LogOut,
  Bot,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useState,
} from "react";

import logo from "../../assets/logo.svg";

const navItems = [

  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    exact: true,
  },

  {
    label: "Packages",
    icon: Mountain,
    path: "/dashboard/packages",
  },

  {
    label: "Bookings",
    icon: CalendarDays,
    path: "/dashboard/bookings",
  },

  {
    label: "AI Planner",
    icon: Sparkles,
    path: "/dashboard/ai-planner",
  },

  {
    label: "AI Chat",
    icon: Bot,
    path: "/dashboard/ai-chat",
  },

  {
    label: "Profile",
    icon: User,
    path: "/dashboard/profile",
  },

];

export default function DashboardSidebar() {

  const [collapsed, setCollapsed] =
    useState(false);

  const navigate =
    useNavigate();

  /* ===================================================== */
  /* LOGOUT */
  /* ===================================================== */

  const handleLogout =
    async () => {

      try {

        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");

        navigate("/login");

      } catch (err) {

        console.error(err);

      }

    };

  return (

    <aside
      className={`hidden border-r border-slate-200 bg-white transition-all duration-300 lg:flex lg:flex-col ${
        collapsed
          ? "w-[92px]"
          : "w-[245px]"
      }`}
    >

      {/* ===================================================== */}
      {/* LOGO */}
      {/* ===================================================== */}

      <div className="border-b border-slate-100 px-4 py-4">

        <button
          onClick={() =>
            setCollapsed(
              !collapsed
            )
          }
          className={`flex w-full items-center rounded-2xl transition-all duration-300 hover:bg-slate-50 ${
            collapsed
              ? "justify-center p-2"
              : "gap-2 p-2"
          }`}
        >

          {/* LOGO */}

          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">

            <img
              src={logo}
              alt="TravelGenie"
              className="h-9 w-9 object-contain"
            />

          </div>

          {/* BRAND */}

          {!collapsed && (

            <div className="text-left">

              <h1
                className="text-[32px] leading-none"
                style={{
                  fontFamily:
                    "'Lobster Two', cursive",
                  fontWeight: 700,
                }}
              >

                <span className="text-[#08112b]">

                  Travel

                </span>

                <span className="text-orange-500">

                  Genie

                </span>

              </h1>

            </div>

          )}

        </button>

      </div>

      {/* ===================================================== */}
      {/* NAVIGATION */}
      {/* ===================================================== */}

      <div className="flex flex-1 flex-col gap-2 p-3">

        {navItems.map(
          (item) => {

            const Icon =
              item.icon;

            return (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({
                  isActive,
                }) =>
                  `flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    collapsed
                      ? "justify-center"
                      : "gap-4"
                  } ${
                    isActive
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-slate-600 hover:bg-orange-50 hover:text-orange-500"
                  }`
                }
              >

                <Icon
                  size={19}
                />

                {!collapsed &&
                  item.label}

              </NavLink>

            );

          }
        )}

      </div>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <div className="border-t border-slate-100 p-3">

        <button
          onClick={
            handleLogout
          }
          className={`flex w-full items-center rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-500 ${
            collapsed
              ? "justify-center"
              : "gap-4"
          }`}
        >

          <LogOut size={19} />

          {!collapsed &&
            "Logout"}

        </button>

      </div>

    </aside>

  );

}

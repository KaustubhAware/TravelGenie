import { useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import logo from "../assets/logo.svg";

import {
  FaBars,
  FaCalendarCheck,
  FaCompass,
  FaRobot,
  FaSignOutAlt,
  FaTimes,
  FaUserCircle,
  FaBoxOpen,
  FaMountain,
} from "react-icons/fa";

import {
  DASHBOARD_ROUTES,
  PUBLIC_ROUTES,
} from "../constants/routesPath";

/* ===================================================== */
/* NAV LINKS */
/* ===================================================== */

const links = [

  {
    path: DASHBOARD_ROUTES.root,
    label: "Dashboard",
    icon: FaCompass,
  },

  {
    path: "/dashboard/packages",
    label: "Packages",
    icon: FaBoxOpen,
  },

  {
    path: DASHBOARD_ROUTES.bookings,
    label: "Bookings",
    icon: FaCalendarCheck,
  },

  {
    path: DASHBOARD_ROUTES.aiPlanner,
    label: "AI Planner",
    icon: FaRobot,
  },

  {
    path: DASHBOARD_ROUTES.profile,
    label: "Profile",
    icon: FaUserCircle,
  },

];

/* ===================================================== */
/* COMPONENT */
/* ===================================================== */

const NavbarApp = () => {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [open, setOpen] =
    useState(false);

  /* ===================================================== */
  /* ACTIVE */
  /* ===================================================== */

  const isActive =
    (path) =>

      location.pathname === path ||

      (
        path !== DASHBOARD_ROUTES.root &&

        location.pathname.startsWith(
          `${path}/`
        )
      );

  /* ===================================================== */
  /* LOGOUT */
  /* ===================================================== */

  const handleLogout =
    async () => {

      try {

        localStorage.removeItem(
          "user_token"
        );

        localStorage.removeItem(
          "token"
        );

        navigate(
          PUBLIC_ROUTES.home
        );

      } catch (error) {

        console.error(error);

      }

    };

  /* ===================================================== */
  /* GO */
  /* ===================================================== */

  const go =
    (path) => {

      setOpen(false);

      navigate(path);

    };

  return (

    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-[#ececec]/80 backdrop-blur-xl">

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8">

        {/* ===================================================== */}
        {/* MAIN */}
        {/* ===================================================== */}

        <div className="h-[78px] flex items-center justify-between gap-5">

          {/* ===================================================== */}
          {/* LEFT */}
          {/* ===================================================== */}

          <div className="flex items-center gap-10">

            {/* LOGO */}

            <button
              type="button"
              onClick={() =>
                go(
                  DASHBOARD_ROUTES.root
                )
              }
              className="flex items-center gap-2 shrink-0"
            >

              {/* ICON */}

              <div className="w-14 h-14 rounded-3xl bg-white flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">

                <img
                  src={logo}
                  alt="TravelGenie"
                  className="w-9 h-9 object-contain"
                />

              </div>

              {/* TEXT */}

              <div>

                <h2
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

                </h2>

                

              </div>

            </button>

            {/* ===================================================== */}
            {/* DESKTOP NAV */}
            {/* ===================================================== */}

            <div className="hidden xl:flex items-center gap-2">

              {links.map((link) => {

                const Icon =
                  link.icon;

                return (

                  <button
                    key={link.path}
                    type="button"
                    onClick={() =>
                      go(link.path)
                    }
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                      isActive(link.path)

                        ? "bg-orange-500 text-white shadow-sm"

                        : "text-slate-600 hover:bg-white hover:text-[#08112b]"
                    }`}
                  >

                    <Icon className="text-sm" />

                    {link.label}

                  </button>

                );

              })}

            </div>

          </div>

          {/* ===================================================== */}
          {/* RIGHT */}
          {/* ===================================================== */}

          <div className="flex items-center gap-3">

            {/* EXPLORE */}

            <button
              type="button"
              onClick={() =>
                go(
                  PUBLIC_ROUTES.treks
                )
              }
              className="hidden md:flex items-center gap-2 bg-[#08112b] hover:bg-[#101c45] transition text-white px-6 py-3 rounded-2xl font-semibold shadow-sm"
            >

              <FaMountain />

              Explore Treks

            </button>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 bg-white border border-slate-200 hover:border-orange-200 hover:text-orange-500 transition-all duration-300 px-5 py-3 rounded-2xl text-slate-700 font-semibold shadow-sm"
            >

              <FaSignOutAlt />

              Logout

            </button>

            {/* MOBILE */}

            <button
              type="button"
              onClick={() =>
                setOpen(
                  (value) => !value
                )
              }
              className="xl:hidden w-12 h-12 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm"
            >

              {open
                ? <FaTimes />
                : <FaBars />}

            </button>

          </div>

        </div>

        {/* ===================================================== */}
        {/* MOBILE MENU */}
        {/* ===================================================== */}

        {open && (

          <div className="xl:hidden border-t border-slate-200 py-5 space-y-2">

            {links.map((link) => {

              const Icon =
                link.icon;

              return (

                <button
                  key={link.path}
                  type="button"
                  onClick={() =>
                    go(link.path)
                  }
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-semibold transition-all duration-300 ${
                    isActive(link.path)

                      ? "bg-orange-500 text-white"

                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >

                  <Icon />

                  {link.label}

                </button>

              );

            })}

            {/* ACTIONS */}

            <div className="grid gap-3 pt-4">

              <button
                type="button"
                onClick={() =>
                  go(
                    PUBLIC_ROUTES.treks
                  )
                }
                className="flex items-center justify-center gap-2 bg-[#08112b] text-white px-5 py-4 rounded-2xl font-semibold"
              >

                <FaMountain />

                Explore Treks

              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-4 rounded-2xl font-semibold"
              >

                <FaSignOutAlt />

                Logout

              </button>

            </div>

          </div>

        )}

      </div>

    </nav>

  );

};

export default NavbarApp;

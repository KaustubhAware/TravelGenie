import { useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  signOut,
} from "firebase/auth";

import {
  auth,
} from "../firebase";

import logo from "../assets/logo.svg";

import {
  FaBars,
  FaBookmark,
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
    path: DASHBOARD_ROUTES.saved,
    label: "Saved Trips",
    icon: FaBookmark,
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

        await signOut(auth);

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

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8">

        {/* ===================================================== */}
        {/* MAIN NAV */}
        {/* ===================================================== */}

        <div className="h-[74px] flex items-center justify-between gap-5">

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
              className="flex items-center gap-3 shrink-0"
            >

              <div className="w-11 h-11 rounded-2xl bg-orange-500 flex items-center justify-center shadow-sm overflow-hidden">

                <img
                  src={logo}
                  alt="TravelGenie"
                  className="w-6 h-6 object-contain brightness-0 invert"
                />

              </div>

              <div>

                <h2 className="text-lg font-black text-slate-900 leading-none">

                  TravelGenie

                </h2>

                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400 mt-1">

                  AI Trek Platform

                </p>

              </div>

            </button>

            {/* DESKTOP NAV */}

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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive(link.path)

                        ? "bg-orange-500 text-white shadow-sm"

                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
              className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-black transition text-white px-5 py-3 rounded-xl font-semibold shadow-sm"
            >

              <FaMountain />

              Explore Treks

            </button>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 transition px-5 py-3 rounded-xl text-slate-700 font-semibold"
            >

              <FaSignOutAlt />

              Logout

            </button>

            {/* MOBILE TOGGLE */}

            <button
              type="button"
              onClick={() =>
                setOpen(
                  (value) => !value
                )
              }
              className="xl:hidden w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700"
              aria-label="Toggle menu"
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

          <div className="xl:hidden border-t border-slate-200 py-4 space-y-2">

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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-semibold transition ${
                    isActive(link.path)

                      ? "bg-orange-500 text-white"

                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >

                  <Icon />

                  {link.label}

                </button>

              );

            })}

            {/* MOBILE ACTIONS */}

            <div className="grid gap-2 pt-3">

              <button
                type="button"
                onClick={() =>
                  go(
                    PUBLIC_ROUTES.treks
                  )
                }
                className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl font-semibold"
              >

                <FaMountain />

                Explore Treks

              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-xl font-semibold"
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
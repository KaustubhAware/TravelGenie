import { useState } from "react";

import logo from "../assets/logo.svg";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";

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
} from "react-icons/fa";

import {
  DASHBOARD_ROUTES,
  PUBLIC_ROUTES,
} from "../constants/routes";

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
    label: "Saved",
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
  /* ACTIVE ROUTE */
  /* ===================================================== */

  const isActive = (path) =>

    location.pathname === path ||

    (path !== DASHBOARD_ROUTES.root &&

      location.pathname.startsWith(`${path}/`));

  /* ===================================================== */
  /* LOGOUT */
  /* ===================================================== */

  const handleLogout = async () => {

    try {

      /* USER TOKENS */

      localStorage.removeItem(
        "user_token"
      );

      localStorage.removeItem(
        "token"
      );

      /* FIREBASE SIGNOUT */

      await signOut(auth);

      /* REDIRECT */

      navigate(
        PUBLIC_ROUTES.home
      );

    } catch (error) {

      console.error(error);

    }

  };

  /* ===================================================== */
  /* NAVIGATION */
  /* ===================================================== */

  const go = (path) => {

    setOpen(false);

    navigate(path);

  };

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <nav className="sticky top-0 z-50 border-b border-white/10 bg-primary-dark/95 text-white shadow-card backdrop-blur-xl">

      <div className="mx-auto max-w-7xl px-4 lg:px-8">

        {/* ===================================================== */}
        {/* MAIN NAVBAR */}
        {/* ===================================================== */}

        <div className="flex h-[68px] items-center justify-between gap-4">

          {/* ===================================================== */}
          {/* LOGO */}
          {/* ===================================================== */}

          <button
            type="button"
            onClick={() =>
              go(
                DASHBOARD_ROUTES.root
              )
            }
            className="flex items-center gap-3 text-left"
          >

            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/12">

              <img
                src={logo}
                alt="TravelGenie"
                className="h-7 w-7 object-contain"
              />

            </span>

            <span>

              <span className="font-heading block text-lg font-bold">

                TravelGenie

              </span>

              <span className="hidden text-[10px] uppercase tracking-[0.18em] text-white/52 sm:block">

                Trekker Workspace

              </span>

            </span>

          </button>

          {/* ===================================================== */}
          {/* DESKTOP LINKS */}
          {/* ===================================================== */}

          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/8 p-1 lg:flex">

            {links.map((link) => (

              <button
                key={link.path}
                type="button"
                onClick={() =>
                  go(link.path)
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive(link.path)

                    ? "bg-white text-primary shadow-sm"

                    : "text-white/72 hover:bg-white/10 hover:text-white"
                }`}
              >

                {link.label}

              </button>

            ))}

          </div>

          {/* ===================================================== */}
          {/* RIGHT ACTIONS */}
          {/* ===================================================== */}

          <div className="flex items-center gap-2">

            {/* EXPLORE TREKS */}

            <button
              type="button"
              onClick={() =>
                go(
                  PUBLIC_ROUTES.treks
                )
              }
              className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-dark md:inline-flex"
            >

              Explore Treks

            </button>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="hidden items-center gap-2 rounded-full border border-white/14 px-4 py-2.5 text-sm font-semibold text-white/76 transition hover:bg-white/10 hover:text-white md:inline-flex"
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
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/14 bg-white/8 lg:hidden"
              aria-label="Toggle app menu"
            >

              {open ? (
                <FaTimes />
              ) : (
                <FaBars />
              )}

            </button>

          </div>

        </div>

        {/* ===================================================== */}
        {/* MOBILE MENU */}
        {/* ===================================================== */}

        {open && (

          <div className="grid gap-2 border-t border-white/10 py-4 lg:hidden">

            {links.map((link) => (

              <button
                key={link.path}
                type="button"
                onClick={() =>
                  go(link.path)
                }
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive(link.path)

                    ? "bg-white text-primary"

                    : "bg-white/8 text-white/82 hover:bg-white/10"
                }`}
              >

                <link.icon />

                {link.label}

              </button>

            ))}

            {/* MOBILE LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-2xl bg-accent px-4 py-3 text-left text-sm font-semibold text-white"
            >

              <FaSignOutAlt />

              Logout

            </button>

          </div>

        )}

      </div>

    </nav>

  );

};

export default NavbarApp;   
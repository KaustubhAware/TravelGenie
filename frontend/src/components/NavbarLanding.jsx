import {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaMountain,
} from "react-icons/fa";

import logo from "../assets/logo.svg";

import Button from "./ui/Button";

export default function NavbarLanding() {

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const navigate =
    useNavigate();

  const location =
    useLocation();

  /* ===================================================== */
  /* LINKS */
  /* ===================================================== */

  const navLinks = [

    {
      label: "Home",
      href: "/",
    },

    {
      label: "Treks",
      href: "/dashboard/packages",
    },

    {
      label: "AI Planner",
      href: "/dashboard/ai-planner",
    },

    {
      label: "Destinations",
      href: "/destinations",
    },

  ];

  /* ===================================================== */
  /* ACTIVE */
  /* ===================================================== */

  const isActive =
    (href) =>

      location.pathname === href;

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 xl:px-8">

        {/* ===================================================== */}
        {/* MAIN NAV */}
        {/* ===================================================== */}

        <div className="h-[74px] flex items-center justify-between gap-5">

          {/* ===================================================== */}
          {/* LOGO */}
          {/* ===================================================== */}

          <Link
            to="/"
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

          </Link>

          {/* ===================================================== */}
          {/* DESKTOP NAV */}
          {/* ===================================================== */}

          <nav className="hidden xl:flex items-center gap-2">

            {navLinks.map((item) => (

              <button
                key={item.label}
                onClick={() =>
                  navigate(item.href)
                }
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive(item.href)

                    ? "bg-orange-500 text-white shadow-sm"

                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >

                {item.label}

              </button>

            ))}

          </nav>

          {/* ===================================================== */}
          {/* ACTIONS */}
          {/* ===================================================== */}

          <div className="hidden xl:flex items-center gap-3">

            <button
              onClick={() =>
                navigate("/login")
              }
              className="border border-slate-200 bg-white hover:bg-slate-50 transition px-5 py-3 rounded-xl text-slate-700 font-semibold"
            >

              Sign In

            </button>

            <button
              onClick={() =>
                navigate(
                  "/dashboard/ai-planner"
                )
              }
              className="flex items-center gap-2 bg-slate-900 hover:bg-black transition text-white px-5 py-3 rounded-xl font-semibold shadow-sm"
            >

              <FaMountain />

              Start Planning

            </button>

          </div>

          {/* ===================================================== */}
          {/* MOBILE BUTTON */}
          {/* ===================================================== */}

          <button
            onClick={() =>
              setMobileOpen(
                !mobileOpen
              )
            }
            className="xl:hidden w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700"
          >

            {mobileOpen

              ? <FaTimes />

              : <FaBars />
            }

          </button>

        </div>

      </div>

      {/* ===================================================== */}
      {/* MOBILE MENU */}
      {/* ===================================================== */}

      {mobileOpen && (

        <div className="xl:hidden border-t border-slate-200 bg-white">

          <div className="px-4 py-5 space-y-2">

            {navLinks.map((item) => (

              <button
                key={item.label}
                onClick={() => {

                  navigate(item.href);

                  setMobileOpen(false);

                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition ${
                  isActive(item.href)

                    ? "bg-orange-500 text-white"

                    : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >

                {item.label}

              </button>

            ))}

            {/* ACTIONS */}

            <div className="grid gap-2 pt-4">

              <button
                onClick={() =>
                  navigate("/login")
                }
                className="w-full border border-slate-200 bg-white hover:bg-slate-50 transition px-4 py-3 rounded-xl text-slate-700 font-semibold"
              >

                Sign In

              </button>

              <button
                onClick={() =>
                  navigate(
                    "/dashboard/ai-planner"
                  )
                }
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl font-semibold"
              >

                <FaMountain />

                Start Planning

              </button>

            </div>

          </div>

        </div>

      )}

    </header>

  );

}
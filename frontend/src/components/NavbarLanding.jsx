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

    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#ececec]/90 backdrop-blur-xl">

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
           className="flex items-center gap-2 shrink-0"
          >

            {/* LOGO ICON */}

            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md border border-slate-200 overflow-hidden">

              <img
                src={logo}
                alt="TravelGenie"
                className="w-8 h-8 object-contain"
              />

            </div>

            <div>

  <h2
    className="text-[32px] leading-none"
    style={{
      fontFamily: "'Lobster Two', cursive",
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
                className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  isActive(item.href)

                    ? "bg-orange-500 text-white shadow-md"

                    : "text-slate-600 hover:bg-white hover:text-[#08112b]"
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

            {/* SIGN IN */}

            <button
              onClick={() =>
                navigate("/login")
              }
              className="px-5 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-white transition-all duration-300"
            >

              Sign In

            </button>

            {/* CTA */}

            <button
              onClick={() =>
                navigate(
                  "/dashboard/ai-planner"
                )
              }
              className="flex items-center gap-2 bg-[#08112b] hover:bg-[#111d45] transition-all duration-300 text-white px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg"
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
            className="xl:hidden w-11 h-11 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm"
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

        <div className="xl:hidden border-t border-slate-200 bg-[#ececec]">

          <div className="px-4 py-5 space-y-2">

            {navLinks.map((item) => (

              <button
                key={item.label}
                onClick={() => {

                  navigate(item.href);

                  setMobileOpen(false);

                }}
                className={`w-full text-left px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  isActive(item.href)

                    ? "bg-orange-500 text-white"

                    : "bg-white text-slate-700 hover:bg-slate-100"
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
                className="w-full bg-white hover:bg-slate-100 transition-all duration-300 px-4 py-3 rounded-2xl text-slate-700 font-semibold"
              >

                Sign In

              </button>

              <button
                onClick={() =>
                  navigate(
                    "/dashboard/ai-planner"
                  )
                }
                className="w-full flex items-center justify-center gap-2 bg-[#08112b] text-white px-4 py-3 rounded-2xl font-semibold"
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
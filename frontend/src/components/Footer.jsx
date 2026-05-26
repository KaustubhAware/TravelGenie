import {
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import logo from "../assets/logo.svg";

export default function Footer() {

  const navigate =
    useNavigate();

  /* ===================================================== */
  /* LINKS */
  /* ===================================================== */

  const footerLinks = {

    Explore: [

      {
        label: "Treks",
        path: "/dashboard/packages",
      },

      {
        label: "Destinations",
        path: "/destinations",
      },

      {
        label: "AI Planner",
        path: "/dashboard/ai-planner",
      },

      {
        label: "Travel Blogs",
        path: "/blog",
      },

    ],

    Platform: [

      {
        label: "Dashboard",
        path: "/dashboard",
      },

      {
        label: "Bookings",
        path: "/dashboard/bookings",
      },

      {
        label: "Saved Trips",
        path: "/dashboard/saved",
      },

     
    ],

    Company: [

      {
        label: "About",
        path: "/",
      },

      {
        label: "Privacy",
        path: "/",
      },

      {
        label: "Terms",
        path: "/",
      },

      {
        label: "Support",
        path: "/",
      },

    ],

  };

  return (

    <footer className="relative bg-[#ececec] border-t border-slate-200 overflow-hidden">

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16">

        {/* ===================================================== */}
        {/* MAIN */}
        {/* ===================================================== */}

        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr]">

          {/* ===================================================== */}
          {/* LEFT */}
          {/* ===================================================== */}

          <div>

            {/* LOGO */}

            <div className="flex items-center gap-2">

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
                  className="text-[34px] leading-none"
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

                <p className="text-[10px] uppercase tracking-[0.30em] text-slate-500 mt-1 font-semibold">

                  AI TREK PLATFORM

                </p>

              </div>

            </div>

            {/* DESCRIPTION */}

            <p className="mt-7 max-w-md text-slate-600 leading-relaxed">

              AI-powered Maharashtra trekking
              platform built for modern adventure
              travelers, trek organizers, camping
              groups, and weekend explorers.

            </p>

            {/* SOCIALS */}

            <div className="flex items-center gap-3 mt-8">

              {[

                FaInstagram,
                FaLinkedin,
                FaEnvelope,

              ].map((Icon, index) => (

                <button
                  key={index}
                  className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-orange-500 hover:border-orange-200 transition-all duration-300 shadow-sm"
                >

                  <Icon />

                </button>

              ))}

            </div>

          </div>

          {/* ===================================================== */}
          {/* RIGHT */}
          {/* ===================================================== */}

          <div className="grid gap-10 sm:grid-cols-3">

            {Object.entries(
              footerLinks
            ).map(
              ([title, links]) => (

                <div key={title}>

                  {/* TITLE */}

                  <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">

                    {title}

                  </h3>

                  {/* LINKS */}

                  <div className="space-y-4 mt-7">

                    {links.map((link) => (

                      <button
                        key={link.label}
                        onClick={() =>
                          navigate(
                            link.path
                          )
                        }
                        className="block text-sm text-slate-600 hover:text-orange-500 transition-all duration-300"
                      >

                        {link.label}

                      </button>

                    ))}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

        {/* ===================================================== */}
        {/* BOTTOM */}
        {/* ===================================================== */}

        <div className="mt-14 pt-7 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-slate-500">

            Copyright 2026 TravelGenie.
            All rights reserved.

          </p>

          <p className="text-sm text-slate-500">

            AI-powered Maharashtra trekking platform

          </p>

        </div>

      </div>

    </footer>

  );

}
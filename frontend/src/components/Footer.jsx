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

      {
        label: "Payments",
        path: "/dashboard/payments",
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

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <footer className="border-t border-slate-200 bg-white">

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-20">

        <div className="grid gap-16 lg:grid-cols-[1.2fr_2fr]">

          {/* ===================================================== */}
          {/* LEFT */}
          {/* ===================================================== */}

          <div>

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">

                <img
                  src={logo}
                  alt="TravelGenie"
                  className="w-8 h-8 brightness-0 invert"
                />

              </div>

              <div>

                <h2 className="text-2xl font-black text-slate-900">

                  TravelGenie

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  AI Travel Platform

                </p>

              </div>

            </div>

            <p className="mt-8 max-w-md text-slate-500 leading-relaxed">

              Modern trekking and travel operations platform
              built for adventure travelers, tour operators,
              and AI-assisted itinerary planning workflows.

            </p>

            {/* SOCIALS */}

            <div className="flex items-center gap-4 mt-8">

              {[

                FaInstagram,
                FaLinkedin,
                FaEnvelope,

              ].map((Icon, index) => (

                <button
                  key={index}
                  className="w-11 h-11 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
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

                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">

                    {title}

                  </h3>

                  <div className="space-y-4 mt-6">

                    {links.map((link) => (

                      <button
                        key={link.label}
                        onClick={() =>
                          navigate(
                            link.path
                          )
                        }
                        className="block text-sm text-slate-500 hover:text-slate-900 transition"
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

        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-5">

          <p className="text-sm text-slate-500">

            Copyright 2026 TravelGenie.
            All rights reserved.

          </p>

          <p className="text-sm text-slate-500">

            AI-powered trekking operations platform

          </p>

        </div>

      </div>

    </footer>

  );

}
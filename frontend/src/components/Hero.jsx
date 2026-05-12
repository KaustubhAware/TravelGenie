import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import NavbarLanding from "../components/NavbarLanding";
import { auth } from "../firebase";

import "../styles/landing.css";

import {
  FaArrowRight,
  FaRobot,
  FaWallet,
  FaMapMarkedAlt,
} from "react-icons/fa";

/* ================= DESTINATIONS ================= */

const destinations = [
  {
    name: "Bali, Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
  },

  {
    name: "Paris, France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },

  {
    name: "Dubai, UAE",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  },

  {
    name: "Santorini, Greece",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
  },

  {
    name: "Tokyo, Japan",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
  },
];

const Hero = () => {

  const navigate = useNavigate();

  const [currentPlace, setCurrentPlace] = useState(0);

  /* ================= AUTO DESTINATION SLIDER ================= */

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentPlace((prev) =>
        prev === destinations.length - 1 ? 0 : prev + 1
      );

    }, 3500);

    return () => clearInterval(interval);

  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050816]">

      {/* ================= NAVBAR ================= */}

      <NavbarLanding />

      {/* ================= VIDEO BACKGROUND ================= */}

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src="/travel.mp4" type="video/mp4" />
      </video>

      {/* ================= DARK OVERLAY ================= */}

      <div className="absolute inset-0 bg-black/70"></div>

      {/* ================= GLOW EFFECTS ================= */}

      <div className="hero-glow-left"></div>
      <div className="hero-glow-right"></div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="relative z-10 max-w-7xl mx-auto min-h-screen px-6 lg:px-8 pt-28 flex items-center">

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 xl:gap-16 items-center w-full">

          {/* ================================================= */}
          {/* ================= LEFT SECTION ================= */}
          {/* ================================================= */}

          <div className="fade-up max-w-xl">

            {/* HEADING */}

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">

              Explore The <br />

              World <br />

              <span className="gradient-text">
                Smarter With AI
              </span>

            </h1>

            {/* DESCRIPTION */}

            <p className="mt-6 text-base md:text-lg text-gray-300 leading-relaxed">

              TravelGenie helps travelers generate intelligent itineraries,
              discover destinations, optimize travel budgets, manage bookings,
              and experience seamless AI-powered travel planning.

            </p>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-col sm:flex-row gap-4">

              {/* START PLANNING BUTTON */}

              <button
                onClick={() => navigate("/plan")}
                className="hero-button bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 rounded-2xl text-white font-semibold text-lg flex items-center justify-center gap-3 shadow-2xl"
              >

                Start Planning

                <FaArrowRight />

              </button>

              {/* VIEW SAVED TRIPS BUTTON */}

              <button
                onClick={() => {

                  const user = auth.currentUser;

                  if (!user) {
                    navigate("/login");
                  } else {
                    navigate("/saved");
                  }

                }}
                className="glass-card px-7 py-3.5 rounded-2xl text-white text-lg hover:bg-white hover:text-black transition duration-300"
              >

                View Saved Trips

              </button>

            </div>

            {/* STATS */}

            <div className="mt-14 flex flex-wrap gap-10">

              {/* STAT 1 */}

              <div>

                <h2 className="text-4xl font-bold text-white">
                  10K+
                </h2>

                <p className="text-gray-400 mt-2">
                  Trips Generated
                </p>

              </div>

              {/* STAT 2 */}

              <div>

                <h2 className="text-4xl font-bold text-white">
                  98%
                </h2>

                <p className="text-gray-400 mt-2">
                  Satisfaction Rate
                </p>

              </div>

              {/* STAT 3 */}

              <div>

                <h2 className="text-4xl font-bold text-white">
                  24/7
                </h2>

                <p className="text-gray-400 mt-2">
                  AI Assistance
                </p>

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* ================= RIGHT CARD =================== */}
          {/* ================================================= */}

          <div className="hidden lg:flex justify-center">

            <div className="glass-card w-full max-w-[430px] rounded-[30px] p-6 shadow-2xl">

              {/* TOP SECTION */}

              <div className="flex items-center justify-between mb-6">

                <div>

                  <p className="text-sm text-cyan-200 tracking-wide">
                    Recommended Destination
                  </p>

                  <h2 className="text-3xl font-bold text-white mt-2 transition-all duration-700">

                    {destinations[currentPlace].name}

                  </h2>

                </div>

                {/* LOCATION ICON */}

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">

                  <FaMapMarkedAlt className="text-white text-xl" />

                </div>

              </div>

              {/* DESTINATION IMAGE */}

              <div className="overflow-hidden rounded-3xl">

                <img
                  src={destinations[currentPlace].image}
                  alt="Travel Destination"
                  className="w-full h-52 object-cover rounded-3xl transition-all duration-700 hover:scale-105"
                />

              </div>

              {/* DOT INDICATORS */}

              <div className="flex justify-center gap-2 mt-5">

                {destinations.map((_, index) => (

                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentPlace === index
                        ? "w-7 bg-cyan-400"
                        : "w-2 bg-white/30"
                    }`}
                  />

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;
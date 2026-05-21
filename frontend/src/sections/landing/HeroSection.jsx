import { motion } from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaArrowRight,
  FaStar,
  FaMapMarkerAlt,
  FaMountain,
  FaRobot,
  FaUsers,
  FaShieldAlt,
  FaClock,
  FaSearch,
} from "react-icons/fa";

export default function HeroSection() {

  const navigate =
    useNavigate();

  /* ===================================================== */
  /* TREKS */
  /* ===================================================== */

  const treks = [

    {
      id: 1,
      title: "Kalsubai Trek",
      location: "Nashik",
      price: "₹1499",
      difficulty: "Easy",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 2,
      title: "Rajmachi Trek",
      location: "Lonavala",
      price: "₹2499",
      difficulty: "Moderate",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    },

    {
      id: 3,
      title: "Harishchandragad",
      location: "Ahmednagar",
      price: "₹2999",
      difficulty: "Moderate",
      image:
        "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop",
    },

  ];

  /* ===================================================== */
  /* FEATURES */
  /* ===================================================== */

  const features = [

    {
      icon: FaMountain,
      title: "Curated Treks",
      text:
        "Handpicked trekking and camping experiences.",
    },

    {
      icon: FaRobot,
      title: "AI Travel Planner",
      text:
        "Smart recommendations based on your budget and style.",
    },

    {
      icon: FaShieldAlt,
      title: "Safe & Trusted",
      text:
        "Verified guides and trusted operators.",
    },

    {
      icon: FaUsers,
      title: "Group Adventures",
      text:
        "Perfect for solo travelers and friend groups.",
    },

  ];

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <div className="bg-[#f7f8fc] overflow-hidden">

      {/* ===================================================== */}
      {/* HERO SECTION */}
      {/* ===================================================== */}

      <section className="relative min-h-screen">

        {/* BACKGROUND */}

        <div className="absolute inset-0">

          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop"
            alt="mountains"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

        </div>

        {/* CONTENT */}

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">

         

          {/* ===================================================== */}
          {/* HERO CONTENT */}
          {/* ===================================================== */}

          <div className="grid lg:grid-cols-2 gap-20 items-center pt-24 pb-28">

            {/* LEFT */}

            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
              }}
            >

              <p className="uppercase tracking-[0.3em] text-orange-400 font-bold text-sm mb-6">

                Maharashtra Trekking Platform

              </p>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05]">

                Discover
                Mountains.
                Create
                Memories.

              </h1>

              <p className="mt-8 text-xl text-white/80 leading-relaxed max-w-2xl">

                Explore Maharashtra's best trekking,
                camping, forts, waterfalls,
                and adventure experiences with AI-powered planning.

              </p>

              {/* BUTTONS */}

              <div className="flex flex-wrap gap-5 mt-10">

                <button
                  onClick={() =>
                    navigate(
                      "/dashboard/packages"
                    )
                  }
                  className="h-14 px-8 rounded-2xl bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white font-bold flex items-center gap-3 shadow-2xl"
                >

                  Explore Treks

                  <FaArrowRight />

                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/dashboard/ai-planner"
                    )
                  }
                  className="h-14 px-8 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg text-white font-bold"
                >

                  Plan With AI

                </button>

              </div>

              {/* SEARCH */}

              <div className="mt-14 rounded-[32px] bg-white p-5 shadow-2xl">

                <div className="grid md:grid-cols-4 gap-4">

                  {/* SEARCH */}

                  <div className="h-16 rounded-2xl border border-slate-200 px-5 flex items-center gap-3">

                    <FaSearch className="text-slate-400" />

                    <input
                      type="text"
                      placeholder="Search Treks"
                      className="w-full outline-none"
                    />

                  </div>

                  {/* LOCATION */}

                  <select className="h-16 rounded-2xl border border-slate-200 px-5 outline-none">

                    <option>

                      Location

                    </option>

                    <option>

                      Pune

                    </option>

                    <option>

                      Nashik

                    </option>

                    <option>

                      Lonavala

                    </option>

                  </select>

                  {/* DIFFICULTY */}

                  <select className="h-16 rounded-2xl border border-slate-200 px-5 outline-none">

                    <option>

                      Difficulty

                    </option>

                    <option>

                      Easy

                    </option>

                    <option>

                      Moderate

                    </option>

                    <option>

                      Hard

                    </option>

                  </select>

                  {/* BUTTON */}

                  <button className="h-16 rounded-2xl bg-orange-500 hover:bg-orange-600 transition text-white font-bold">

                    Search

                  </button>

                </div>

              </div>

            </motion.div>

            {/* RIGHT */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
              }}
              className="hidden lg:block"
            >

              <div className="grid gap-6">

                {treks.map((trek) => (

                  <motion.div
                    key={trek.id}
                    whileHover={{
                      y: -6,
                    }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] overflow-hidden shadow-2xl"
                  >

                    <div className="grid grid-cols-[170px_1fr]">

                      {/* IMAGE */}

                      <div className="h-full">

                        <img
                          src={trek.image}
                          alt={trek.title}
                          className="w-full h-full object-cover"
                        />

                      </div>

                      {/* CONTENT */}

                      <div className="p-6">

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <h3 className="text-2xl font-black text-white">

                              {trek.title}

                            </h3>

                            <div className="flex items-center gap-2 mt-2 text-white/70">

                              <FaMapMarkerAlt />

                              {trek.location}

                            </div>

                          </div>

                          <div className="flex items-center gap-2 text-orange-400 font-bold">

                            <FaStar />

                            4.8

                          </div>

                        </div>

                        <div className="flex items-center gap-5 mt-6 text-white/70 text-sm">

                          <div className="flex items-center gap-2">

                            <FaMountain />

                            {trek.difficulty}

                          </div>

                          <div className="flex items-center gap-2">

                            <FaClock />

                            Weekend Trek

                          </div>

                        </div>

                        <div className="flex items-center justify-between mt-8">

                          <div>

                            <p className="text-white/60 text-sm">

                              Starting From

                            </p>

                            <h4 className="text-3xl font-black text-white">

                              {trek.price}

                            </h4>

                          </div>

                          <button
                            onClick={() =>
                              navigate(
                                "/dashboard/packages"
                              )
                            }
                            className="h-12 px-5 rounded-2xl bg-orange-500 hover:bg-orange-600 transition text-white font-bold"
                          >

                            Explore

                          </button>

                        </div>

                      </div>

                    </div>

                  </motion.div>

                ))}

              </div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* ===================================================== */}
      {/* FEATURES */}
      {/* ===================================================== */}

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-24">

        <div className="text-center">

          <p className="uppercase tracking-[0.3em] text-orange-500 font-bold text-sm mb-5">

            Why Choose Us

          </p>

          <h2 className="text-5xl font-black text-slate-900">

            Adventure Made Easy

          </h2>

          <p className="mt-6 text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">

            TravelGenie combines AI technology
            with real trekking experiences to
            help travelers discover amazing adventures.

          </p>

        </div>

        {/* GRID */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-16">

          {features.map((item) => (

            <motion.div
              key={item.title}
              whileHover={{
                y: -8,
              }}
              className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-lg hover:shadow-2xl transition-all duration-500"
            >

              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 text-2xl">

                <item.icon />

              </div>

              <h3 className="text-2xl font-black text-slate-900 mt-6">

                {item.title}

              </h3>

              <p className="mt-4 text-slate-500 leading-relaxed">

                {item.text}

              </p>

            </motion.div>

          ))}

        </div>

      </section>

      {/* ===================================================== */}
      {/* AI BANNER */}
      {/* ===================================================== */}

      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24">

        <div className="relative overflow-hidden rounded-[40px]">

          <img
            src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1800&auto=format&fit=crop"
            alt="ai"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 to-emerald-800/80" />

          <div className="relative z-10 p-10 md:p-16">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

              <div>

                <p className="uppercase tracking-[0.3em] text-orange-300 font-bold text-sm mb-5">

                  AI Assistant

                </p>

                <h2 className="text-5xl font-black text-white leading-tight">

                  Plan Your Perfect
                  Trek With AI

                </h2>

                <p className="mt-6 text-lg text-white/80 max-w-2xl leading-relaxed">

                  Our AI assistant helps travelers
                  discover treks, optimize budget,
                  and customize trips based on experience.

                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    "/dashboard/ai-planner"
                  )
                }
                className="h-16 px-10 rounded-2xl bg-white text-green-800 font-black hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-2xl"
              >

                <FaRobot />

                Start AI Planning

              </button>

            </div>

          </div>

        </div>

      </section>

    </div>

  );

}
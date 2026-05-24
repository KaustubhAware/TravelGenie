import { motion } from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaArrowRight,
  FaMountain,
  FaUsers,
  FaShieldAlt,
  FaMedal,
} from "react-icons/fa";

import heroBg from "../../assets/images/backgrounds/hero-bg.jpg";

import Button from "../../components/ui/Button";

export default function HeroSection() {

  const navigate =
    useNavigate();

  /* ===================================================== */
  /* FEATURES */
  /* ===================================================== */

  const features = [

    {
      icon: <FaMedal />,
      title: "Best Price",
    },

    {
      icon: <FaMountain />,
      title: "Expert Guides",
    },

    {
      icon: <FaUsers />,
      title: "Small Groups",
    },

    {
      icon: <FaShieldAlt />,
      title: "Safe Travel",
    },

  ];

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <section className="bg-slate-100 px-4 md:px-6 pb-14">

      {/* ===================================================== */}
      {/* HERO CONTAINER */}
      {/* ===================================================== */}

      <div className="relative overflow-hidden rounded-[42px] max-w-[1600px] mx-auto shadow-xl min-h-[640px]">

        {/* ===================================================== */}
        {/* BACKGROUND IMAGE */}
        {/* ===================================================== */}

        <img
          src={heroBg}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* LIGHT OVERLAY */}

        <div className="absolute inset-0 bg-white/10" />

        {/* ===================================================== */}
        {/* CONTENT */}
        {/* ===================================================== */}

        <div className="relative z-10 px-6 md:px-10 lg:px-16">

          {/* ===================================================== */}
          {/* HERO CONTENT */}
          {/* ===================================================== */}

          <div className="grid lg:grid-cols-2 gap-12 items-center pt-20 md:pt-24 pb-20">

            {/* ===================================================== */}
            {/* LEFT CONTENT */}
            {/* ===================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="max-w-2xl"
            >

              {/* BADGE */}

              

              {/* TITLE */}

              <h1 className="mt-8 text-5xl md:text-7xl font-black leading-[1.02] text-slate-900">

                Discover Mountains.

                <span className="block text-emerald-900">

                  Create Memories.

                </span>

              </h1>

              {/* DESCRIPTION */}

              <p className="mt-7 text-lg md:text-xl text-slate-700 leading-relaxed max-w-xl">

                Platform to discover,
                plan and book treks and group tours
                across India.

              </p>

              {/* BUTTONS */}

              <div className="flex flex-wrap gap-5 mt-10">

                <Button
                  size="lg"
                  icon={<FaArrowRight />}
                  onClick={() =>
                    navigate(
                      "/dashboard/packages"
                    )
                  }
                >

                  Explore Treks

                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() =>
                    navigate(
                      "/dashboard/ai-planner"
                    )
                  }
                >

                  Plan with Sara

                </Button>

              </div>

            </motion.div>

            {/* ===================================================== */}
            {/* RIGHT SIDE SPACE */}
            {/* ===================================================== */}

            <div className="hidden lg:block" />

          </div>

          {/* ===================================================== */}
          {/* FEATURES */}
          {/* ===================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.7,
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-5 pb-12"
          >

            {features.map((item) => (

              <div
                key={item.title}
                className="flex items-center gap-4 rounded-2xl bg-white/92 px-5 py-4 shadow-lg backdrop-blur-sm"
              >

                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shrink-0">

                  {item.icon}

                </div>

                <h3 className="font-bold text-slate-800 text-sm md:text-base">

                  {item.title}

                </h3>

              </div>

            ))}

          </motion.div>

        </div>

      </div>

    </section>

  );

}
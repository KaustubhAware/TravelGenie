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

  return (

    <section className="relative px-3 md:px-5 pt-3 pb-16 bg-[#ececec]">

      {/* HERO WRAPPER */}

      <div className="relative overflow-hidden rounded-[42px] min-h-[92vh] max-w-[1600px] mx-auto shadow-2xl">

        {/* BACKGROUND IMAGE */}

        <img
          src={heroBg}
          alt="TravelGenie Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* LIGHT OVERLAY */}

        <div className="absolute inset-0 bg-black/25" />

        {/* CONTENT */}

        <div className="relative z-10 flex min-h-[84vh] flex-col justify-between px-6 md:px-10 lg:px-16 py-12">

          {/* TOP CONTENT */}

         <div className="grid lg:grid-cols-2 gap-12 items-center pt-4 md:pt-8">
            {/* LEFT SIDE */}

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
              className="max-w-4xl"
            >

              {/* BADGE */}

             
              {/* TITLE */}

<h1 className="mt-8 leading-[0.92] tracking-[-0.05em]">

  <span className="block text-[48px] md:text-[68px] xl:text-[88px] font-black text-white">

    Explore The

  </span>

  <span className="block italic font-serif font-normal text-orange-400 text-[58px] md:text-[82px] xl:text-[105px]">

    Sahyadri

  </span>

  <span className="block text-[48px] md:text-[68px] xl:text-[88px] font-black text-white">

    Like Never

  </span>

  <span className="block text-[48px] md:text-[68px] xl:text-[88px] font-black text-white">

    Before.

  </span>

</h1>
              {/* DESCRIPTION */}

              <p className="mt-8 text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl">

                Platform to discover, plan and book
                Maharashtra treks, camping trips,
                waterfalls, forts and weekend adventures.

              </p>

              {/* BUTTONS */}

              <div className="flex flex-wrap gap-5 mt-12">

                <button
                  onClick={() =>
                    navigate(
                      "/dashboard/packages"
                    )
                  }
                  className="inline-flex items-center gap-3 rounded-2xl bg-orange-500 px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-orange-600"
                >

                  <FaArrowRight />

                  Explore Treks

                </button>

                <button
                  onClick={() =>
                    navigate(
                      "/dashboard/ai-planner"
                    )
                  }
                  className="rounded-2xl bg-[#08112b] px-8 py-4 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:bg-[#0f1c44]"
                >

                  Plan with Sara

                </button>

              </div>

            </motion.div>

          </div>

         
        </div>

      </div>

    </section>

  );

}
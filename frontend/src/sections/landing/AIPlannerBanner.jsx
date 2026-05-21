import {
  motion,
} from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaArrowRight,
  FaRobot,
  FaRoute,
  FaMapMarkedAlt,
  FaCloudSun,
} from "react-icons/fa";

const features = [

  {
    icon: FaRobot,
    title: "AI Recommendations",
    text:
      "Get intelligent trek and travel suggestions across Maharashtra based on season, difficulty, and budget.",
  },

  {
    icon: FaRoute,
    title: "Smart Itineraries",
    text:
      "Generate optimized travel plans for forts, camping, waterfalls, and weekend adventures.",
  },

  {
    icon: FaCloudSun,
    title: "Weather Insights",
    text:
      "Plan monsoon, winter, and summer treks with smart seasonal recommendations.",
  },

  {
    icon: FaMapMarkedAlt,
    title: "Custom Travel Planning",
    text:
      "Build personalized adventure experiences for solo travelers, groups, and weekend explorers.",
  },

];

const AIPlannerBanner = () => {

  const navigate =
    useNavigate();

  return (

    <section className="relative overflow-hidden bg-[#081018] py-24">

      {/* BACKGROUND */}

      <div className="absolute inset-0 opacity-20">

        <img
          src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2070&auto=format&fit=crop"
          alt="AI Travel"
          className="w-full h-full object-cover"
        />

      </div>

      {/* OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#081018] via-[#081018]/90 to-[#081018]/70" />

      {/* CONTENT */}

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <div className="max-w-3xl">

          <p className="uppercase tracking-[0.3em] text-orange-400 font-bold text-sm mb-5">

            AI Powered Planning

          </p>

          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">

            Plan Smarter
            Adventures With AI

          </h2>

          <p className="mt-8 text-lg text-white/70 leading-relaxed">

            TravelGenie AI helps travelers discover,
            personalize, and plan Maharashtra trekking
            and travel experiences with intelligent recommendations.

          </p>

        </div>

        {/* FEATURES */}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-16">

          {features.map((feature, index) => (

            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.08,
              }}
              whileHover={{
                y: -6,
              }}
              className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-7 hover:bg-white/10 transition-all duration-500"
            >

              {/* ICON */}

              <div className="w-16 h-16 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-2xl">

                <feature.icon />

              </div>

              {/* TITLE */}

              <h3 className="mt-6 text-xl font-black text-white leading-snug">

                {feature.title}

              </h3>

              {/* TEXT */}

              <p className="mt-4 text-sm leading-relaxed text-white/70">

                {feature.text}

              </p>

            </motion.div>

          ))}

        </div>

        {/* BUTTONS */}

        <motion.div
          className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row"
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
        >

          <button
            onClick={() =>
              navigate(
                "/dashboard/ai-planner"
              )
            }
            className="h-14 px-8 rounded-2xl bg-orange-500 hover:bg-orange-600 transition text-white font-bold flex items-center gap-3"
          >

            Start AI Planning

            <FaArrowRight />

          </button>

          <button
            onClick={() =>
              navigate(
                "/dashboard/packages"
              )
            }
            className="h-14 px-8 rounded-2xl border border-white/15 bg-white/5 hover:bg-white hover:text-black transition text-white font-bold"
          >

            Explore Packages

          </button>

        </motion.div>

      </div>

    </section>

  );

};

export default AIPlannerBanner;
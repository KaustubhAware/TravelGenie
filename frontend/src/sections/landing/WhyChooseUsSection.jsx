import {
  FaRobot,
  FaShieldAlt,
  FaMountain,
  FaUsers,
  FaChartLine,
  FaClock,
} from "react-icons/fa";

import { motion } from "framer-motion";

import PageContainer from "../../components/ui/PageContainer";
import LandingSectionTitle from "../../components/landing/LandingSectionTitle";

export default function WhyChooseUsSection() {

  /* ===================================================== */
  /* FEATURES */
  /* ===================================================== */

  const features = [

    {
      icon: <FaRobot />,
      title: "AI Trek Planning",
      description:
        "Smart AI-powered itinerary generation tailored for Maharashtra trekking experiences and weekend adventures.",
    },

    {
      icon: <FaMountain />,
      title: "Curated Sahyadri Routes",
      description:
        "Explore carefully selected forts, monsoon trails, waterfalls, and camping experiences across Maharashtra.",
    },

    {
      icon: <FaShieldAlt />,
      title: "Verified Trek Leaders",
      description:
        "Travel with trusted organizers and experienced trek captains focused on safety and professionalism.",
    },

    {
      icon: <FaUsers />,
      title: "Community Experiences",
      description:
        "Join small-group treks, student adventures, and weekend expeditions with like-minded travelers.",
    },

    {
      icon: <FaChartLine />,
      title: "Smart Operations",
      description:
        "Track bookings, departures, occupancy, schedules, and customer engagement in one platform.",
    },

    {
      icon: <FaClock />,
      title: "Fast Planning",
      description:
        "Save hours of research with instant AI recommendations and streamlined booking workflows.",
    },

  ];

  return (

    <section className="landing-section-warm overflow-hidden">

      <PageContainer>

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="text-center max-w-3xl mx-auto"
        >

          
          {/* TITLE */}

          <LandingSectionTitle lead="Built For Modern" accent="Adventure Travelers" />

          {/* DESCRIPTION */}

          <p className="landing-body mt-6 text-lg leading-relaxed">

            TravelGenie combines AI-powered planning,
            real trek operations, and premium travel
            workflows to create unforgettable
            Maharashtra trekking experiences.

          </p>

        </motion.div>

        {/* ===================================================== */}
        {/* GRID */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-20">

          {features.map((feature, index) => (

            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{
                once: true,
              }}
              className="landing-card group relative overflow-hidden rounded-[32px] p-8 transition-all duration-500 hover:-translate-y-2"
            >

              {/* SOFT GLOW */}

              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-orange-500/5 to-transparent" />

              {/* ICON */}

              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-2xl text-orange-500">

                {feature.icon}

              </div>

              {/* TITLE */}

              <h3 className="relative z-10 mt-8 text-2xl font-black text-[#08112b]">

                {feature.title}

              </h3>

              {/* DESCRIPTION */}

              <p className="relative z-10 mt-5 leading-relaxed text-slate-600">

                {feature.description}

              </p>

            </motion.div>

          ))}

        </div>

      </PageContainer>

    </section>

  );

}
import {
  motion,
} from "framer-motion";

import {
  FaShieldAlt,
  FaMountain,
  FaUsers,
  FaRobot,
} from "react-icons/fa";

const features = [

  {
    icon: <FaMountain />,
    title: "Curated Treks",
    description:
      "Handpicked Maharashtra trekking and adventure experiences with verified operators.",
  },

  {
    icon: <FaShieldAlt />,
    title: "Safe & Trusted",
    description:
      "Secure booking workflow with approval-based operations and trusted travel coordination.",
  },

  {
    icon: <FaUsers />,
    title: "Group Experiences",
    description:
      "Weekend getaways, fort treks, camping, and guided adventures built for groups and explorers.",
  },

  {
    icon: <FaRobot />,
    title: "AI Travel Planner",
    description:
      "Smart AI-assisted recommendations for destinations, routes, and personalized travel planning.",
  },

];

const WhyChooseUsSection = () => {

  return (

    <section className="bg-[#f8fafc] py-24">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <div className="max-w-3xl">

          <p className="uppercase tracking-[0.3em] text-orange-500 font-bold text-sm mb-5">

            Why TravelGenie

          </p>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">

            Built For Modern
            Adventure Travelers

          </h2>

          <p className="mt-6 text-lg text-slate-500 leading-relaxed">

            TravelGenie combines
            premium travel operations,
            curated trekking experiences,
            and AI-powered planning
            into one modern platform.

          </p>

        </div>

        {/* GRID */}

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-16">

          {features.map((item, index) => (

            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              viewport={{
                once: true,
              }}
              className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-2xl transition-all duration-500"
            >

              {/* ICON */}

              <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 text-2xl flex items-center justify-center">

                {item.icon}

              </div>

              {/* CONTENT */}

              <h3 className="mt-8 text-2xl font-black text-slate-900">

                {item.title}

              </h3>

              <p className="mt-5 text-slate-500 leading-relaxed">

                {item.description}

              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>

  );

};

export default WhyChooseUsSection;
import {
  FaRobot,
  FaShieldAlt,
  FaMountain,
  FaUsers,
  FaChartLine,
  FaClock,
} from "react-icons/fa";

import PageContainer from "../../components/ui/PageContainer";

import SectionHeader from "../../components/ui/SectionHeader";

import Card from "../../components/ui/Card";

export default function WhyChooseUsSection() {

  /* ===================================================== */
  /* FEATURES */
  /* ===================================================== */

  const features = [

    {
      icon: <FaRobot />,
      title: "AI Trip Planning",
      description:
        "Smart AI-powered itinerary generation based on your budget, travel style, and trekking experience.",
    },

    {
      icon: <FaMountain />,
      title: "Curated Adventures",
      description:
        "Explore handpicked trekking experiences, camping trips, forts, waterfalls, and mountain expeditions.",
    },

    {
      icon: <FaShieldAlt />,
      title: "Trusted Operators",
      description:
        "Verified trekking guides and travel organizers ensuring safe and professional adventure experiences.",
    },

    {
      icon: <FaUsers />,
      title: "Group Experiences",
      description:
        "Perfect for solo travelers, friends, student groups, and corporate adventure outings.",
    },

    {
      icon: <FaChartLine />,
      title: "Smart Booking System",
      description:
        "Track bookings, approvals, payments, and travel details through a streamlined dashboard experience.",
    },

    {
      icon: <FaClock />,
      title: "Fast Planning",
      description:
        "Save hours of planning with instant recommendations and optimized trek discovery workflows.",
    },

  ];

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <section className="py-28 bg-white">

      <PageContainer>

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <SectionHeader
          badge="Why TravelGenie"
          title="Built For Modern Adventure Travelers"
          description="TravelGenie combines AI-powered planning with real trekking operations to create smarter travel experiences."
        />

        {/* ===================================================== */}
        {/* GRID */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-16">

          {features.map((feature) => (

            <Card
              key={feature.title}
              className="group"
            >

              {/* ICON */}

              <div className="w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110">

                {feature.icon}

              </div>

              {/* CONTENT */}

              <h3 className="mt-8 text-2xl font-black text-slate-900">

                {feature.title}

              </h3>

              <p className="mt-5 text-slate-500 leading-relaxed">

                {feature.description}

              </p>

            </Card>

          ))}

        </div>

      </PageContainer>

    </section>

  );

}
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBrain,
  FaCloudSun,
  FaRoute,
  FaUsers,
} from "react-icons/fa";

import SectionHeader from "../../components/ui/SectionHeader";

const features = [
  {
    icon: FaRoute,
    title: "Smart itineraries",
    text: "AI layers acclimatization, rest days, and camp stops on top of operator-curated routes.",
  },
  {
    icon: FaCloudSun,
    title: "Weather insights",
    text: "Season-aware planning for Himalayan windows without replacing fixed departures.",
  },
  {
    icon: FaUsers,
    title: "Crowd and group fit",
    text: "Recommendations based on difficulty, group size, and expedition style.",
  },
  {
    icon: FaBrain,
    title: "Operations assist",
    text: "Guide notes, gear checklists, and pre-trek briefings powered by Gemini and governed by operators.",
  },
];

const AIPlannerBanner = () => {
  const navigate = useNavigate();

  return (
    <section id="ai-planner" className="relative overflow-hidden py-20 md:py-28">
      <img
        src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1600&q=80"
        alt="Himalayan peaks"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/68" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="AI-assisted, operator-curated"
          title="Personalize the trek, keep the expedition real"
          description="TravelGenie AI enhances planning and recommendations. Packages, departures, safety calls, and guides stay in operator control."
          light
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md"
            >
              <feature.icon className="text-2xl text-accent" />
              <h3 className="mt-4 font-heading text-lg font-bold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.button
            type="button"
            onClick={() => navigate("/login")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl bg-accent px-8 py-4 font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Start AI Trek Planning
          </motion.button>
          <motion.button
            type="button"
            onClick={() => navigate("/treks")}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-2xl border border-white/25 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Browse Curated Treks
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AIPlannerBanner;

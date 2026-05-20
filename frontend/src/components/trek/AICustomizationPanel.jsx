import { useState } from "react";
import { motion } from "framer-motion";
import { FaCloudSun, FaHiking, FaRobot, FaRoute, FaUtensils } from "react-icons/fa";

const options = [
  {
    id: "pace",
    icon: FaHiking,
    label: "Gentler pace",
    text: "Suggest prep notes for slower ascent, recovery windows, and first-time trekkers.",
  },
  {
    id: "weather",
    icon: FaCloudSun,
    label: "Weather-ready pack",
    text: "Generate rain, snow, or cold-weather packing guidance based on season.",
  },
  {
    id: "food",
    icon: FaUtensils,
    label: "Food preferences",
    text: "Add vegetarian, Jain, high-protein, or allergy-aware camp meal notes.",
  },
  {
    id: "route",
    icon: FaRoute,
    label: "Route brief",
    text: "Summarize hard days, camp moves, summit windows, and guide checkpoints.",
  },
];

const AICustomizationPanel = ({ trek, onPlan }) => {
  const [selected, setSelected] = useState(["pace", "weather"]);

  const toggleOption = (id) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <section className="bg-primary-dark py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
            AI as expedition support
          </p>
          <h2 className="font-heading mt-5 text-4xl font-bold leading-tight md:text-5xl">
            Customize preparation, not the operator's core trek.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/72">
            TravelGenie keeps {trek.title} as a curated package. AI adds the layer that
            makes each trekker feel prepared: gear, pacing, weather, food, and route briefings.
          </p>
          <button
            type="button"
            onClick={() => onPlan?.(selected)}
            className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-accent px-7 py-4 font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            <FaRobot />
            Open AI trek planner
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-card backdrop-blur-xl md:p-6"
        >
          <div className="rounded-3xl bg-white p-5 text-ink md:p-6">
            <div className="flex items-start justify-between gap-5 border-b border-slate-100 pb-5">
              <div>
                <p className="text-sm font-semibold text-primary">Trek assistant</p>
                <h3 className="font-heading mt-1 text-2xl font-bold">
                  {trek.title}
                </h3>
              </div>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-dark">
                {selected.length} active
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleOption(option.id)}
                  className={`rounded-3xl border p-5 text-left transition ${
                    selected.includes(option.id)
                      ? "border-primary/30 bg-primary/10 shadow-soft"
                      : "border-slate-100 bg-surface hover:border-primary/20"
                  }`}
                >
                  <option.icon className="text-xl text-accent" />
                  <p className="mt-4 font-semibold text-ink">{option.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {option.text}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-3xl bg-primary-dark p-5 text-white">
              <p className="text-sm font-semibold text-accent">Generated preview</p>
              <p className="mt-3 text-sm leading-relaxed text-white/74">
                Build a {trek.duration.toLowerCase()} preparation brief for {trek.region},
                prioritizing {selected.join(", ")} while keeping the fixed departure,
                camps, guide assignment, and booking approval workflow unchanged.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AICustomizationPanel;

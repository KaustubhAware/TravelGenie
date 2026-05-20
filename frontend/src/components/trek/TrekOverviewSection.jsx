import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaCloudSun,
  FaMountain,
  FaRoute,
  FaUsers,
} from "react-icons/fa";

import DifficultyBadge from "./DifficultyBadge";

const TrekOverviewSection = ({ trek }) => {
  if (!trek) return null;

  const insightCards = [
    {
      icon: FaRoute,
      title: "Route intelligence",
      text: "AI reads the fixed itinerary and highlights pacing, camp transitions, and altitude pressure points.",
    },
    {
      icon: FaCloudSun,
      title: "Weather window",
      text: `Best operated in ${trek.season}, with departure-level updates before the booking moves to payment.`,
    },
    {
      icon: FaUsers,
      title: "Group fit",
      text: `${trek.groupSize} per batch keeps guide attention, safety checks, and camp operations manageable.`,
    },
  ];

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-white p-7 shadow-soft ring-1 ring-slate-100 md:p-9"
        >
          <div className="flex flex-wrap items-center gap-3">
            <DifficultyBadge difficulty={trek.difficulty} />
            <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-dark">
              {trek.season}
            </span>
          </div>

          <h2 className="font-heading mt-6 text-3xl font-bold text-ink md:text-4xl">
            Expedition Overview
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            {trek.overview}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {trek.facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl bg-surface p-5">
                <p className="text-sm text-ink-muted">{fact.label}</p>
                <p className="mt-2 font-semibold text-ink">{fact.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-primary-dark p-7 text-white shadow-card md:p-9"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <FaMountain className="text-xl text-accent" />
          </div>
          <h3 className="font-heading mt-5 text-2xl font-bold">
            Why trekkers choose this route
          </h3>

          <div className="mt-6 space-y-4">
            {trek.highlights.map((highlight) => (
              <div key={highlight} className="flex gap-3">
                <FaCheckCircle className="mt-1 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-white/78">{highlight}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {insightCards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft lg:col-span-1"
          >
            <card.icon className="text-2xl text-accent" />
            <h3 className="font-heading mt-4 text-xl font-bold text-ink">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {card.text}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default TrekOverviewSection;

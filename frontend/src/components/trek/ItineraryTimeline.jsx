import { motion } from "framer-motion";
import {
  FaCampground,
  FaFlagCheckered,
  FaMountain,
  FaRoute,
  FaWalking,
} from "react-icons/fa";

const ItineraryTimeline = ({ items = [] }) => {
  return (
    <div className="relative">
      <div className="absolute left-5 top-5 hidden h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-accent via-primary to-primary/10 md:block" />

      <div className="space-y-6">
        {items.map((item, index) => (
          <motion.article
            key={`${item.day}-${item.title}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-soft md:ml-14"
          >
            <div className="absolute -left-[3.85rem] top-7 hidden h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-glow ring-8 ring-surface md:flex">
              {item.summit ? <FaFlagCheckered /> : <FaWalking />}
            </div>

            <div className="grid lg:grid-cols-[1fr_290px]">
              <div className="p-6 md:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-dark">
                    Day {item.day}
                  </span>
                  {item.summit && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                      <FaFlagCheckered />
                      Summit marker
                    </span>
                  )}
                </div>

                <h3 className="font-heading mt-4 text-2xl font-bold text-ink md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">
                  {item.story}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    <FaCampground />
                    Overnight: {item.camp}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-ink-muted">
                    <FaRoute />
                    {item.distance}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 bg-surface p-6 lg:border-l lg:border-t-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
                  Expedition metrics
                </p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
                    <p className="flex items-center gap-2 text-sm text-ink-muted">
                      <FaMountain className="text-accent" />
                      Altitude
                    </p>
                    <p className="mt-2 text-2xl font-bold text-ink">{item.altitude}</p>
                  </div>
                  <div className="rounded-2xl bg-primary-dark p-4 text-white">
                    <p className="text-sm text-white/62">Guide note</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/82">
                      {item.summit
                        ? "Early start, conservative pacing, and weather call before final push."
                        : "Steady movement, hydration checks, and camp briefing after arrival."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default ItineraryTimeline;

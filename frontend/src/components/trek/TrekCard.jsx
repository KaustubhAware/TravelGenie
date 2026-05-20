import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaFire,
  FaMapMarkerAlt,
  FaMountain,
  FaStar,
  FaUsers,
} from "react-icons/fa";

import Badge from "../ui/Badge";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const TrekCard = ({ trek, index = 0, onView }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_26px_70px_rgba(15,23,42,0.18)]"
    >
      <button
        type="button"
        onClick={() => onView?.(trek)}
        className="relative h-72 overflow-hidden text-left"
      >
        <img
          src={trek.image}
          alt={trek.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/45 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/35 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge variant="dark">{trek.difficulty}</Badge>
          <Badge variant="accent">{trek.season}</Badge>
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
          <FaStar className="text-accent" />
          {trek.rating}
        </div>

        <div className="absolute left-4 right-4 top-[4.25rem] flex justify-between gap-3 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-primary-dark/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            {trek.departures} live batches
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white">
            <FaFire />
            Popular
          </span>
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
            <FaMapMarkerAlt className="text-accent" />
            {trek.region}
          </p>
          <h3 className="font-heading mt-2 text-2xl font-bold leading-tight text-white">
            {trek.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/76">
            {trek.mood || trek.overview}
          </p>
        </div>
      </button>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-sm font-semibold text-primary">{trek.promise}</p>

        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          {[
            [FaClock, "Duration", trek.duration],
            [FaMountain, "Altitude", trek.altitude],
            [FaUsers, "Batch", trek.groupSize],
          ].map(([Icon, label, value]) => (
            <div key={label} className="rounded-2xl bg-surface p-3">
              <Icon className="text-accent" />
              <p className="mt-2 text-[11px] uppercase tracking-wider text-ink-muted">
                {label}
              </p>
              <p className="mt-1 text-sm font-semibold leading-tight text-ink">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-sm text-ink-muted">
              <FaCalendarAlt className="text-primary" />
              {trek.nextDeparture || `${trek.departures} departures`}
            </span>
            <span className="text-sm text-ink-muted">{trek.reviews} reviews</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${Math.min(92, 38 + trek.departures * 7)}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-ink-muted">
            Seats moving for the next guided departure
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-muted">Starts at</p>
            <p className="text-2xl font-bold text-primary">{formatPrice(trek.price)}</p>
          </div>

          <motion.button
            type="button"
            onClick={() => onView?.(trek)}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            View story
            <FaArrowRight />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default TrekCard;

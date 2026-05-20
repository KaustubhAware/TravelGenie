import { motion } from "framer-motion";
import { FaCalendarAlt, FaUserTie, FaUsers } from "react-icons/fa";

const DepartureCard = ({ departure, onSelect }) => {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <FaCalendarAlt />
            {departure.date}
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
            <FaUserTie className="text-accent" />
            Lead guide: {departure.guide}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
            <FaUsers className="text-primary" />
            {departure.seats} seats available
          </p>
        </div>

        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-dark">
          {departure.status}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onSelect?.(departure)}
        className="mt-5 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Request this departure
      </button>
    </motion.article>
  );
};

export default DepartureCard;

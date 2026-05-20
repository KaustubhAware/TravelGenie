import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

const TrekSearchBar = ({ onSearch, compact = false }) => {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [season, setSeason] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.({ destination, duration, difficulty, season });
  };

  const fieldClass = compact
    ? "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
    : "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`rounded-3xl bg-white shadow-card ring-1 ring-slate-100 ${
        compact ? "p-4" : "p-5 md:p-6"
      }`}
    >
      <motion.div
        className={`grid gap-4 ${
          compact
            ? "md:grid-cols-2 lg:grid-cols-5"
            : "md:grid-cols-2 lg:grid-cols-5"
        }`}
        initial={false}
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Destination
          </span>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={fieldClass}
          >
            <option value="">All regions</option>
            <option value="uttarakhand">Uttarakhand</option>
            <option value="himachal">Himachal Pradesh</option>
            <option value="ladakh">Ladakh</option>
            <option value="sikkim">Sikkim & Darjeeling</option>
            <option value="kashmir">Kashmir</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Duration
          </span>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className={fieldClass}
          >
            <option value="">Any duration</option>
            <option value="3-5">3–5 days</option>
            <option value="6-8">6–8 days</option>
            <option value="9+">9+ days</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Difficulty
          </span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className={fieldClass}
          >
            <option value="">All levels</option>
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Best season
          </span>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className={fieldClass}
          >
            <option value="">All seasons</option>
            <option value="winter">Winter</option>
            <option value="summer">Summer</option>
            <option value="monsoon">Monsoon breaks</option>
            <option value="autumn">Autumn</option>
          </select>
        </label>

        <motion.div
          className="flex items-end"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <FaSearch />
            Find Treks
          </button>
        </motion.div>
      </motion.div>
    </motion.form>
  );
};

export default TrekSearchBar;

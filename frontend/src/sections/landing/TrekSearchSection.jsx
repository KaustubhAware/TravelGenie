import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import SectionHeader from "../../components/ui/SectionHeader";
import TrekSearchBar from "../../components/trek/TrekSearchBar";

const TrekSearchSection = () => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/treks");
  };

  return (
    <section id="trek-search" className="relative bg-surface py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <motion.div
          className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative mx-auto max-w-7xl px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <SectionHeader
          eyebrow="Find your trail"
          title="Search curated Himalayan treks"
          description="Filter by region, difficulty, duration, and season. Every package is operator-curated; AI assists planning without replacing the trek."
          align="center"
        />

        <div className="mt-12">
          <TrekSearchBar onSearch={handleSearch} />
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Browse the full operator-ready catalog or{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-primary underline-offset-2 hover:underline"
          >
            sign in
          </button>{" "}
          to access AI trek customization.
        </p>
      </motion.div>
    </section>
  );
};

export default TrekSearchSection;

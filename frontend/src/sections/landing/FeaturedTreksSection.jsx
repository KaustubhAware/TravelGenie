import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

import { featuredTreks } from "../../data/featuredTreks";
import SectionHeader from "../../components/ui/SectionHeader";
import TrekCard from "../../components/trek/TrekCard";

const FeaturedTreksSection = () => {
  const navigate = useNavigate();

  const handleView = (trek) => {
    navigate(`/treks/${trek.slug}`);
  };

  const homepageTreks = featuredTreks.slice(0, 4);

  return (
    <section id="featured-treks" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Curated expeditions"
            title="Featured Himalayan treks"
            description="Hand-picked group departures with verified guides, altitude planning, and transparent availability."
            align="left"
          />

          <motion.button
            type="button"
            onClick={() =>
              navigate("/treks")
            }
            whileHover={{ x: 4 }}
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-primary/20 bg-surface px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white lg:self-auto"
          >
            Browse catalog
            <FaArrowRight />
          </motion.button>
        </div>

        <motion.div
          className="mt-14 grid gap-8 sm:grid-cols-2 xl:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {homepageTreks.map((trek, index) => (
            <TrekCard
              key={trek.id}
              trek={trek}
              index={index}
              onView={handleView}
            />
          ))}
        </motion.div>

        <motion.div
          className="mt-12 rounded-3xl bg-primary px-8 py-8 text-center md:flex md:items-center md:justify-between md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div initial={false}>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              For operators
            </p>
            <h3 className="font-heading mt-2 text-2xl font-bold text-white">
              Manage packages, departures & bookings in one place
            </h3>
            <p className="mt-2 max-w-xl text-white/75">
              TravelGenie powers trekking companies with real operations
              workflows — not generic OTA listings.
            </p>
          </motion.div>
          <motion.button
            type="button"
            onClick={() => navigate("/admin/login")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 shrink-0 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-surface md:mt-0"
          >
            Operator Login
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedTreksSection;

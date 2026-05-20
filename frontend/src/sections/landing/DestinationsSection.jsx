import { motion } from "framer-motion";

import { trekDestinations } from "../../data/destinations";
import SectionHeader from "../../components/ui/SectionHeader";
import DestinationCard from "../../components/trek/DestinationCard";

const DestinationsSection = () => {
  const handleExplore = () => {
    document
      .getElementById("featured-treks")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="destinations" className="bg-surface py-20 md:py-28">
      <motion.div
        className="mx-auto max-w-7xl px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <SectionHeader
          eyebrow="Himalayan regions"
          title="Destinations built for trekking"
          description="From Garhwal snowlines to Ladakh high passes — explore regions where curated group expeditions actually operate."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trekDestinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              index={index}
              onExplore={handleExplore}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default DestinationsSection;

import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const DestinationCard = ({ destination, index = 0, onExplore }) => {
  return (
    <motion.button
      type="button"
      onClick={() => onExplore?.(destination)}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="group relative h-72 w-full overflow-hidden rounded-3xl text-left shadow-soft ring-1 ring-slate-100"
    >
      <img
        src={destination.image}
        alt={destination.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          {destination.treks}+ treks
        </p>
        <h3 className="font-heading mt-2 text-2xl font-bold text-white">
          {destination.name}
        </h3>
        <p className="mt-2 text-sm text-white/80">{destination.tagline}</p>

        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Explore region
          <FaArrowRight className="text-accent" />
        </span>
      </div>
    </motion.button>
  );
};

export default DestinationCard;

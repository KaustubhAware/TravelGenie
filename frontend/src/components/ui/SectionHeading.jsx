import { motion } from "framer-motion";

const SectionHeading = ({
  eyebrow,
  title,
  description,
  light = false,
  align = "left",
  className = "",
}) => {
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${centered ? "mx-auto items-center text-center" : "items-start text-left"} flex max-w-3xl flex-col gap-4 ${className}`}
    >
      {eyebrow && (
        <p className={`text-sm font-bold uppercase tracking-[0.24em] ${light ? "text-accent" : "text-primary"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-heading text-3xl font-bold leading-tight md:text-5xl ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-base leading-relaxed md:text-lg ${light ? "text-white/72" : "text-ink-muted"}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;

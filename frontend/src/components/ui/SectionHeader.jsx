import { motion } from "framer-motion";

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}) => {
  const alignClass =
    align === "left"
      ? "text-left items-start"
      : "text-center items-center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col gap-4 max-w-3xl ${alignClass} ${
        align === "center" ? "mx-auto" : ""
      }`}
    >
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${
            light ? "text-accent" : "text-primary"
          }`}
        >
          <span
            className={`h-px w-8 ${
              light ? "bg-accent/60" : "bg-primary/40"
            }`}
          />
          {eyebrow}
        </span>
      )}

      <h2
        className={`font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`text-base md:text-lg leading-relaxed ${
            light ? "text-white/75" : "text-ink-muted"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;

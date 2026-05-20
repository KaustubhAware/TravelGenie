import { motion } from "framer-motion";
import GradientButton from "./GradientButton";

const PageHero = ({
  eyebrow,
  title,
  description,
  image,
  primaryAction,
  secondaryAction,
  children,
  className = "",
}) => {
  return (
    <section className={`relative overflow-hidden bg-primary-dark px-6 pb-20 pt-36 text-white md:pt-44 ${className}`}>
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 tg-hero-gradient" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--tg-bg)] to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-4xl"
        >
          {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="font-heading mt-5 text-5xl font-bold leading-tight md:text-7xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/74">
              {description}
            </p>
          )}
          {(primaryAction || secondaryAction) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryAction && (
                <GradientButton onClick={primaryAction.onClick}>
                  {primaryAction.label}
                </GradientButton>
              )}
              {secondaryAction && (
                <GradientButton variant="secondary" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </GradientButton>
              )}
            </div>
          )}
        </motion.div>

        {children && (
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PageHero;

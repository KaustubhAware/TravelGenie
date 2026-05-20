import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaAward,
  FaCalendarCheck,
  FaCompass,
  FaMapMarkedAlt,
  FaMountain,
  FaSearch,
  FaShieldAlt,
  FaStar,
} from "react-icons/fa";

import { featuredTreks, heroSlides } from "../../data/featuredTreks";
import Badge from "../../components/ui/Badge";

const stats = [
  { value: "100+", label: "curated expeditions" },
  { value: "50+", label: "Himalayan routes" },
  { value: "10K+", label: "trekkers served" },
  { value: "4.8", label: "operator rating" },
];

const trustBadges = [
  "Guide-led departures",
  "Request before payment",
  "Altitude-aware planning",
];

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentPlace, setCurrentPlace] = useState(0);
  const slide = heroSlides[currentPlace];
  const activeTrek = useMemo(
    () => featuredTreks.find((trek) => trek.slug === slide.slug) || featuredTreks[0],
    [slide.slug]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlace((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5600);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section bg-ink">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.03 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.name}
            className="h-full w-full object-cover animate-ken-burns"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/76 to-primary-dark/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-black/35" />
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(22,51,40,0.25),transparent_42%),radial-gradient(circle_at_72%_28%,rgba(230,126,34,0.18),transparent_30%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-surface to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-32 lg:px-8">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <Badge variant="dark" className="mb-6 backdrop-blur-md">
              <FaMountain className="text-accent" />
              Himalayan expedition operations
            </Badge>

            <h1 className="font-heading max-w-4xl text-5xl font-bold leading-[1.03] text-white md:text-6xl xl:text-7xl">
              Discover mountains beyond maps.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/78">
              Curated small-group Himalayan expeditions with guide-led departures,
              booking review, weather-aware preparation, and AI assistance that stays behind the trek.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-semibold text-white/82 backdrop-blur-md"
                >
                  <FaAward className="text-accent" />
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <motion.button
                type="button"
                onClick={() => navigate("/treks")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="hero-button flex items-center gap-3 rounded-2xl bg-accent px-7 py-4 text-base font-semibold text-white hover:bg-accent-dark"
              >
                Explore departures
                <FaArrowRight />
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate(`/treks/${slide.slug}`)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="hero-button rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-ink"
              >
                View featured trek
              </motion.button>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onSubmit={(event) => {
                event.preventDefault();
                navigate("/treks");
              }}
              className="mt-9 max-w-2xl rounded-[1.75rem] border border-white/12 bg-white/12 p-3 shadow-card backdrop-blur-xl"
            >
              <div className="grid gap-3 md:grid-cols-[1fr_150px_150px_auto]">
                <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                  <FaSearch className="text-primary" />
                  <input
                    aria-label="Search treks"
                    placeholder="Search Kedarkantha, Hampta, Kashmir..."
                    className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-ink-muted"
                  />
                </label>
                <select
                  aria-label="Season"
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink outline-none"
                  defaultValue=""
                >
                  <option value="">Season</option>
                  <option>Winter</option>
                  <option>Summer</option>
                  <option>Monsoon</option>
                  <option>Autumn</option>
                </select>
                <select
                  aria-label="Difficulty"
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink outline-none"
                  defaultValue=""
                >
                  <option value="">Difficulty</option>
                  <option>Easy</option>
                  <option>Moderate</option>
                  <option>Hard</option>
                </select>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  <FaCompass />
                  Find
                </button>
              </div>
            </motion.form>

            <motion.div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {stats.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="border-l border-white/18 pl-4"
                >
                  <p className="text-3xl font-bold text-white md:text-4xl">
                    {item.value}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-white/60">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="hidden lg:block"
          >
            <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/10 shadow-card backdrop-blur-xl">
              <div className="relative h-[360px]">
                <img
                  src={activeTrek.gallery?.[0] || slide.image}
                  alt={activeTrek.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/15 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                    Featured expedition
                  </p>
                  <h2 className="font-heading mt-2 text-3xl font-bold text-white">
                    {activeTrek.title}
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                    {activeTrek.mood}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-white/10">
                {[
                  [FaCalendarCheck, "Next batch", activeTrek.nextDeparture],
                  [FaMapMarkedAlt, "Route", activeTrek.region],
                  [FaShieldAlt, "Group size", activeTrek.groupSize],
                  [FaStar, "Rated", `${activeTrek.rating} by trekkers`],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="bg-primary-dark/70 p-5">
                    <Icon className="text-accent" />
                    <p className="mt-3 text-xs uppercase tracking-widest text-white/48">
                      {label}
                    </p>
                    <p className="mt-1 font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate(`/treks/${activeTrek.slug}`)}
                className="flex w-full items-center justify-between bg-white px-6 py-5 text-left font-semibold text-primary transition-colors hover:bg-surface"
              >
                Read the expedition story
                <FaArrowRight />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

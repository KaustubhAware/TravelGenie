import { motion } from "framer-motion";
import {
  FaClipboardCheck,
  FaMapMarkedAlt,
  FaRobot,
  FaShieldAlt,
  FaUsersCog,
} from "react-icons/fa";

import SectionHeader from "../../components/ui/SectionHeader";

const reasons = [
  {
    icon: FaClipboardCheck,
    title: "Request-first bookings",
    text: "Customers request a departure first. Operators approve availability, fit, and guide capacity before payment opens.",
  },
  {
    icon: FaUsersCog,
    title: "Operator-grade workflows",
    text: "Packages, departures, guides, customers, and analytics stay connected in one trekking operations workspace.",
  },
  {
    icon: FaShieldAlt,
    title: "Altitude-aware planning",
    text: "Trek pages surface acclimatization, camp movement, difficulty, weather context, and preparation guidance.",
  },
  {
    icon: FaRobot,
    title: "AI behind the expedition",
    text: "AI personalizes prep and recommendations without replacing fixed routes, guide judgment, or operator control.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-primary-dark shadow-card"
        >
          <img
            src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80"
            alt="Guided Himalayan trekking group"
            className="h-[520px] w-full object-cover opacity-80"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
              Operator controlled
            </p>
            <h3 className="font-heading mt-3 text-3xl font-bold">
              Real expeditions need review, timing, and guide judgment.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/72">
              TravelGenie keeps the mountain workflow human where it matters, while automation handles the repetitive work around it.
            </p>
          </div>
        </motion.div>

        <div>
          <SectionHeader
            eyebrow="Why TravelGenie"
            title="Built for trekking businesses, not generic tourism"
            description="The customer experience feels cinematic, while the operating model underneath stays realistic for group departures."
            align="left"
          />

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {reasons.map((reason, index) => (
              <motion.article
                key={reason.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                  <reason.icon />
                </div>
                <h3 className="font-heading mt-5 text-xl font-bold text-ink">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {reason.text}
                </p>
              </motion.article>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-primary/10 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <FaMapMarkedAlt />
              </div>
              <div>
                <p className="font-semibold text-ink">Treks stay the product.</p>
                <p className="mt-1 text-sm text-ink-muted">
                  AI supports planning, preparation, recommendations, and operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;

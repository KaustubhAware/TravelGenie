import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

import { testimonials } from "../../data/destinations";
import SectionHeader from "../../components/ui/SectionHeader";

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="bg-white py-20 md:py-28">
      <motion.div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Trekker stories"
          title="Trusted by adventurers & operators"
          description="Real feedback from Himalayan expeditions — premium operations, transparent bookings, AI that assists instead of replacing curated treks."
        />

        <motion.div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="flex h-full flex-col rounded-3xl bg-surface p-8 shadow-soft ring-1 ring-slate-100"
            >
              <motion.div className="flex gap-1 text-accent">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </motion.div>

              <p className="mt-6 flex-1 text-base leading-relaxed text-ink-muted">
                &ldquo;{item.quote}&rdquo;
              </p>

              <footer className="mt-8 flex items-center gap-4 border-t border-slate-200 pt-6">
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.avatar}
                </motion.div>
                <motion.div>
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="text-sm text-ink-muted">{item.role}</p>
                </motion.div>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;

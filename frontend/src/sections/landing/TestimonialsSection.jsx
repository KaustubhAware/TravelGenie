import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

import PageContainer from "../../components/ui/PageContainer";
import LandingSectionTitle from "../../components/landing/LandingSectionTitle";
import { landingService } from "../../services/landingService";

const initials = (name = "Traveler") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "TG";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    landingService
      .getApprovedReviews(3)
      .then((reviews) => {
        if (active) setTestimonials(reviews);
      })
      .catch(() => {
        if (active) setTestimonials([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="landing-section overflow-hidden">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <LandingSectionTitle lead="Trusted By" accent="Adventure Travelers" />
          <p className="landing-body mt-6 text-lg leading-relaxed">
            Real reviews from approved bookings and moderated feedback on the
            platform.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {(loading ? Array.from({ length: 3 }) : testimonials).map(
            (item, index) => {
              const name = item?.author_name || "TravelGenie Traveler";
              const rating = Number(item?.rating || 5);

              return (
                <motion.div
                  key={item?.review_id || item?.id || `review-skeleton-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="landing-card relative overflow-hidden rounded-[32px] p-8 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />

                  {loading ? (
                    <div className="space-y-4">
                      <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                      <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                      <div className="h-14 animate-pulse rounded-2xl bg-slate-100" />
                    </div>
                  ) : (
                    <>
                      <div className="relative z-10 flex items-center gap-1 text-orange-500">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <FaStar
                            key={starIndex}
                            className={
                              starIndex < rating ? "opacity-100" : "opacity-25"
                            }
                          />
                        ))}
                      </div>

                      <p className="relative z-10 mt-6 leading-relaxed text-slate-600">
                        "{item.review_text}"
                      </p>

                      <div className="relative z-10 mt-8 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-lg font-black text-orange-600">
                          {initials(name)}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#08112b]">{name}</h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Verified TravelGenie review
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            }
          )}
        </div>

        {!loading && testimonials.length === 0 && (
          <p className="mt-10 text-center text-slate-500">
            Approved testimonials will appear here after customers submit reviews.
          </p>
        )}
      </PageContainer>
    </section>
  );
}

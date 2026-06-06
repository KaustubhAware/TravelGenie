import { useEffect, useState } from "react";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/ui/PageContainer";
import LandingSectionTitle from "../../components/landing/LandingSectionTitle";
import { landingService } from "../../services/landingService";
import { resolveDestinationImage } from "../../utils/imageUrl";

export default function FeaturedDestinationsSection() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    landingService
      .getFeaturedPackages(12)
      .then((packages) => {
        if (!active) return;
        setDestinations(landingService.getFeaturedDestinations(packages, 6));
      })
      .catch(() => {
        if (active) setDestinations([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!loading && destinations.length === 0) {
    return null;
  }

  return (
    <section className="landing-section-warm overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08),transparent_55%)]" />

      <PageContainer className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="landing-eyebrow text-sm">
            Maharashtra Highlights
          </p>
          <LandingSectionTitle
            lead="Featured"
            accent="Destinations"
            className="!mt-4"
          />
          <p className="landing-body mt-4 text-lg">
            Live trek locations pulled from active packages on the platform.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(loading ? Array.from({ length: 3 }) : destinations).map((item, index) => (
            <motion.article
              key={item?.id || `destination-skeleton-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="landing-card group overflow-hidden rounded-[28px]"
            >
              <div className="relative h-56 overflow-hidden">
                {loading ? (
                  <div className="h-full animate-pulse bg-white/10" />
                ) : (
                  <>
                    <img
                      src={resolveDestinationImage(item.image, item.name)}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = "/maharashtra-map.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08112b]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <div className="flex items-center gap-2 text-sm text-orange-100">
                        <FaMapMarkerAlt />
                        {item.region}
                      </div>
                      <h3 className="mt-2 text-2xl font-black text-white">{item.name}</h3>
                    </div>
                  </>
                )}
              </div>

              {!loading && (
                <div className="flex items-center justify-between px-6 py-5">
                  <p className="text-sm text-slate-600">
                    {item.packageCount} active package
                    {item.packageCount === 1 ? "" : "s"}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        item.slug
                          ? `/dashboard/packages/${item.slug}`
                          : "/dashboard/packages"
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Explore
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

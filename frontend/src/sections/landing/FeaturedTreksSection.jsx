import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaStar,
  FaMountain,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/ui/PageContainer";
import LandingSectionTitle from "../../components/landing/LandingSectionTitle";
import { landingService } from "../../services/landingService";
import { resolveDestinationImage } from "../../utils/imageUrl";

const formatPrice = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function FeaturedTreksSection() {
  const navigate = useNavigate();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    landingService
      .getFeaturedPackages(3)
      .then((packages) => {
        if (active) setTreks(packages);
      })
      .catch(() => {
        if (active) setTreks([]);
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
          <LandingSectionTitle lead="Explore The" accent="Sahyadri" />
          <p className="landing-body mt-6 text-lg leading-relaxed">
            Featured packages from verified vendors — real pricing, locations,
            and trek details from the database.
          </p>
        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {(loading ? Array.from({ length: 3 }) : treks).map((trek, index) => (
            <motion.div
              key={trek?.id || `trek-skeleton-${index}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="landing-card group overflow-hidden rounded-[32px] transition-all duration-500 hover:-translate-y-3"
            >
              <div className="relative h-[340px] overflow-hidden">
                {loading ? (
                  <div className="h-full animate-pulse bg-slate-200" />
                ) : (
                  <>
                    <img
                      src={resolveDestinationImage(
                        trek.featured_image || trek.image,
                        trek.location || trek.title
                      )}
                      alt={trek.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = "/maharashtra-map.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    {trek.featured && (
                      <div className="absolute left-5 top-5 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-lg">
                        Featured
                      </div>
                    )}
                    <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 backdrop-blur-md">
                      <FaStar className="text-orange-500" />
                      {Number(trek.rating || 0).toFixed(1)}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 text-sm text-white/90">
                        <FaMapMarkerAlt />
                        {trek.location || trek.region || "Maharashtra"}
                      </div>
                      <h3 className="mt-3 text-3xl font-black text-white">
                        {trek.title}
                      </h3>
                    </div>
                  </>
                )}
              </div>

              {!loading && (
                <div className="p-7">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
                      <FaMountain />
                      {trek.difficulty || "Moderate"}
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      <FaCalendarAlt />
                      {trek.duration || trek.best_season || "Seasonal departures"}
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Starting From</p>
                      <h4 className="mt-1 text-4xl font-black text-[#08112b]">
                        {formatPrice(trek.price || trek.seasonal_price)}
                      </h4>
                      {trek.total_reviews > 0 && (
                        <p className="mt-2 text-sm font-medium text-orange-500">
                          {trek.total_reviews} verified review
                          {trek.total_reviews === 1 ? "" : "s"}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          trek.slug
                            ? `/dashboard/packages/${trek.slug}`
                            : "/dashboard/packages"
                        )
                      }
                      className="landing-btn-primary px-6 py-3 text-sm font-semibold"
                    >
                      Explore
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {!loading && treks.length === 0 && (
          <p className="mt-10 text-center text-slate-500">
            Featured treks will appear once vendors publish active packages.
          </p>
        )}
      </PageContainer>
    </section>
  );
}

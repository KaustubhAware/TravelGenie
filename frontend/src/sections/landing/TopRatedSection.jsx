import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import PageContainer from "../../components/ui/PageContainer";
import LandingSectionTitle from "../../components/landing/LandingSectionTitle";
import { landingService } from "../../services/landingService";
import { resolveDestinationImage } from "../../utils/imageUrl";

export default function TopRatedSection() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    landingService
      .getTopRatedPackages(4)
      .then((items) => {
        if (active) setPackages(items);
      })
      .catch(() => active && setPackages([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (!loading && packages.length === 0) return null;

  return (
    <section className="landing-section">
      <PageContainer>
        <div className="mb-10 text-center">
          <p className="landing-eyebrow text-sm">Top Rated</p>
          <LandingSectionTitle
            lead="Highest Rated"
            accent="Experiences"
            className="!mt-3"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {(loading ? Array.from({ length: 4 }) : packages).map((pkg, index) => (
            <article
              key={pkg?.id || `top-rated-${index}`}
              className="landing-card overflow-hidden rounded-[28px] transition hover:-translate-y-1 hover:shadow-lg"
            >
              {loading ? (
                <div className="h-40 animate-pulse bg-slate-100" />
              ) : (
                <>
                  <img
                    src={resolveDestinationImage(
                      pkg.featured_image,
                      pkg.location || pkg.title
                    )}
                    alt={pkg.title}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/maharashtra-map.png";
                    }}
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                        <FaStar />
                        {Number(pkg.rating || 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {pkg.total_reviews || 0} reviews
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-black text-slate-900 line-clamp-2">
                      {pkg.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <FaMapMarkerAlt className="text-orange-500" />
                      {pkg.location}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/packages/${pkg.slug}`)}
                      className="landing-btn-primary mt-4 w-full py-2.5 text-sm font-semibold"
                    >
                      View Package
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}

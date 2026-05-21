import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  FaArrowRight,
  FaClock,
  FaMapMarkerAlt,
  FaMountain,
  FaStar,
} from "react-icons/fa";

import {
  API_BASE,
} from "../../services/httpClient";

const FeaturedTreksSection = () => {

  const navigate =
    useNavigate();

  const [packages, setPackages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchPackages =
      async () => {

        try {

          const res = await fetch(
            `${API_BASE}/packages`
          );

          const data =
            await res.json();

          setPackages(
            (data.packages || [])
              .slice(0, 4)
          );

        } catch (error) {

          console.error(
            "FEATURED PACKAGE ERROR:",
            error
          );

        } finally {

          setLoading(false);

        }

      };

    fetchPackages();

  }, []);

  return (

    <section className="bg-white py-24">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

          <div>

            <p className="uppercase tracking-[0.3em] text-orange-500 font-bold text-sm mb-5">

              Featured Adventures

            </p>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">

              Explore Maharashtra’s
              Best Treks & Escapes

            </h2>

            <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-2xl">

              Handpicked trekking,
              camping, fort trails,
              monsoon adventures,
              and weekend experiences
              across Maharashtra.

            </p>

          </div>

          <button
            onClick={() =>
              navigate(
                "/dashboard/packages"
              )
            }
            className="h-14 px-7 rounded-2xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-3 self-start"
          >

            View All Packages

            <FaArrowRight />

          </button>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-7 mt-16">

            {[1,2,3,4].map((item) => (

              <div
                key={item}
                className="h-[420px] rounded-[32px] bg-slate-100 animate-pulse"
              />

            ))}

          </div>

        ) : (

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
            }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="grid md:grid-cols-2 xl:grid-cols-4 gap-7 mt-16"
          >

            {packages.map((pkg) => (

              <motion.div
                key={pkg.id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 30,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                className="group bg-white border border-slate-200 rounded-[32px] overflow-hidden hover:shadow-2xl transition-all duration-500"
              >

                {/* IMAGE */}

                <div className="relative h-[250px] overflow-hidden">

                  <img
                    src={
                      pkg.featured_image ||

                      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2070&auto=format&fit=crop"
                    }
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* PRICE */}

                  <div className="absolute top-5 right-5 bg-white text-slate-900 rounded-2xl px-4 py-2 shadow-lg">

                    <p className="text-lg font-black">

                      ₹{pkg.price}

                    </p>

                  </div>

                </div>

                {/* CONTENT */}

                <div className="p-6">

                  <div className="flex items-start justify-between gap-4">

                    <h3 className="text-2xl font-black text-slate-900 leading-tight">

                      {pkg.title}

                    </h3>

                  </div>

                  {/* INFO */}

                  <div className="flex flex-wrap gap-4 mt-5 text-sm text-slate-500">

                    <div className="flex items-center gap-2">

                      <FaClock />

                      <span>

                        {pkg.duration}

                      </span>

                    </div>

                    <div className="flex items-center gap-2">

                      <FaMountain />

                      <span>

                        {pkg.difficulty || "Moderate"}

                      </span>

                    </div>

                    <div className="flex items-center gap-2">

                      <FaMapMarkerAlt />

                      <span>

                        {pkg.location}

                      </span>

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <p className="mt-5 text-slate-500 leading-relaxed min-h-[72px] line-clamp-3">

                    {pkg.short_description ||

                      "Experience premium trekking and adventure travel across Maharashtra."}

                  </p>

                  {/* RATING */}

                  <div className="flex items-center gap-2 mt-5">

                    <FaStar className="text-orange-400" />

                    <span className="font-black text-slate-900">

                      {pkg.rating || 4.8}

                    </span>

                  </div>

                  {/* BUTTON */}

                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/packages/${pkg.slug}`
                      )
                    }
                    className="w-full h-12 mt-7 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-black transition"
                  >

                    Explore Trek

                  </button>

                </div>

              </motion.div>

            ))}

          </motion.div>

        )}

      </div>

    </section>

  );

};

export default FeaturedTreksSection;
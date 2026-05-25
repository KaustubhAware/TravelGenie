import { FaStar } from "react-icons/fa";

import { motion } from "framer-motion";

import PageContainer from "../../components/ui/PageContainer";

export default function TestimonialsSection() {

  /* ===================================================== */
  /* TESTIMONIALS */
  /* ===================================================== */

  const testimonials = [

    {
      id: 1,
      name: "Aarav Sharma",
      role: "Weekend Trekker",
      image:
        "https://randomuser.me/api/portraits/men/32.jpg",
      review:
        "TravelGenie completely transformed how I discover trekking experiences in Maharashtra. The AI planning is genuinely useful.",
    },

    {
      id: 2,
      name: "Priya Mehta",
      role: "Solo Backpacker",
      image:
        "https://randomuser.me/api/portraits/women/44.jpg",
      review:
        "The booking flow, schedules, and curated monsoon treks make the entire experience feel premium and professional.",
    },

    {
      id: 3,
      name: "Rahul Patil",
      role: "Trek Organizer",
      image:
        "https://randomuser.me/api/portraits/men/76.jpg",
      review:
        "Managing departures, occupancy, and customer bookings from one dashboard is incredibly powerful for operators.",
    },

  ];

  return (

    <section className="relative py-16 bg-[#ececec] overflow-hidden">

      <PageContainer>

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="text-center max-w-3xl mx-auto"
        >

          

          {/* TITLE */}

          <h2 className="mt-7 text-4xl md:text-6xl font-black leading-tight text-[#08112b]">

            Trusted By

            <span className="block italic font-serif font-normal text-orange-500">

              Adventure Travelers

            </span>

          </h2>

          {/* DESCRIPTION */}

          <p className="mt-6 text-lg text-slate-600 leading-relaxed">

            Thousands of trekkers, campers,
            and travel enthusiasts trust
            TravelGenie for premium Maharashtra
            adventure experiences.

          </p>

        </motion.div>

        {/* ===================================================== */}
        {/* GRID */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-20">

          {testimonials.map((item, index) => (

            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{
                once: true,
              }}
              className="relative overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >

              {/* SOFT GLOW */}

              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />

              {/* STARS */}

              <div className="relative z-10 flex items-center gap-2 text-orange-500">

                {[...Array(5)].map((_, index) => (

                  <FaStar key={index} />

                ))}

              </div>

              {/* REVIEW */}

              <p className="relative z-10 mt-6 leading-relaxed text-slate-600">

                "{item.review}"

              </p>

              {/* USER */}

              <div className="relative z-10 flex items-center gap-4 mt-8">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />

                <div>

                  <h3 className="font-bold text-[#08112b]">

                    {item.name}

                  </h3>

                  <p className="mt-1 text-sm text-slate-500">

                    {item.role}

                  </p>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </PageContainer>

    </section>

  );

}
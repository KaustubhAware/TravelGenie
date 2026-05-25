import {
  FaMapMarkerAlt,
  FaStar,
  FaMountain,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";

import {
  motion,
} from "framer-motion";

import {
  useNavigate,
} from "react-router-dom";

import PageContainer from "../../components/ui/PageContainer";

export default function FeaturedTreksSection() {

  const navigate =
    useNavigate();

  /* ===================================================== */
  /* TREKS */
  /* ===================================================== */

  const treks = [

    {
      id: 1,
      title: "Kalsubai Peak Trek",
      location: "Igatpuri",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
      difficulty: "Hard",
      rating: 4.9,
      price: "₹1999",
      occupancy: 84,
      seatsLeft: 5,
      departure: "Next Saturday",
    },

    {
      id: 2,
      title: "Rajmachi Monsoon Trek",
      location: "Lonavala",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
      difficulty: "Moderate",
      rating: 4.8,
      price: "₹2499",
      occupancy: 72,
      seatsLeft: 9,
      departure: "This Weekend",
    },

    {
      id: 3,
      title: "Harishchandragad Trek",
      location: "Ahmednagar",
      image:
        "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop",
      difficulty: "Hard",
      rating: 4.9,
      price: "₹3299",
      occupancy: 91,
      seatsLeft: 3,
      departure: "Friday Night",
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

          
          <h2 className="mt-7 text-4xl md:text-6xl font-black leading-tight text-[#08112b]">

            Explore The

            <span className="block italic font-serif font-normal text-orange-500">

              Sahyadri

            </span>

          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed">

            Discover Maharashtra’s most loved
            trekking experiences with real-time
            departures, occupancy tracking,
            and curated weekend adventures.

          </p>

        </motion.div>

        {/* ===================================================== */}
        {/* GRID */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-20">

          {treks.map((trek, index) => (

            <motion.div
              key={trek.id}
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              viewport={{
                once: true,
              }}
              className="group overflow-hidden rounded-[32px] bg-white shadow-2xl transition-all duration-500 hover:-translate-y-3"
            >

              {/* IMAGE */}

              <div className="relative h-[340px] overflow-hidden">

                <img
                  src={trek.image}
                  alt={trek.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* OVERLAY */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* FEATURED */}

                <div className="absolute top-5 left-5 rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-lg">

                  Featured

                </div>

                {/* RATING */}

                <div className="absolute top-5 right-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-800 backdrop-blur-md">

                  <FaStar className="text-orange-500" />

                  {trek.rating}

                </div>

                {/* BOTTOM CONTENT */}

                <div className="absolute bottom-0 left-0 right-0 p-6">

                  <div className="flex items-center gap-2 text-sm text-white/90">

                    <FaMapMarkerAlt />

                    {trek.location}

                  </div>

                  <h3 className="mt-3 text-3xl font-black text-white">

                    {trek.title}

                  </h3>

                </div>

              </div>

              {/* CONTENT */}

              <div className="p-7">

                {/* META */}

                <div className="flex flex-wrap gap-3">

                  <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">

                    <FaMountain />

                    {trek.difficulty}

                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">

                    <FaCalendarAlt />

                    {trek.departure}

                  </div>

                </div>

                {/* OCCUPANCY */}

                <div className="mt-7">

                  <div className="flex items-center justify-between text-sm text-slate-600">

                    <span>

                      Occupancy

                    </span>

                    <span className="font-semibold">

                      {trek.occupancy}%

                    </span>

                  </div>

                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">

                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{
                        width: `${trek.occupancy}%`,
                      }}
                    />

                  </div>

                </div>

                {/* FOOTER */}

                <div className="mt-8 flex items-center justify-between">

                  <div>

                    <p className="text-sm text-slate-500">

                      Starting From

                    </p>

                    <h4 className="mt-1 text-4xl font-black text-[#08112b]">

                      {trek.price}

                    </h4>

                    <div className="mt-2 flex items-center gap-2 text-sm text-orange-500 font-medium">

                      <FaUsers />

                      {trek.seatsLeft} seats left

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        "/dashboard/packages"
                      )
                    }
                    className="rounded-2xl bg-[#08112b] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#12204a]"
                  >

                    Explore

                  </button>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </PageContainer>

    </section>

  );

}
import {
  motion,
} from "framer-motion";

import {
  FaStar,
} from "react-icons/fa";

const testimonials = [

  {
    id: 1,
    name: "Rahul Patil",
    role: "Weekend Trekker",
    rating: 5,
    quote:
      "TravelGenie made our Rajmachi trek experience seamless. Booking, planning, and coordination felt extremely professional.",
  },

  {
    id: 2,
    name: "Sneha Joshi",
    role: "Adventure Explorer",
    rating: 5,
    quote:
      "The AI planner and curated packages helped us discover hidden places in Maharashtra we never knew existed.",
  },

  {
    id: 3,
    name: "Amit Kulkarni",
    role: "Group Organizer",
    rating: 5,
    quote:
      "Clean booking workflow, excellent trek planning, and very organized communication from the operators.",
  },

];

const TestimonialsSection = () => {

  return (

    <section className="bg-[#f8fafc] py-24">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <div className="text-center max-w-3xl mx-auto">

          <p className="uppercase tracking-[0.3em] text-orange-500 font-bold text-sm mb-5">

            Trekker Stories

          </p>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">

            Trusted By Adventure
            Travelers Across Maharashtra

          </h2>

          <p className="mt-6 text-lg text-slate-500 leading-relaxed">

            Real feedback from trekkers,
            campers, and travel groups
            using TravelGenie for curated adventures.

          </p>

        </div>

        {/* CARDS */}

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          {testimonials.map((item, index) => (

            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              viewport={{
                once: true,
              }}
              className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition"
            >

              {/* STARS */}

              <div className="flex gap-1 text-orange-400">

                {Array.from({
                  length: item.rating,
                }).map((_, i) => (

                  <FaStar key={i} />

                ))}

              </div>

              {/* QUOTE */}

              <p className="mt-6 text-slate-600 leading-relaxed">

                "{item.quote}"

              </p>

              {/* USER */}

              <div className="mt-8 pt-6 border-t border-slate-200">

                <h4 className="font-black text-slate-900">

                  {item.name}

                </h4>

                <p className="text-slate-500 mt-1">

                  {item.role}

                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>

  );

};

export default TestimonialsSection;
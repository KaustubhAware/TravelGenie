import {
  FaStar,
} from "react-icons/fa";

import PageContainer from "../../components/ui/PageContainer";

import SectionHeader from "../../components/ui/SectionHeader";

import Card from "../../components/ui/Card";

export default function TestimonialsSection() {

  /* ===================================================== */
  /* TESTIMONIALS */
  /* ===================================================== */

  const testimonials = [

    {
      id: 1,
      name: "Aarav Sharma",
      role: "Adventure Traveler",
      image:
        "https://randomuser.me/api/portraits/men/32.jpg",
      review:
        "TravelGenie completely changed how I plan trekking trips. The AI itinerary recommendations were surprisingly accurate and saved a lot of time.",
    },

    {
      id: 2,
      name: "Priya Mehta",
      role: "Solo Backpacker",
      image:
        "https://randomuser.me/api/portraits/women/44.jpg",
      review:
        "The booking workflow and curated trek suggestions made the experience feel extremely professional and easy to manage.",
    },

    {
      id: 3,
      name: "Rahul Patil",
      role: "Trek Organizer",
      image:
        "https://randomuser.me/api/portraits/men/76.jpg",
      review:
        "As a trek operator, managing clients and bookings through one platform is incredibly useful. The admin workflow is very clean.",
    },

  ];

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <section className="py-28 bg-white">

      <PageContainer>

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <SectionHeader
          badge="Testimonials"
          title="What Travelers Are Saying"
          description="Thousands of travelers and adventure enthusiasts trust TravelGenie for smarter trip planning and seamless booking experiences."
        />

        {/* ===================================================== */}
        {/* GRID */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-16">

          {testimonials.map((item) => (

            <Card
              key={item.id}
              className="h-full"
            >

              {/* STARS */}

              <div className="flex items-center gap-2 text-yellow-400">

                {[...Array(5)].map((_, index) => (

                  <FaStar key={index} />

                ))}

              </div>

              {/* REVIEW */}

              <p className="mt-6 text-slate-600 leading-relaxed">

                "{item.review}"

              </p>

              {/* USER */}

              <div className="flex items-center gap-4 mt-8">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-2xl object-cover"
                />

                <div>

                  <h3 className="font-black text-slate-900">

                    {item.name}

                  </h3>

                  <p className="text-sm text-slate-500 mt-1">

                    {item.role}

                  </p>

                </div>

              </div>

            </Card>

          ))}

        </div>

      </PageContainer>

    </section>

  );

}
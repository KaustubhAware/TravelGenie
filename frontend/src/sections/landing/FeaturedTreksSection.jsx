import {
  FaMapMarkerAlt,
  FaStar,
  FaMountain,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import PageContainer from "../../components/ui/PageContainer";

import SectionHeader from "../../components/ui/SectionHeader";

import Card from "../../components/ui/Card";

import Button from "../../components/ui/Button";

import Badge from "../../components/ui/Badge";

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
      location: "Nashik",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
      difficulty: "Easy",
      rating: 4.9,
      price: "₹1499",
    },

    {
      id: 2,
      title: "Rajmachi Adventure",
      location: "Lonavala",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
      difficulty: "Moderate",
      rating: 4.8,
      price: "₹2499",
    },

    {
      id: 3,
      title: "Harishchandragad",
      location: "Ahmednagar",
      image:
        "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop",
      difficulty: "Hard",
      rating: 4.9,
      price: "₹3299",
    },

  ];

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <section className="py-28">

      <PageContainer>

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <SectionHeader
          badge="Featured Treks"
          title="Explore Top Adventure Experiences"
          description="Curated trekking experiences designed for explorers, adventure seekers, and travel enthusiasts."
        />

        {/* ===================================================== */}
        {/* GRID */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-16">

          {treks.map((trek) => (

            <Card
              key={trek.id}
              className="overflow-hidden p-0"
            >

              {/* IMAGE */}

              <div className="relative h-72 overflow-hidden">

                <img
                  src={trek.image}
                  alt={trek.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />

                <div className="absolute top-5 left-5">

                  <Badge>

                    Featured

                  </Badge>

                </div>

              </div>

              {/* CONTENT */}

              <div className="p-6">

                {/* TOP */}

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h3 className="text-2xl font-black text-slate-900">

                      {trek.title}

                    </h3>

                    <div className="flex items-center gap-2 mt-3 text-slate-500">

                      <FaMapMarkerAlt />

                      <span>

                        {trek.location}

                      </span>

                    </div>

                  </div>

                  <div className="flex items-center gap-2 text-yellow-500 font-bold">

                    <FaStar />

                    {trek.rating}

                  </div>

                </div>

                {/* META */}

                <div className="flex items-center gap-4 mt-6">

                  <Badge variant="info">

                    <FaMountain className="mr-2" />

                    {trek.difficulty}

                  </Badge>

                </div>

                {/* FOOTER */}

                <div className="flex items-center justify-between mt-8">

                  <div>

                    <p className="text-sm text-slate-500">

                      Starting From

                    </p>

                    <h4 className="text-3xl font-black text-slate-900">

                      {trek.price}

                    </h4>

                  </div>

                  <Button
                    onClick={() =>
                      navigate(
                        "/dashboard/packages"
                      )
                    }
                  >

                    Explore

                  </Button>

                </div>

              </div>

            </Card>

          ))}

        </div>

      </PageContainer>

    </section>

  );

}
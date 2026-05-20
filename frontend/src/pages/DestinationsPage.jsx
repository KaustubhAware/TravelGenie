import { useNavigate } from "react-router-dom";

import DestinationCard from "../components/trek/DestinationCard";
import PageHero from "../components/ui/PageHero";
import SectionContainer from "../components/ui/SectionContainer";
import SectionHeading from "../components/ui/SectionHeading";
import { trekDestinations } from "../data/destinations";
import { featuredTreks } from "../data/featuredTreks";

const DestinationsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHero
        eyebrow="Himalayan regions"
        title="Explore trekking destinations built for real expeditions"
        description="Discover operating regions, seasonal routes, trek density, and curated adventures across the Himalayas."
        image="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80"
        primaryAction={{ label: "Browse Treks", onClick: () => navigate("/treks") }}
      />

      <SectionContainer>
          <SectionHeading
            eyebrow="Region catalog"
            title="Choose the landscape, then the expedition"
            description="Each destination links into curated treks and fixed departures instead of generic hotel or flight inventory."
            align="left"
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trekDestinations.map((destination, index) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                index={index}
                onExplore={() => navigate("/treks")}
              />
            ))}
          </div>
      </SectionContainer>

      <SectionContainer className="bg-white">
          <SectionHeading
            eyebrow="Featured adventures"
            title="Popular departures from these regions"
            align="left"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {featuredTreks.map((trek) => (
              <button
                key={trek.id}
                type="button"
                onClick={() => navigate(`/treks/${trek.slug}`)}
                className="group overflow-hidden rounded-3xl bg-surface text-left shadow-soft ring-1 ring-slate-100"
              >
                <img
                  src={trek.image}
                  alt={trek.title}
                  className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    {trek.region}
                  </p>
                  <h3 className="font-heading mt-2 text-lg font-bold text-ink">
                    {trek.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-muted">{trek.nextDeparture}</p>
                </div>
              </button>
            ))}
          </div>
      </SectionContainer>
    </>
  );
};

export default DestinationsPage;

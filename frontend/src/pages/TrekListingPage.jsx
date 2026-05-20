import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFilter, FaSearch, FaSortAmountDown } from "react-icons/fa";

import TrekCard from "../components/trek/TrekCard";
import SectionHeader from "../components/ui/SectionHeader";
import { featuredTreks } from "../data/featuredTreks";

const filters = {
  difficulty: ["All", "Easy-Moderate", "Moderate", "Moderate-Hard", "Hard"],
  region: [
    "All",
    "Garhwal Himalayas",
    "Kullu-Lahaul",
    "Nanda Devi Biosphere",
    "Sonamarg Himalayas",
    "Eastern Himalaya",
    "Dhauladhar Range",
  ],
  duration: ["All", "2 Days", "5 Days", "6 Days", "7 Days", "8 Days"],
  season: ["All", "Winter", "Summer", "Monsoon", "Autumn"],
  altitude: ["All", "Under 13,000 ft", "13,000 - 15,000 ft", "Above 15,000 ft"],
};

const getAltitudeNumber = (altitude) => Number(String(altitude).replace(/[^\d]/g, ""));

const TrekListingPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    difficulty: "All",
    region: "All",
    duration: "All",
    season: "All",
    altitude: "All",
  });
  const [sort, setSort] = useState("recommended");

  const filteredTreks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return featuredTreks
      .filter((trek) => {
        const matchesQuery =
          !normalizedQuery ||
          [trek.title, trek.location, trek.region, trek.difficulty]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

        const altitude = getAltitudeNumber(trek.altitude);
        const matchesAltitude =
          activeFilters.altitude === "All" ||
          (activeFilters.altitude === "Under 13,000 ft" && altitude < 13000) ||
          (activeFilters.altitude === "13,000 - 15,000 ft" && altitude >= 13000 && altitude <= 15000) ||
          (activeFilters.altitude === "Above 15,000 ft" && altitude > 15000);

        const matchesSeason =
          activeFilters.season === "All" ||
          trek.season.toLowerCase().includes(activeFilters.season.toLowerCase().slice(0, 3));

        return (
          matchesQuery &&
          (activeFilters.difficulty === "All" || trek.difficulty === activeFilters.difficulty) &&
          (activeFilters.region === "All" || trek.region === activeFilters.region) &&
          (activeFilters.duration === "All" || trek.duration === activeFilters.duration) &&
          matchesSeason &&
          matchesAltitude
        );
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews;
      });
  }, [activeFilters, query, sort]);

  const setFilter = (key, value) => {
    setActiveFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <>
      <section className="relative overflow-hidden bg-primary-dark pb-20 pt-36 text-white md:pt-44">
        <img
          src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80"
          alt="Himalayan trekking trail"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/80 to-primary/45" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">
              Curated trek catalog
            </p>
            <h1 className="font-heading mt-5 text-5xl font-bold leading-tight md:text-6xl">
              Browse operator-ready Himalayan departures
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/78">
              Search fixed expedition packages, compare trail difficulty, and choose a departure before the booking review workflow begins.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-surface py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-5 shadow-card ring-1 ring-slate-100">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <label className="relative block">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by trek, region, difficulty, or state"
                  className="w-full rounded-2xl border border-slate-200 bg-surface py-4 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </label>

              <label className="relative block">
                <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-surface py-4 pl-11 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Highest rated</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {Object.entries(filters).map(([key, values]) => (
                <label key={key} className="flex items-center gap-2 rounded-2xl bg-surface px-3 py-2">
                  <FaFilter className="text-xs text-primary" />
                  <select
                    value={activeFilters[key]}
                    onChange={(event) => setFilter(key, event.target.value)}
                    className="bg-transparent text-sm font-medium capitalize text-ink outline-none"
                  >
                    {values.map((value) => (
                      <option key={value} value={value}>
                        {key}: {value}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow={`${filteredTreks.length} treks available`}
            title="Trekking packages with real operations context"
            description="Each card connects to itinerary, departures, altitude notes, weather guidance, and AI customization without replacing curated packages."
            align="left"
          />

          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredTreks.map((trek, index) => (
              <TrekCard
                key={trek.id}
                trek={trek}
                index={index}
                onView={(selected) => navigate(`/treks/${selected.slug}`)}
              />
            ))}
          </div>

          {filteredTreks.length === 0 && (
            <div className="mt-12 rounded-3xl border border-dashed border-primary/30 bg-white p-10 text-center">
              <h3 className="font-heading text-2xl font-bold text-ink">
                No treks match these filters
              </h3>
              <p className="mt-3 text-ink-muted">
                Try widening the region, season, or altitude range.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TrekListingPage;

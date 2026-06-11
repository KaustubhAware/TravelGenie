import { lazy, Suspense, useMemo, useState } from "react";
import { ChevronDown, Download, ExternalLink } from "lucide-react";

import WeatherCard from "./WeatherCard";

const TravelMap = lazy(() => import("./TravelMap"));

const pick = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const textValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return (
    value.title ||
    value.name ||
    value.place ||
    value.description ||
    value.summary ||
    value.notes ||
    ""
  );
};

const asArray = (value) => {
  if (Array.isArray(value)) return value.map(textValue).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const briefText = (value, maxLength = 260) => {
  const text = textValue(value).replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
};

const numberValue = (value) => {
  const numeric = Number(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const hasBudget = (value) => numberValue(value) > 0;

const formatBudget = (value) => {
  const numeric = numberValue(value);
  return numeric ? `Rs ${numeric.toLocaleString("en-IN")}` : "Budget Not Specified";
};

const normalizeTransport = (transport = {}, recommendations = []) => {
  if (Array.isArray(transport)) return { notes: asArray(transport) };

  return {
    nearest_airport: pick(transport.nearest_airport, transport.airport),
    nearest_railway_station: pick(
      transport.nearest_railway_station,
      transport.railway_station,
      transport.train_station
    ),
    bus_availability: pick(transport.bus_availability, transport.bus, transport.buses),
    road_conditions: pick(transport.road_conditions, transport.road),
    estimated_travel_time: pick(
      transport.estimated_travel_time,
      transport.travel_time,
      transport.duration
    ),
    notes: asArray(recommendations),
  };
};

const buildPackingGroups = (packingList = [], packing = {}) => {
  if (packing && typeof packing === "object" && !Array.isArray(packing)) {
    return {
      Clothing: asArray(packing.clothing),
      Footwear: asArray(packing.footwear),
      Electronics: asArray(packing.electronics),
      "Safety Items": asArray(packing.safety_items || packing.safety),
      "Medical Items": asArray(packing.medical_items || packing.medical),
    };
  }

  const list = asArray(packingList);
  return {
    Clothing: list.filter((item) => /jacket|shirt|pant|rain|wear|clothes|thermal/i.test(item)),
    Footwear: list.filter((item) => /shoe|sandal|sock|foot/i.test(item)),
    Electronics: list.filter((item) => /phone|charger|power|camera|torch|battery/i.test(item)),
    "Safety Items": list.filter((item) => /id|cash|whistle|safety|permit|document|rope/i.test(item)),
    "Medical Items": list.filter((item) => /first|medicine|medical|bandage|tablet|kit/i.test(item)),
  };
};

const slots = [
  { key: "morning", label: "Morning" },
  { key: "afternoon", label: "Afternoon" },
  { key: "evening", label: "Evening" },
];

const slotFromActivity = (activity, index) => {
  const text = `${activity?.time || ""} ${activity?.timing || ""} ${textValue(activity)}`.toLowerCase();
  if (text.includes("morning") || text.includes("breakfast") || text.includes("sunrise")) return "morning";
  if (text.includes("evening") || text.includes("dinner") || text.includes("sunset") || text.includes("night")) return "evening";
  if (text.includes("afternoon") || text.includes("lunch")) return "afternoon";
  return slots[Math.min(index, slots.length - 1)].key;
};

const normalizeDaySlots = (day) => {
  const normalized = slots.reduce((acc, slot) => {
    const value = day?.[slot.key] || day?.[slot.label] || day?.[slot.key]?.activities;
    acc[slot.key] = Array.isArray(value)
      ? value.map(textValue).filter(Boolean)
      : [textValue(value)].filter(Boolean);
    return acc;
  }, {});

  const activities = Array.isArray(day?.activities) ? day.activities : [];
  activities.forEach((activity, index) => {
    const slot = slotFromActivity(activity, index);
    const text = textValue(activity);
    if (text) normalized[slot].push(text);
  });

  if (!activities.length && !slots.some((slot) => normalized[slot.key].length) && day?.description) {
    normalized.morning.push(day.description);
  }

  return normalized;
};

export default function AITripResult({ result = {}, saveTrip, saving, form = {} }) {
  const [activeDay, setActiveDay] = useState(0);

  const {
    itinerary = [],
    recommendations = [],
    estimated_cost = 0,
    budget_breakdown = {},
    trip_summary = {},
    travel_tips = [],
    packing_list = [],
    safety_notes = [],
    hotel_recommendations = [],
    restaurant_recommendations = [],
    weather = {},
    transport = {},
    transport_recommendations = [],
    nearby_attractions = [],
    emergency_information = {},
    emergency_info = {},
    packing = {},
    best_season = "",
  } = result;

  const destination = pick(trip_summary.destination, form.destination, "Maharashtra");
  const duration = pick(trip_summary.duration, form.days && `${form.days} Days`, "Custom duration");
  const budgetSource = pick(form.budget, result.requested_budget, estimated_cost);
  const budget = formatBudget(budgetSource);
  const difficulty = pick(trip_summary.difficulty, result.difficulty, form.difficulty, "Moderate");
  const season = pick(best_season, trip_summary.best_season, weather.best_season, "Seasonal guidance");

  const highlights = useMemo(
    () => asArray(trip_summary.highlights || trip_summary.trip_highlights || recommendations).slice(0, 5),
    [recommendations, trip_summary]
  );

  const tips = asArray(travel_tips).slice(0, 5);
  const summary = briefText(pick(trip_summary.summary, trip_summary.overview, result.summary), 300);
  const transportData = normalizeTransport(transport, transport_recommendations);
  const emergency = { ...emergency_info, ...emergency_information };
  const packingGroups = buildPackingGroups(packing_list, packing);

  const downloadTripPDF = async () => {
    const { exportTripPDF } = await import("../../utils/exportPDF");
    exportTripPDF("trip-pdf", destination);
  };

  return (
    <div id="trip-pdf" className="mx-auto max-w-5xl space-y-6 pb-8 font-sans">
      <CompactSummaryCard
        destination={destination}
        duration={duration}
        budget={budget}
        difficulty={difficulty}
        season={season}
        saveTrip={saveTrip}
        saving={saving}
      />

      <TripSummaryCard
        destination={destination}
        duration={duration}
        difficulty={difficulty}
        budget={budget}
        season={season}
        summary={summary}
        highlights={highlights}
        tips={tips}
      />

      <ItineraryCard itinerary={itinerary} activeDay={activeDay} setActiveDay={setActiveDay} />

      <BudgetCard breakdown={budget_breakdown} total={budgetSource} />

      <RecommendationsCard hotels={hotel_recommendations} restaurants={restaurant_recommendations} />

      <MapCard
        destination={destination}
        hotels={hotel_recommendations}
        restaurants={restaurant_recommendations}
        nearbyAttractions={nearby_attractions}
      />

      <MoreTravelInformation
        weather={weather}
        season={season}
        packingList={packing_list}
        packingGroups={packingGroups}
        travelTips={tips}
        emergency={emergency}
        safetyNotes={safety_notes}
        nearbyAttractions={nearby_attractions}
        transportData={transportData}
      />

      <button
        onClick={downloadTripPDF}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-orange-100 bg-white px-6 text-sm font-semibold text-orange-700 shadow-sm transition duration-200 hover:bg-orange-50 md:w-auto"
      >
        <Download size={18} />
        Download PDF
      </button>
    </div>
  );
}

function ResponseCard({ title, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function CompactSummaryCard({ destination, duration, budget, difficulty, season, saveTrip, saving }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
            Sara AI Trip Plan
          </p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight text-slate-950">
            {destination}
          </h1>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <SummaryFact label="Destination" value={destination} />
            <SummaryFact label="Duration" value={duration} />
            <SummaryFact label="Budget" value={budget} />
            <SummaryFact label="Difficulty" value={difficulty} />
            <SummaryFact label="Season" value={season} />
          </div>
        </div>
        <button
          onClick={saveTrip}
          disabled={saving}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Trip"}
        </button>
      </div>
    </section>
  );
}

function SummaryFact({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">
        {value || "To be confirmed"}
      </p>
    </div>
  );
}

function TripSummaryCard({ destination, duration, difficulty, budget, season, summary, highlights, tips }) {
  return (
    <ResponseCard title="Trip Overview">
      <div className="mt-6 space-y-6">
        <TextBlock
          title="Why this trip"
          body={summary || "A focused Maharashtra travel plan with balanced sightseeing, food, stays, safety, and route guidance."}
        />
        <ListBlock
          title="Travel tips"
          items={tips.length ? tips : highlights}
          fallback="Travel tips will appear after the AI plan includes them."
        />
      </div>
    </ResponseCard>
  );
}

function InfoPair({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-orange-600">{label}</p>
      <p className="mt-1 text-base leading-relaxed text-slate-800">{value || "To be confirmed"}</p>
    </div>
  );
}

function TextBlock({ title, body }) {
  return (
    <div>
      <p className="text-base font-semibold text-slate-950">{title}</p>
      <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-700">
        {briefText(body, 300)}
      </p>
    </div>
  );
}

function ListBlock({ title, items, fallback }) {
  const visibleItems = items.slice(0, 5);

  return (
    <div>
      <p className="text-base font-semibold text-slate-950">{title}</p>
      <div className="mt-3 space-y-3">
        {(visibleItems.length ? visibleItems : [fallback]).map((item, index) => (
          <p key={`${item}-${index}`} className="text-base leading-relaxed text-slate-700">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function ItineraryCard({ itinerary, activeDay, setActiveDay }) {
  if (!itinerary.length) {
    return (
      <ResponseCard title="Itinerary">
        <p className="mt-4 text-base leading-relaxed text-slate-500">
          Day-wise itinerary will appear after the AI plan includes it.
        </p>
      </ResponseCard>
    );
  }

  return (
    <ResponseCard title="Itinerary">
      <div className="mt-6 divide-y divide-slate-100">
        {itinerary.map((day, index) => {
          const open = activeDay === index;
          return (
            <div key={index}>
              <button
                type="button"
                onClick={() => setActiveDay(open ? -1 : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left transition duration-200 hover:text-orange-700"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-orange-600">
                    Day {day?.day || index + 1}
                  </p>
                  <h3 className="mt-1 truncate text-base font-semibold text-slate-950">
                    {day?.title || `Day ${index + 1}`}
                  </h3>
                </div>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && <DayTimeline day={day} />}
            </div>
          );
        })}
      </div>
    </ResponseCard>
  );
}

function DayTimeline({ day }) {
  const normalized = normalizeDaySlots(day);

  return (
    <div className="pb-7">
      <div className="space-y-6 border-l border-orange-100 pl-6">
        {slots.map(({ key, label }) => {
          const items = normalized[key].length
            ? normalized[key]
            : ["Details available in the generated itinerary."];
          return (
            <div key={key} className="relative">
              <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-orange-500 ring-4 ring-orange-50" />
              <p className="text-sm font-semibold text-slate-950">{label}</p>
              <div className="mt-3 space-y-2">
                {items.slice(0, 3).map((item, index) => (
                  <p key={`${key}-${index}`} className="text-base leading-relaxed text-slate-700">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BudgetCard({ breakdown = {}, total = 0 }) {
  const items = [
    ["Transport", breakdown.transport || breakdown.travel],
    ["Stay", breakdown.accommodation || breakdown.stay || breakdown.hotel],
    ["Food", breakdown.food],
    ["Activities", breakdown.activities || breakdown.sightseeing],
    ["Misc", breakdown.miscellaneous || breakdown.misc || breakdown.emergency],
  ];

  const computedTotal = hasBudget(total)
    ? numberValue(total)
    : items.reduce((sum, [, value]) => sum + numberValue(value), 0);
  const visibleItems = items.filter(([, value]) => hasBudget(value));
  const hasTotal = computedTotal > 0;

  return (
    <ResponseCard title="Budget Breakdown">
      <div className="mt-6 space-y-3">
        {visibleItems.length > 0 ? (
          visibleItems.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-6 border-b border-slate-100 py-3 last:border-b-0"
            >
              <span className="text-sm font-semibold text-slate-600">{label}</span>
              <span className="text-base font-semibold text-slate-950">{formatBudget(value)}</span>
            </div>
          ))
        ) : (
          <p className="text-base text-slate-500">Budget details will appear when available.</p>
        )}
      </div>
      <div className="mt-5 flex items-center justify-between gap-6 rounded-2xl bg-orange-50 px-5 py-4">
        <span className="text-sm font-semibold text-orange-700">Total</span>
        <span className="text-2xl font-semibold text-slate-950">
          {hasTotal ? formatBudget(computedTotal) : "Budget Not Specified"}
        </span>
      </div>
    </ResponseCard>
  );
}

function RecommendationsCard({ hotels, restaurants }) {
  const hasHotels = hotels.length > 0;
  const hasRestaurants = restaurants.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ResponseCard title="Hotel Recommendations">
        <RecommendationList
          items={hotels}
          fallback="Hotel recommendations will appear after the AI plan includes them."
          render={(hotel) => {
            const name = hotel.name || hotel.hotel_name || "Recommended hotel";
            const price = pick(hotel.price_range, hotel.price, hotel.estimated_price, hotel.cost);
            const distance = pick(hotel.distance, hotel.distance_from_destination, hotel.nearby, hotel.travel_time);
            const amenities = asArray(hotel.amenities).slice(0, 3).join(", ");
            return [
              ["Hotel", name],
              ["Price Range", price],
              ["Distance", distance],
              ["Amenities", amenities],
            ];
          }}
        />
      </ResponseCard>
      <ResponseCard title="Restaurant Recommendations">
        <RecommendationList
          items={restaurants}
          fallback="Restaurant recommendations will appear after the AI plan includes them."
          render={(restaurant) => {
            const name = restaurant.name || restaurant.restaurant_name || "Recommended restaurant";
            const cuisine = pick(restaurant.cuisine, restaurant.type);
            const distance = pick(restaurant.distance, restaurant.location, restaurant.area);
            const dishes = asArray(restaurant.recommended_dishes || restaurant.dishes || restaurant.best_dishes).slice(0, 3).join(", ");
            return [
              ["Restaurant", name],
              ["Cuisine", cuisine],
              ["Distance", distance],
              ["Recommended Dishes", dishes],
            ];
          }}
        />
      </ResponseCard>
      {!hasHotels && !hasRestaurants && (
        <p className="lg:col-span-2 text-base leading-relaxed text-slate-500">
          Sara will add stay and food recommendations when they are available in the generated plan.
        </p>
      )}
    </div>
  );
}

function RecommendationList({ items, fallback, render }) {
  const visibleItems = items.slice(0, 4);

  return (
      <div className="mt-5 space-y-3">
        {(visibleItems.length ? visibleItems : [fallback]).map((item, index) => (
          <div key={index} className="rounded-2xl bg-slate-50 px-4 py-4 text-base leading-relaxed text-slate-700">
            {typeof item === "string" ? (
              <p>{item}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {render(item)
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
  );
}

function MapCard({ destination, hotels, restaurants, nearbyAttractions }) {
  return (
    <ResponseCard title="Map">
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
        <Suspense fallback={<MapSkeleton />}>
          <TravelMap
            destination={destination}
            hotels={hotels}
            restaurants={restaurants}
            nearbyAttractions={nearbyAttractions}
            heightClass="h-[320px] sm:h-[380px]"
            showChrome={false}
          />
        </Suspense>
      </div>
    </ResponseCard>
  );
}

function MoreTravelInformation({
  weather,
  season,
  packingList,
  packingGroups,
  travelTips,
  emergency,
  safetyNotes,
  nearbyAttractions,
  transportData,
}) {
  const transportItems = [
    ["Nearest Airport", transportData.nearest_airport],
    ["Nearest Railway Station", transportData.nearest_railway_station],
    ["Bus Availability", transportData.bus_availability],
    ["Road Conditions", transportData.road_conditions],
    ["Estimated Travel Time", transportData.estimated_travel_time],
  ].filter(([, value]) => value);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ResponseCard title="Weather">
        <div className="mt-5">
          <WeatherCard weather={weather} bestSeason={season} packing={packingList} compact />
        </div>
      </ResponseCard>

      <ResponseCard title="Travel Tips">
        <SimpleList
          items={travelTips.length ? travelTips : transportData.notes || []}
          fallback="Travel tips will appear when Sara includes them in the trip plan."
        />
      </ResponseCard>

      <ResponseCard title="Packing Checklist">
        <PackingChecklist groups={packingGroups} />
      </ResponseCard>

      <ResponseCard title="Safety Information">
        <EmergencySection emergency={emergency} safetyNotes={safetyNotes} />
      </ResponseCard>

      {nearbyAttractions.length > 0 && (
        <ResponseCard title="Attractions">
          <div className="mt-5 grid gap-4">
            {nearbyAttractions.slice(0, 4).map((item, index) => (
              <AttractionCard key={index} attraction={item} />
            ))}
          </div>
        </ResponseCard>
      )}

      {(transportItems.length > 0 || transportData.notes?.length > 0) && (
        <ResponseCard title="Transport">
          <TransportDetails items={transportItems} notes={transportData.notes || []} />
        </ResponseCard>
      )}
    </div>
  );
}

function SimpleList({ items, fallback }) {
  const visibleItems = items.slice(0, 6);

  return (
    <div className="mt-5 space-y-3">
      {(visibleItems.length ? visibleItems : [fallback]).map((item, index) => (
        <p key={`${textValue(item)}-${index}`} className="text-base leading-relaxed text-slate-700">
          {textValue(item)}
        </p>
      ))}
    </div>
  );
}

function TransportDetails({ items, notes }) {
  return (
    <div className="mt-5 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-sm font-semibold text-orange-600">{label}</p>
            <p className="mt-1 text-base leading-relaxed text-slate-700">{value}</p>
          </div>
        ))}
      </div>
      {notes.length > 0 && <SimpleList items={notes} fallback="" />}
    </div>
  );
}

function Collapsible({ title, children, nested = false }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={nested ? "rounded-2xl bg-slate-50/70 px-5" : ""}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full items-center justify-between gap-4 text-left transition duration-200 hover:bg-slate-50 ${
          nested ? "px-0 py-5" : "px-6 py-6"
        }`}
      >
        <span className={`${nested ? "text-base" : "text-2xl"} font-semibold text-slate-950`}>
          {title}
        </span>
        <ChevronDown
          size={20}
          className={`shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className={nested ? "pb-6" : "px-6 pb-6"}>
          {children}
        </div>
      )}
    </div>
  );
}

function TransportInfo({ data }) {
  const items = [
    ["Nearest Airport", data.nearest_airport],
    ["Nearest Railway Station", data.nearest_railway_station],
    ["Bus Availability", data.bus_availability],
    ["Road Conditions", data.road_conditions],
    ["Estimated Travel Time", data.estimated_travel_time],
  ].filter(([, value]) => value);

  if (!items.length && !data.notes?.length) return null;

  return (
    <Collapsible title="Transport" nested>
      <div className="grid gap-5 md:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label}>
            <p className="text-sm font-semibold text-orange-600">{label}</p>
            <p className="mt-2 text-base leading-relaxed text-slate-700">{value}</p>
          </div>
        ))}
      </div>
      {data.notes?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.notes.slice(0, 5).map((note, index) => (
            <span
              key={`${textValue(note)}-${index}`}
              className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700"
            >
              {textValue(note)}
            </span>
          ))}
        </div>
      )}
    </Collapsible>
  );
}

function AttractionCard({ attraction }) {
  const name = typeof attraction === "string" ? attraction : pick(attraction.name, attraction.place, "Nearby attraction");
  const distance = typeof attraction === "object" ? pick(attraction.distance, attraction.travel_time) : "";
  const category = typeof attraction === "object" ? pick(attraction.category, attraction.type, "Attraction") : "Attraction";
  const description = typeof attraction === "object" ? pick(attraction.description, attraction.summary, attraction.notes) : "";
  const mapLink = typeof attraction === "object" ? pick(attraction.map_link, attraction.mapLink, attraction.google_maps_url) : "";

  return (
    <article className="rounded-2xl bg-slate-50/80 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-orange-600">{category}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">{name}</h3>
        </div>
        {distance && (
          <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-600">
            {distance}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          {briefText(description, 130)}
        </p>
      )}
      {mapLink && (
        <a
          href={mapLink}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-600"
        >
          Map Link
          <ExternalLink size={15} />
        </a>
      )}
    </article>
  );
}

function PackingChecklist({ groups }) {
  const visibleGroups = Object.entries(groups).filter(([, items]) => items.length > 0);
  if (!visibleGroups.length) {
    return <p className="text-base text-slate-500">Packing suggestions will appear when available.</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {visibleGroups.map(([label, items]) => (
        <div key={label}>
          <h3 className="text-base font-semibold text-slate-950">{label}</h3>
          <div className="mt-3 space-y-2">
            {items.slice(0, 6).map((item) => (
              <p key={item} className="text-base leading-relaxed text-slate-600">
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmergencySection({ emergency, safetyNotes }) {
  const items = [
    ["Nearest Hospital", pick(emergency.nearest_hospital, emergency.hospital)],
    ["Police Station", pick(emergency.police_station, emergency.nearest_police_station)],
    ["Emergency Numbers", pick(emergency.emergency_numbers, emergency.phone, emergency.contact)],
    ["Trek Rescue Information", pick(emergency.trek_rescue_information, emergency.rescue_info, emergency.trek_rescue)],
  ].filter(([, value]) => value);

  return (
    <div className="space-y-5">
      {items.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2">
          {items.map(([label, value]) => (
            <div key={label}>
              <p className="text-sm font-semibold text-orange-600">{label}</p>
              <p className="mt-2 text-base font-semibold leading-relaxed text-slate-800">
                {Array.isArray(value) ? value.join(", ") : value}
              </p>
            </div>
          ))}
        </div>
      )}
      {safetyNotes.length > 0 && (
        <div className="space-y-2">
          {safetyNotes.slice(0, 5).map((note, index) => (
            <p key={`${note}-${index}`} className="text-base leading-relaxed text-slate-700">
              {note}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-500">
      Loading map...
    </div>
  );
}

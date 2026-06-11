import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Edit3, MapPin, Trash2, WalletCards } from "lucide-react";

import BudgetBreakdownCard from "../../components/ai/BudgetBreakdownCard";
import DayPlanCard from "../../components/ai/DayPlanCard";
import HotelRecommendationCard from "../../components/ai/HotelRecommendationCard";
import PreferenceChips from "../../components/ai/PreferenceChips";
import RestaurantRecommendationCard from "../../components/ai/RestaurantRecommendationCard";
import WeatherCard from "../../components/ai/WeatherCard";
import { savedTripService } from "../../services/savedTripService";
import {
  groupHotelsByTier,
  groupRestaurantsByMeal,
} from "../../utils/recommendationGroups";

const TravelMap = lazy(() => import("../../components/ai/TravelMap"));

const safeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const safeObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {};
};

const numberValue = (value) => {
  const numeric = Number(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatBudget = (value) => {
  const numeric = numberValue(value);
  return numeric > 0 ? `Rs ${numeric.toLocaleString("en-IN")}` : "Budget Not Specified";
};

const textArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
  return [];
};

export default function SavedTrips() {
  const [trips, setTrips] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [renaming, setRenaming] = useState(false);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await savedTripService.list();
      setTrips(data);
      setSelectedId((current) => current || data[0]?.id || null);
    } catch (error) {
      toast.error(error.message || "Unable to load saved trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelected(null);
      return;
    }

    setDetailLoading(true);
    savedTripService
      .detail(selectedId)
      .then(setSelected)
      .catch((error) => toast.error(error.message || "Unable to load itinerary"))
      .finally(() => setDetailLoading(false));
  }, [selectedId]);

  const itinerary = useMemo(
    () => safeArray(selected?.itinerary),
    [selected]
  );
  const metadata = safeObject(selected?.metadata);
  const budgetBreakdown = safeObject(metadata.budget_breakdown);
  const recommendations = safeArray(metadata.recommendations || metadata.recommended_places);
  const weather = safeObject(metadata.weather);
  const travelTips = textArray(metadata.travel_tips);
  const packingList = textArray(metadata.packing_list);
  const safetyNotes = textArray(metadata.safety_notes);
  const nearbyAttractions = textArray(metadata.nearby_attractions || recommendations);
  const hotels = safeArray(metadata.hotel_recommendations);
  const restaurants = safeArray(
    metadata.restaurant_recommendations
  ).map((item) =>
    typeof item === "string" ? { name: item } : item
  );
  const hotelTiers = groupHotelsByTier(hotels);
  const mealGroups = groupRestaurantsByMeal(restaurants);

  const renameTrip = async () => {
    const currentTitle = selected?.title || selected?.destination || "";
    const title = window.prompt("Rename itinerary", currentTitle)?.trim();
    if (!title || title === currentTitle) return;

    setRenaming(true);
    try {
      await savedTripService.rename(selected.id, title);
      toast.success("Itinerary renamed");
      await loadTrips();
      setSelected((item) => ({
        ...item,
        title,
        metadata: { ...(item?.metadata || {}), title },
      }));
    } catch (error) {
      toast.error(error.message || "Rename failed");
    } finally {
      setRenaming(false);
    }
  };

  const deleteTrip = async (trip) => {
    if (!window.confirm(`Delete "${trip.title || trip.destination}"?`)) return;

    try {
      await savedTripService.remove(trip.id);
      toast.success("Itinerary deleted");
      const remaining = trips.filter((item) => item.id !== trip.id);
      setTrips(remaining);
      setSelectedId(remaining[0]?.id || null);
    } catch (error) {
      toast.error(error.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
          Saved AI Itineraries
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Saved Trips
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review AI trip details, maps, budgets, recommendations, and saved day plans.
            </p>
          </div>
          <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
            {trips.length} saved
          </span>
        </div>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading saved itineraries...
        </div>
      ) : trips.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-2xl font-black text-slate-900">No saved trips yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Save an AI planner result and it will appear here for later.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <aside className="space-y-3">
            {trips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => setSelectedId(trip.id)}
                className={`w-full rounded-3xl border p-5 text-left transition ${
                  selectedId === trip.id
                    ? "border-orange-200 bg-orange-50"
                    : "border-slate-200 bg-white hover:border-orange-200"
                }`}
              >
                <h2 className="text-lg font-black text-slate-900">
                  {trip.title || trip.destination}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1">
                    {trip.days || 1} day(s)
                  </span>
                  <span className="rounded-full bg-white px-3 py-1">
                    {formatBudget(trip.budget || trip.metadata?.requested_budget)}
                  </span>
                </div>
              </button>
            ))}
          </aside>

          <main className="space-y-5">
            {detailLoading || !selected ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                Loading itinerary details...
              </div>
            ) : (
              <>
                <section className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900">
                        {selected.title}
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                          <MapPin size={16} /> {selected.destination}
                        </span>
                        <span className="flex items-center gap-2">
                          <WalletCards size={16} />{" "}
                          {formatBudget(selected.budget || metadata.requested_budget)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={renameTrip}
                        disabled={renaming}
                        className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Edit3 size={16} />
                        Rename
                      </button>
                      <button
                        onClick={() => deleteTrip(selected)}
                        className="flex h-11 items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 text-sm font-bold text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </section>

                <Suspense fallback={<MapSkeleton />}>
                  <TravelMap
                    destination={selected.destination}
                    nearbyAttractions={recommendations}
                    hotels={hotels}
                    restaurants={restaurants}
                  />
                </Suspense>

                {hotels.length > 0 && (
                  <section className="space-y-5">
                    <h2 className="text-2xl font-black text-slate-900">Hotels</h2>
                    {[
                      { key: "budget", label: "Budget" },
                      { key: "mid", label: "Mid-Range" },
                      { key: "premium", label: "Premium" },
                    ].map(({ key, label }) =>
                      hotelTiers[key]?.length ? (
                        <div key={key}>
                          <h3 className="mb-3 font-bold text-slate-800">{label}</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            {hotelTiers[key].map((hotel, index) => (
                              <HotelRecommendationCard
                                key={`${key}-${hotel.name}-${index}`}
                                hotel={hotel}
                              />
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </section>
                )}

                {restaurants.length > 0 && (
                  <section className="space-y-5">
                    <h2 className="text-2xl font-black text-slate-900">Restaurants</h2>
                    {[
                      { key: "breakfast", label: "Breakfast" },
                      { key: "lunch", label: "Lunch" },
                      { key: "dinner", label: "Dinner" },
                    ].map(({ key, label }) =>
                      mealGroups[key]?.length ? (
                        <div key={key}>
                          <h3 className="mb-3 font-bold text-slate-800">{label}</h3>
                          <div className="grid gap-4 md:grid-cols-2">
                            {mealGroups[key].map((restaurant, index) => (
                              <RestaurantRecommendationCard
                                key={`${key}-${restaurant.name}-${index}`}
                                restaurant={restaurant}
                              />
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </section>
                )}

                {Object.keys(budgetBreakdown).length > 0 ? (
                  <BudgetBreakdownCard
                    breakdown={budgetBreakdown}
                    total={selected.budget || metadata.requested_budget || metadata.estimated_cost}
                  />
                ) : (
                  <section className="rounded-3xl border border-slate-200 bg-white p-6">
                    <h2 className="text-xl font-black text-slate-900">
                      Budget Breakdown
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Detailed budget data was not included in this saved itinerary.
                    </p>
                  </section>
                )}

                {(Object.keys(weather).length > 0 ||
                  travelTips.length > 0 ||
                  packingList.length > 0 ||
                  safetyNotes.length > 0 ||
                  nearbyAttractions.length > 0) && (
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-900">
                      Travel Information
                    </h2>
                    <div className="mt-5 grid gap-5 lg:grid-cols-2">
                      {Object.keys(weather).length > 0 && (
                        <WeatherCard
                          weather={weather}
                          bestSeason={metadata.best_season}
                          packing={packingList}
                          compact
                        />
                      )}
                      <InfoList title="Travel Tips" items={travelTips} />
                      <InfoList title="Packing Checklist" items={packingList} />
                      <InfoList title="Emergency Information" items={safetyNotes} />
                      <InfoList title="Nearby Attractions" items={nearbyAttractions} />
                    </div>
                  </section>
                )}

                {recommendations.length > 0 && (
                  <PreferenceChips recommendations={recommendations} />
                )}

                <section className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      Itinerary Details
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Day-wise AI plan saved for this trip.
                    </p>
                  </div>
                  {itinerary.length > 0 ? (
                    itinerary.map((day, index) => (
                      <DayPlanCard key={index} day={day} index={index} />
                    ))
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                      No day-wise itinerary content was saved.
                    </div>
                  )}
                </section>
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-slate-500">
      Loading map...
    </div>
  );
}

function InfoList({ title, items }) {
  if (!items.length) return null;

  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.slice(0, 6).map((item, index) => (
          <p key={`${title}-${index}`} className="text-sm leading-6 text-slate-600">
            {typeof item === "string" ? item : item.name || item.title || item.description}
          </p>
        ))}
      </div>
    </div>
  );
}

import {
  lazy,
  Suspense,
} from "react";

import BudgetCard from "./BudgetCard";
import BudgetBreakdownCard from "./BudgetBreakdownCard";
import PreferenceChips from "./PreferenceChips";
import DayPlanCard from "./DayPlanCard";
import TravelTipsCard from "./TravelTipsCard";

import HotelRecommendationCard from "./HotelRecommendationCard";
import RestaurantRecommendationCard from "./RestaurantRecommendationCard";

import WeatherCard from "./WeatherCard";

const TravelMap = lazy(() =>
  import("./TravelMap")
);

export default function AITripResult({
  result = {},
  saveTrip,
  saving,
  form,
}) {

  const downloadTripPDF = async () => {

    const { exportTripPDF } =
      await import("../../utils/exportPDF");

    exportTripPDF(
      "trip-pdf",
      form.destination
    );

  };

  /* ===================================================== */
  /* SAFE DATA */
  /* ===================================================== */

  const {
    itinerary = [],
    recommendations = [],
    estimated_cost = 0,
    sentiment = "Neutral",
    budget_breakdown = {},
    trip_summary = {},
    travel_tips = [],
    packing_list = [],
    safety_notes = [],
    hotel_recommendations = [],
    restaurant_recommendations = [],
    weather = {},
    crowd_insights = [],
    transport_recommendations = [],
    nearby_attractions = [],
    best_season = "",
  } = result;

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <div id="trip-pdf" className="space-y-5 pb-6">

      {/* ===================================================== */}
      {/* TOP CARDS */}
      {/* ===================================================== */}

      {Object.keys(trip_summary || {}).length > 0 && (
        <section className="rounded-3xl border border-orange-100 bg-orange-50/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
            Trip Summary
          </p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {trip_summary.destination || form.destination}
              </h2>
              {trip_summary.summary && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {trip_summary.summary}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              {[trip_summary.duration, trip_summary.travelers, trip_summary.trip_type]
                .filter(Boolean)
                .map((item) => (
                  <span key={item} className="rounded-full bg-white px-3 py-2 shadow-sm">
                    {item}
                  </span>
                ))}
            </div>
          </div>
        </section>
      )}

      <div className="grid xl:grid-cols-3 gap-4">

        <div className="xl:col-span-2">

          <BudgetCard
            cost={estimated_cost}
          />

        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">

          <p className="text-sm text-gray-500 mb-2">

            Travel Mood

          </p>

          <h2 className="text-2xl font-bold text-gray-900">

            {sentiment}

          </h2>

        </div>

      </div>

      {/* ===================================================== */}
      {/* WEATHER */}
      {/* ===================================================== */}

      {Object.keys(weather || {}).length > 0 && (

        <WeatherCard weather={weather} />

      )}

      {/* ===================================================== */}
      {/* MAP */}
      {/* ===================================================== */}

      <Suspense
        fallback={

          <div className="bg-white border border-gray-200 rounded-[28px] p-8 text-gray-500">

            Loading map insights...

          </div>

        }
      >

        <TravelMap
          destination={form.destination}
          hotels={hotel_recommendations}
          restaurants={restaurant_recommendations}
          nearbyAttractions={nearby_attractions}
        />

      </Suspense>

      {/* ===================================================== */}
      {/* RECOMMENDATIONS */}
      {/* ===================================================== */}

      {recommendations.length > 0 && (

        <PreferenceChips
          recommendations={recommendations}
        />

      )}

      {/* ===================================================== */}
      {/* BUDGET BREAKDOWN */}
      {/* ===================================================== */}

      {Object.keys(budget_breakdown || {}).length > 0 && (

        <BudgetBreakdownCard
          breakdown={budget_breakdown}
        />

      )}

      {/* ===================================================== */}
      {/* HOTELS */}
      {/* ===================================================== */}

      {hotel_recommendations.length > 0 && (

        <section>

          <div className="mb-6">

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">

              Hotel Recommendations

            </h2>

            <p className="text-gray-500 mt-1">

              AI suggested stays

            </p>

          </div>

          <div className="grid lg:grid-cols-2 gap-4">

            {hotel_recommendations.map(

              (hotel, index) => (

                <HotelRecommendationCard
                  key={index}
                  hotel={hotel}
                />

              )

            )}

          </div>

        </section>

      )}

      {/* ===================================================== */}
      {/* RESTAURANTS */}
      {/* ===================================================== */}

      {restaurant_recommendations.length > 0 && (

        <section>

          <div className="mb-6">

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">

              Restaurant Recommendations

            </h2>

            <p className="text-gray-500 mt-1">

              Popular nearby food spots

            </p>

          </div>

          <div className="grid lg:grid-cols-2 gap-4">

            {restaurant_recommendations.map(

              (restaurant, index) => (

                <RestaurantRecommendationCard
                  key={index}
                  restaurant={restaurant}
                />

              )

            )}

          </div>

        </section>

      )}

      {/* ===================================================== */}
      {/* CROWD INSIGHTS */}
      {/* ===================================================== */}

      {crowd_insights.length > 0 && (

        <section className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm">

          <div className="mb-6">

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">

              Crowd Insights

            </h2>

            <p className="text-gray-500 mt-1">

              AI predicted crowd conditions

            </p>

          </div>

          <div className="space-y-4">

            {crowd_insights.map((item, index) => (

              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-5"
              >

                <div className="flex items-center justify-between gap-4 flex-wrap">

                  <h3 className="text-lg font-bold text-gray-900">

                    {item.place}

                  </h3>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      item.crowd_level === "High"
                        ? "bg-red-100 text-red-600"
                        : item.crowd_level === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >

                    {item.crowd_level}

                  </span>

                </div>

                <p className="text-gray-500 mt-3">

                  Best Time: {item.best_time}

                </p>

              </div>

            ))}

          </div>

        </section>

      )}

      {/* ===================================================== */}
      {/* ITINERARY */}
      {/* ===================================================== */}

      {itinerary.length > 0 && (

        <section>

          <div className="mb-6">

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">

              AI Generated Itinerary

            </h2>

            <p className="text-gray-500 mt-2">

              Smart AI travel planning

            </p>

          </div>

          <div className="space-y-5">

            {itinerary.map((day, index) => (

              <DayPlanCard
                key={index}
                day={day}
                index={index}
              />

            ))}

          </div>

        </section>

      )}

      {/* ===================================================== */}
      {/* TRAVEL TIPS */}
      {/* ===================================================== */}

      {(packing_list.length > 0 || safety_notes.length > 0) && (
        <section className="grid gap-4 lg:grid-cols-2">
          {packing_list.length > 0 && (
            <ChecklistCard title="Packing Checklist" items={packing_list} />
          )}
          {safety_notes.length > 0 && (
            <ChecklistCard title="Safety Notes" items={safety_notes} tone="safety" />
          )}
        </section>
      )}

      {(nearby_attractions.length > 0 || transport_recommendations.length > 0 || best_season) && (
        <section className="grid gap-4 lg:grid-cols-3">
          {best_season && (
            <InfoListCard title="Best Season" items={[best_season]} />
          )}
          {nearby_attractions.length > 0 && (
            <InfoListCard title="Nearby Attractions" items={nearby_attractions} />
          )}
          {transport_recommendations.length > 0 && (
            <InfoListCard
              title="Transport"
              items={transport_recommendations.map((item) =>
                typeof item === "string"
                  ? item
                  : `${item.mode || "Route"}: ${item.route || item.notes || ""}`.trim()
              )}
            />
          )}
        </section>
      )}

      {travel_tips.length > 0 && (

        <TravelTipsCard
          tips={travel_tips}
        />

      )}

      {/* ===================================================== */}
      {/* ACTIONS */}
      {/* ===================================================== */}

      <div className="grid md:grid-cols-2 gap-3 pt-1">

        {/* PDF */}

        <button
          onClick={downloadTripPDF}
          className="h-12 rounded-2xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold transition"
        >

          Download PDF

        </button>

        {/* SAVE */}

        <button
          onClick={saveTrip}
          disabled={saving}
          className="h-12 rounded-2xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-semibold transition"
        >

          {saving ? "Saving..." : "Save Trip"}

        </button>

      </div>

    </div>

  );

}

function ChecklistCard({ title, items, tone = "default" }) {
  const accent =
    tone === "safety"
      ? "border-red-100 bg-red-50 text-red-700"
      : "border-orange-100 bg-orange-50 text-orange-700";

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex gap-3 text-sm text-slate-600">
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${accent}`}>
              {index + 1}
            </span>
            <span className="leading-6">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoListCard({ title, items }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.filter(Boolean).map((item, index) => (
          <div key={`${title}-${index}`} className="text-sm leading-6 text-slate-600">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

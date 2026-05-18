// =====================================================
// AI TRIP RESULT
// =====================================================

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
const TravelMap = lazy(() => import("./TravelMap"));

export default function AITripResult({
  result = {},
  saveTrip,
  saving,
  navigate,
  form,
}) {
  const downloadTripPDF = async () => {
    const { exportTripPDF } = await import(
      "../../utils/exportPDF"
    );

    exportTripPDF(
      "trip-pdf",
      form.destination
    );
  };

  // =====================================================
  // SAFE DATA
  // =====================================================

  const {

    itinerary = [],

    recommendations = [],

    estimated_cost = 0,

    sentiment = "Neutral",

    budget_breakdown = {},

    travel_tips = [],

    hotel_recommendations = [],

    restaurant_recommendations = [],

    weather = {},

    crowd_insights = [],

  } = result;

  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      id="trip-pdf"
      className="space-y-8 overflow-y-auto h-full pr-2"
    >

      {/* ================================================= */}
      {/* TOP SECTION */}
      {/* ================================================= */}

      <div className="grid lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2">

          <BudgetCard
            cost={estimated_cost}
          />

        </div>

        <div className="bg-white border border-gray-200 rounded-[28px] p-6">

          <p className="text-sm text-gray-500 mb-2">

            Travel Mood

          </p>

          <h2 className="text-4xl font-bold text-gray-900">

            {sentiment}

          </h2>

        </div>

      </div>

      {/* ================================================= */}
      {/* WEATHER */}
      {/* ================================================= */}

      <WeatherCard
        weather={weather}
      />

      {/* ================================================= */}
      {/* MAP */}
      {/* ================================================= */}

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
          restaurants={
            restaurant_recommendations
          }
        />
      </Suspense>

      {/* ================================================= */}
      {/* RECOMMENDED PLACES */}
      {/* ================================================= */}

      <PreferenceChips
        recommendations={recommendations}
      />

      {/* ================================================= */}
      {/* BUDGET BREAKDOWN */}
      {/* ================================================= */}

      <BudgetBreakdownCard
        breakdown={budget_breakdown}
      />

      {/* ================================================= */}
      {/* HOTEL RECOMMENDATIONS */}
      {/* ================================================= */}

      {hotel_recommendations.length > 0 && (

        <section>

          <div className="mb-6">

            <h2 className="text-3xl font-bold text-gray-900">

              Hotel Recommendations

            </h2>

            <p className="text-gray-500 mt-1">

              AI suggested stays

            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

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

      {/* ================================================= */}
      {/* RESTAURANTS */}
      {/* ================================================= */}

      {restaurant_recommendations.length > 0 && (

        <section>

          <div className="mb-6">

            <h2 className="text-3xl font-bold text-gray-900">

              Restaurant Recommendations

            </h2>

            <p className="text-gray-500 mt-1">

              Popular nearby food spots

            </p>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

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

      {/* ================================================= */}
      {/* CROWD INSIGHTS */}
      {/* ================================================= */}

      {crowd_insights.length > 0 && (

        <section className="bg-white border border-gray-200 rounded-[28px] p-6">

          <div className="mb-6">

            <h2 className="text-3xl font-bold text-gray-900">

              Crowd Insights

            </h2>

            <p className="text-gray-500 mt-1">

              AI predicted crowd conditions

            </p>

          </div>

          <div className="space-y-4">

            {crowd_insights.map(

              (item, index) => (

                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl p-5"
                >

                  <div className="flex items-center justify-between">

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

                    Best Time:
                    {" "}
                    {item.best_time}

                  </p>

                </div>

              )

            )}

          </div>

        </section>

      )}

      {/* ================================================= */}
      {/* ITINERARY */}
      {/* ================================================= */}

      <section>

        <div className="mb-6">

          <h2 className="text-4xl font-bold text-gray-900">

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

      {/* ================================================= */}
      {/* TRAVEL TIPS */}
      {/* ================================================= */}

      <TravelTipsCard
        tips={travel_tips}
      />

      {/* ================================================= */}
      {/* ACTION BUTTONS */}
      {/* ================================================= */}

      <div className="grid md:grid-cols-3 gap-4 pb-6">

        {/* PDF */}

        <button

          onClick={downloadTripPDF}

          className="border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 py-4 rounded-2xl font-semibold transition duration-300"

        >

          Download PDF

        </button>

        {/* SAVE */}

        <button

          onClick={saveTrip}

          disabled={saving}

          className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 py-4 rounded-2xl font-semibold transition duration-300"

        >

          {saving
            ? "Saving..."
            : "Save Trip"}

        </button>

        {/* BOOK */}

        <button

          onClick={() =>

            navigate("/booking", {

              state: {

                destination:
                  form.destination,

                days:
                  form.days,

                budget:
                  estimated_cost,

                ...result,

              },

            })

          }

          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-semibold shadow-md hover:shadow-lg transition duration-300"

        >

          Book Trip

        </button>

      </div>

    </div>

  );

}

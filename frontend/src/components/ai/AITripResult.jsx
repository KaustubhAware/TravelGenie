// =====================================================
// AI TRIP RESULT
// =====================================================

import BudgetCard from "./BudgetCard";
import BudgetBreakdownCard from "./BudgetBreakdownCard";
import PreferenceChips from "./PreferenceChips";
import DayPlanCard from "./DayPlanCard";
import TravelTipsCard from "./TravelTipsCard";

import HotelRecommendationCard from "./HotelRecommendationCard";
import RestaurantRecommendationCard from "./RestaurantRecommendationCard";
import WeatherCard from "./WeatherCard";

export default function AITripResult({
  result = {},
  saveTrip,
  saving,
  navigate,
  form,
}) {

  console.log("AI RESULT:", result);

  const itinerary =
    result?.itinerary || [];

  const recommendations =
    result?.recommended_places || [];

  const cost =
    result?.estimated_cost || 0;

  const sentiment =
    result?.sentiment || "Neutral";

  const budgetBreakdown =
    result?.budget_breakdown || {};

  const travelTips =
    result?.travel_tips || [];

  const hotels =
    result?.hotel_recommendations || [];

  const restaurants =
    result?.restaurant_recommendations || [];

  const weather =
    result?.weather || {};

  return (

    <div className="space-y-8 overflow-y-auto h-full pr-2">

      {/* TOP */}

      <div className="grid lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2">

          <BudgetCard cost={cost} />

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

      {/* WEATHER */}

      <WeatherCard weather={weather} />

      {/* RECOMMENDED PLACES */}

      <PreferenceChips
        recommendations={recommendations}
      />

      {/* BUDGET */}

      <BudgetBreakdownCard
        breakdown={budgetBreakdown}
      />

      {/* HOTELS */}

      {hotels.length > 0 && (

        <div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">

            Hotel Recommendations

          </h2>

          <p className="text-gray-500 mb-6">

            Best stays selected by AI

          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {hotels.map((hotel, index) => (

              <HotelRecommendationCard
                key={index}
                hotel={hotel}
              />

            ))}

          </div>

        </div>

      )}

      {/* RESTAURANTS */}

      {restaurants.length > 0 && (

        <div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">

            Restaurant Recommendations

          </h2>

          <p className="text-gray-500 mb-6">

            Popular food places around destination

          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {restaurants.map((restaurant, index) => (

              <RestaurantRecommendationCard
                key={index}
                restaurant={restaurant}
              />

            ))}

          </div>

        </div>

      )}

      {/* ITINERARY */}

      <div>

        <div className="mb-6">

          <h2 className="text-4xl font-bold text-gray-900">

            AI Generated Itinerary

          </h2>

          <p className="text-gray-500 mt-2">

            Smart travel planning powered by AI

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

      </div>

      {/* TRAVEL TIPS */}

      <TravelTipsCard
        tips={travelTips}
      />

      {/* BUTTONS */}

      <div className="grid md:grid-cols-2 gap-4">

        <button
          onClick={saveTrip}
          disabled={saving}
          className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 py-4 rounded-2xl font-semibold transition duration-300"
        >

          {saving
            ? "Saving..."
            : "Save Trip"}

        </button>

        <button
          onClick={() =>
            navigate("/booking", {
              state: {
                destination: form.destination,
                days: form.days,
                budget: cost,
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
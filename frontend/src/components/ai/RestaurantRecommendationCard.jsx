import {
  FaUtensils,
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function RestaurantRecommendationCard({
  restaurant,
}) {

  if (!restaurant) {
    return null;
  }

  return (

    <div className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm">

      <div className="flex items-center gap-3">

        <FaUtensils className="text-orange-500" />

        <h3 className="text-xl font-bold text-gray-900">

          {restaurant.name || "Recommended restaurant"}

        </h3>

      </div>

      <p className="text-gray-600 mt-3">

        {restaurant.cuisine || "Local Maharashtrian"}

      </p>

      {(restaurant.speciality || restaurant.specialty) && (
        <p className="mt-2 text-sm text-slate-500">
          Speciality: {restaurant.speciality || restaurant.specialty}
        </p>
      )}

      <div className="flex items-center gap-5 mt-5">

        <div className="flex items-center gap-2">

          <FaStar className="text-yellow-500" />

          <span>

            {restaurant.rating || "4.4"}

          </span>

        </div>

        <div className="flex items-center gap-2">

          <FaMapMarkerAlt className="text-red-500" />

          <span>

            {restaurant.distance || restaurant.location || "Nearby"}

          </span>

        </div>

      </div>

      {(restaurant.approx_cost || restaurant.cost || restaurant.price_range) && (
        <div className="mt-5 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
          Approx. cost: {restaurant.approx_cost || restaurant.cost || restaurant.price_range}
        </div>
      )}

    </div>

  );

}

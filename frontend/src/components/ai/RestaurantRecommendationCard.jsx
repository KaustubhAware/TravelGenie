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

    <div className="bg-white border border-gray-200 rounded-[28px] p-6">

      <div className="flex items-center gap-3">

        <FaUtensils className="text-blue-600" />

        <h3 className="text-xl font-bold text-gray-900">

          {restaurant.name}

        </h3>

      </div>

      <p className="text-gray-600 mt-3">

        {restaurant.cuisine}

      </p>

      <div className="flex items-center gap-5 mt-5">

        <div className="flex items-center gap-2">

          <FaStar className="text-yellow-500" />

          <span>

            {restaurant.rating}

          </span>

        </div>

        <div className="flex items-center gap-2">

          <FaMapMarkerAlt className="text-red-500" />

          <span>

            {restaurant.distance}

          </span>

        </div>

      </div>

    </div>

  );

}
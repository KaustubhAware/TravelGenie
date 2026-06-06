import {
  FaHotel,
  FaStar,
} from "react-icons/fa";
import { resolveImageUrl } from "../../utils/imageUrl";

export default function HotelRecommendationCard({
  hotel,
}) {

  if (!hotel || !hotel.name) {
    return null;
  }

  return (

    <div className="bg-white border border-gray-200 rounded-[28px] overflow-hidden shadow-sm">

      <img
        src={resolveImageUrl(hotel.image)}
        alt={hotel.name}
        className="w-full h-56 object-cover"
        loading="lazy"
      />

      <div className="p-6">

        <div className="flex items-center gap-3">

          <FaHotel className="text-orange-500" />

          <h3 className="text-xl font-bold text-gray-900">

            {hotel.name}

          </h3>

        </div>

        {hotel.rating && (
          <div className="flex items-center gap-2 mt-4">

            <FaStar className="text-yellow-500" />

            <span className="font-medium">

              {hotel.rating}

            </span>

          </div>
        )}

        {(hotel.price_range || hotel.price) && (
          <p className="text-gray-600 mt-3">

            {hotel.price_range || hotel.price}

          </p>
        )}

        {hotel.location && (
          <p className="mt-2 text-sm text-gray-500">
            {hotel.location}
          </p>
        )}

        {Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

      </div>

    </div>

  );

}

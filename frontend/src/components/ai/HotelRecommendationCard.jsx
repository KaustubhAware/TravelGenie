import {
  FaHotel,
  FaStar,
} from "react-icons/fa";

export default function HotelRecommendationCard({
  hotel,
}) {

  if (!hotel) {
    return null;
  }

  return (

    <div className="bg-white border border-gray-200 rounded-[28px] overflow-hidden">

      <img
        src={
          hotel.image ||
          "https://images.unsplash.com/photo-1566073771259-6a8506099945"
        }
        alt={hotel.name}
        className="w-full h-56 object-cover"
      />

      <div className="p-6">

        <div className="flex items-center gap-3">

          <FaHotel className="text-blue-600" />

          <h3 className="text-xl font-bold text-gray-900">

            {hotel.name}

          </h3>

        </div>

        <div className="flex items-center gap-2 mt-4">

          <FaStar className="text-yellow-500" />

          <span className="font-medium">

            {hotel.rating}

          </span>

        </div>

        <p className="text-gray-600 mt-3">

          {hotel.price_range}

        </p>

        <button
          className="mt-5 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-2xl font-semibold"
        >

          Book Hotel

        </button>

      </div>

    </div>

  );

}
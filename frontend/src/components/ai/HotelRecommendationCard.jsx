const pick = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

export default function HotelRecommendationCard({ hotel }) {
  if (!hotel || !hotel.name) {
    return null;
  }

  const amenities = Array.isArray(hotel.amenities)
    ? hotel.amenities
    : String(hotel.amenities || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  const price = pick(hotel.price_range, hotel.price, hotel.estimated_price, hotel.cost);
  const distance = pick(hotel.distance, hotel.distance_from_destination, hotel.nearby, hotel.travel_time);

  return (
    <article className="h-full rounded-[22px] border border-slate-100 bg-white p-5 transition duration-200 hover:bg-slate-50 md:p-6">
      <h3 className="text-base font-semibold leading-snug text-slate-950">
        {hotel.name}
      </h3>

      <div className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
        {price && (
          <Info label="Price" value={price} />
        )}
        {distance && (
          <Info label="Distance" value={distance} />
        )}
      </div>

      {amenities.length > 0 && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-slate-500">
            Amenities
          </p>
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <span className="text-sm font-semibold text-slate-500">
        {label}
      </span>
      <p className="mt-1 text-sm leading-relaxed text-slate-800">{value}</p>
    </div>
  );
}

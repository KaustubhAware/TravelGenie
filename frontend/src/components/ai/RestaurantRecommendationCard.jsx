const pick = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

export default function RestaurantRecommendationCard({ restaurant }) {
  if (!restaurant) {
    return null;
  }

  const name = restaurant.name || restaurant.restaurant_name || "Recommended restaurant";
  const cuisine = pick(restaurant.cuisine, restaurant.type, "Local Maharashtrian");
  const distance = pick(restaurant.distance, restaurant.location, restaurant.area, "Nearby");

  return (
    <article className="h-full rounded-[22px] border border-slate-100 bg-white p-5 transition duration-200 hover:bg-slate-50 md:p-6">
      <h3 className="text-base font-semibold leading-snug text-slate-950">
        {name}
      </h3>

      <div className="mt-5 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
        <Info label="Cuisine" value={cuisine} />
        <Info label="Distance" value={distance} />
      </div>
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

const tierFromPrice = (price) => {
  const value = Number(price || 0);
  if (!value) return "mid";
  if (value < 2000) return "budget";
  if (value < 5000) return "mid";
  return "premium";
};

export function groupHotelsByTier(hotels = []) {
  const tiers = {
    budget: [],
    mid: [],
    premium: [],
  };

  hotels.forEach((hotel) => {
    const tier =
      String(hotel.tier || hotel.category || "")
        .toLowerCase()
        .replace(/mid-?range|standard/, "mid") || tierFromPrice(hotel.price || hotel.estimated_price);

    if (tiers[tier]) {
      tiers[tier].push(hotel);
    } else {
      tiers.mid.push(hotel);
    }
  });

  return tiers;
}

export function groupRestaurantsByMeal(restaurants = []) {
  const groups = {
    breakfast: [],
    lunch: [],
    dinner: [],
    other: [],
  };

  restaurants.forEach((restaurant) => {
    const item =
      typeof restaurant === "string" ? { name: restaurant } : restaurant;
    const meal = String(item.meal || item.meal_type || item.time || "").toLowerCase();

    if (meal.includes("breakfast")) {
      groups.breakfast.push(item);
    } else if (meal.includes("lunch")) {
      groups.lunch.push(item);
    } else if (meal.includes("dinner")) {
      groups.dinner.push(item);
    } else {
      groups.other.push(item);
    }
  });

  if (
    groups.other.length > 0 &&
    !groups.breakfast.length &&
    !groups.lunch.length &&
    !groups.dinner.length
  ) {
    const chunk = Math.max(1, Math.ceil(groups.other.length / 3));
    groups.breakfast = groups.other.slice(0, chunk);
    groups.lunch = groups.other.slice(chunk, chunk * 2);
    groups.dinner = groups.other.slice(chunk * 2);
    groups.other = [];
  }

  return groups;
}

import { apiRequest } from "./httpClient";

const extractPackages = (response) =>
  response?.packages ||
  response?.data?.packages ||
  [];

const extractReviews = (response) =>
  response?.data?.reviews ||
  response?.reviews ||
  [];

export const landingService = {
  async getFeaturedPackages(limit = 6) {
    const response = await apiRequest("/packages", { auth: false });
    const packages = extractPackages(response);
    const featured = packages.filter((item) => item.featured);
    const pool = featured.length ? featured : packages;
    return pool.slice(0, limit);
  },

  async getApprovedReviews(limit = 6) {
    const response = await apiRequest("/reviews", { auth: false });
    return extractReviews(response).slice(0, limit);
  },

  async getTopRatedPackages(limit = 4) {
    const response = await apiRequest("/packages", { auth: false });
    const packages = extractPackages(response);
    return [...packages]
      .sort(
        (a, b) =>
          Number(b.rating || 0) - Number(a.rating || 0) ||
          Number(b.total_reviews || 0) - Number(a.total_reviews || 0)
      )
      .slice(0, limit);
  },

  getFeaturedDestinations(packages = [], limit = 6) {
    const seen = new Set();
    const destinations = [];

    for (const pkg of packages) {
      const location = String(pkg.location || pkg.region || "").trim();
      if (!location || seen.has(location.toLowerCase())) continue;
      seen.add(location.toLowerCase());
      destinations.push({
        id: `${pkg.id}-${location}`,
        name: location,
        region: pkg.region || "Maharashtra",
        image: pkg.featured_image || pkg.image,
        slug: pkg.slug,
        packageCount: packages.filter(
          (item) =>
            String(item.location || "").toLowerCase() === location.toLowerCase()
        ).length,
      });
      if (destinations.length >= limit) break;
    }

    return destinations;
  },
};

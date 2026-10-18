// A restaurant's `categories` is a comma-separated string, e.g. "Pizza, Pasta".
// Used by the Explore filter and the landing-page category counts, so the
// number on a category card always matches what Explore shows.
export function hasCategory(restaurant, category) {
  if (!restaurant?.categories || !category) return false;
  const wanted = category.trim().toLowerCase();
  return restaurant.categories
    .split(",")
    .some((c) => c.trim().toLowerCase() === wanted);
}

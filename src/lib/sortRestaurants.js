import { isRestaurantOpen } from "./isRestaurantOpen";

// The sort options shown in the sort menu, in display order.
export const SORT_OPTIONS = [
  "recommended",
  "rating",
  "deliveryTime",
  "distance",
  "name",
];

// Same rule as RestaurantCard: restaurants without hours count as open.
export function isOpenForListing(restaurant) {
  const hours = restaurant?.hours;
  const hasHours =
    typeof hours?.open === "number" && typeof hours?.close === "number";
  return hasHours ? isRestaurantOpen(hours) : true;
}

// "4.6" -> 4.6, "25-35" -> 25, missing -> NaN
const toNumber = (value) =>
  typeof value === "number" ? value : parseFloat(value);

// Compares numbers; restaurants missing the value always go last.
const byNumber = (get, direction = 1) => (a, b) => {
  const x = toNumber(get(a));
  const y = toNumber(get(b));
  const xMissing = !Number.isFinite(x);
  const yMissing = !Number.isFinite(y);
  if (xMissing || yMissing) return xMissing === yMissing ? 0 : xMissing ? 1 : -1;
  return (x - y) * direction;
};

const COMPARATORS = {
  recommended: () => 0, // keep the original order
  rating: byNumber((r) => r.rating, -1), // highest first
  deliveryTime: byNumber((r) => r.deliveryTime), // fastest first
  distance: byNumber((r) => r.distance), // nearest first
  name: (a, b) =>
    String(a.name ?? "").localeCompare(String(b.name ?? ""), undefined, {
      sensitivity: "base",
      numeric: true,
    }),
};

/**
 * Returns a sorted copy of `restaurants`. Open restaurants always come before
 * closed ones; ties keep their original order.
 *
 * `distanceById` (Map of id -> km) fills in `distance` for the "distance" sort,
 * so the cards can show how far each one is.
 */
export function sortRestaurants(restaurants = [], sort = "recommended", distanceById) {
  const compare = COMPARATORS[sort] ?? COMPARATORS.recommended;

  const list =
    sort === "distance" && distanceById
      ? restaurants.map((r) =>
          r.distance != null || !distanceById.has(r.id)
            ? r
            : { ...r, distance: distanceById.get(r.id) },
        )
      : restaurants;

  return list
    .map((restaurant, index) => ({
      restaurant,
      index,
      open: isOpenForListing(restaurant),
    }))
    .sort(
      (a, b) =>
        Number(b.open) - Number(a.open) ||
        compare(a.restaurant, b.restaurant) ||
        a.index - b.index,
    )
    .map(({ restaurant }) => restaurant);
}

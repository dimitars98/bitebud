// Haversine formula to calculate distance between two coordinates.
// A copy lives in functions/index.js (a separate package); keep them in sync.
export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Filter nearby restaurants
export function filterNearbyRestaurants(
  restaurants,
  userLocation,
  radiusKm = 20000
) {
  if (!userLocation) return [];

  return restaurants
    .map((rest) => {
      if (
        !rest.location ||
        rest.location.lat == null ||
        rest.location.lng == null
      ) {
        return { ...rest, distance: Infinity }; // mark as "too far" or skip
      }

      return {
        ...rest,
        distance: getDistanceKm(
          userLocation.lat,
          userLocation.lng,
          rest.location.lat,
          rest.location.lng
        ),
      };
    })
    .filter((rest) => rest.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

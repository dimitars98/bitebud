// Your ORS API key
const ORS_API_KEY = "5b3ce3597851110001cf6248859e098a470845e896bdd3a012310109";

// Calculate distances from user location to restaurant locations
export async function fetchDistances(userCoords, restaurants) {
  const validRestaurants = restaurants.filter(
    (r) => r.location && r.location.lng != null && r.location.lat != null
  );

  const locations = [
    [userCoords.lng, userCoords.lat],
    ...validRestaurants.map((r) => [r.location.lng, r.location.lat]),
  ];

  const body = {
    locations,
    metrics: ["distance"],
    units: "m",
  };

  const response = await fetch(
    "https://api.openrouteservice.org/v2/matrix/driving-car",
    {
      method: "POST",
      headers: {
        Authorization: ORS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error("ORS API error: " + response.statusText);
  }

  const data = await response.json();
  return { distances: data.distances[0].slice(1), validRestaurants };
}

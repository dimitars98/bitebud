// src/utils/orsApi.js
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebase"; // your firebase.js setup

export async function fetchDistances(userCoords, restaurants) {
  const validRestaurants = restaurants.filter(
    (r) => r.location && r.location.lng != null && r.location.lat != null
  );

  const payload = {
    userCoords,
    restaurants: validRestaurants.map((r) => ({
      lat: r.location.lat,
      lng: r.location.lng,
    })),
  };

  try {
    const getDistanceMatrix = httpsCallable(functions, "getDistanceMatrix");
    const result = await getDistanceMatrix(payload);
    return { distances: result.data.distances, validRestaurants };
  } catch (err) {
    console.error("Error fetching distances:", err);
    return { distances: [], validRestaurants };
  }
}

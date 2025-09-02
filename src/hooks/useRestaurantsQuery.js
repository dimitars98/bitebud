import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { fetchDistances } from "../utils/orsApi";

export async function fetchRestaurantsWithDistances() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const snapshot = await getDocs(collection(db, "restaurants"));
          const rawRestaurants = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const { distances, validRestaurants } = await fetchDistances(
            userCoords,
            rawRestaurants
          );

          const restaurants = validRestaurants.map((rest, i) => ({
            ...rest,
            distance: distances[i] / 1000,
          }));

          restaurants.sort((a, b) => b.distance - a.distance);
          resolve(restaurants);
        } catch (err) {
          reject(err);
        }
      },
      (error) => reject(error)
    );
  });
}

export function useRestaurantsQuery() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurantsWithDistances,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

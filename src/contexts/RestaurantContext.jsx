import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { fetchDistances } from "../utils/orsApi";

const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const querySnapshot = await getDocs(collection(db, "restaurants"));
          const fetchedRestaurants = [];

          querySnapshot.forEach((doc) => {
            fetchedRestaurants.push({ id: doc.id, ...doc.data() });
          });

          const { distances, validRestaurants } = await fetchDistances(
            userCoords,
            fetchedRestaurants
          );

          const restaurantsWithDistances = validRestaurants.map((rest, i) => ({
            ...rest,
            distance: distances[i] / 1000,
          }));

          restaurantsWithDistances.sort((a, b) => b.distance - a.distance);

          setRestaurants(restaurantsWithDistances);
          setFilteredRestaurants([]);
        } catch (error) {
          console.error("Failed to fetch distances:", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoading(false);
      }
    );
  }, []);

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        loading,
        filteredRestaurants,
        setFilteredRestaurants,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurants() {
  return useContext(RestaurantContext);
}

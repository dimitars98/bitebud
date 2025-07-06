import { useEffect, useState } from "react";
import RestaurantCard from "../components/RestaurantCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Categories from "../components/Categories";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import RestaurantCardSkeleton from "../ui/RestaurantSkeleton";
import CategoriesSkeleton from "../ui/CategoriesSkeleton";
import { fetchDistances } from "..//utils/orsApi";
import useSkeletonCount from "../hooks/useSkeletonCount";
import RestaurantSlider from "../ui/RestaurantSlider";
import { useRestaurants } from "../contexts/RestaurantContext";

// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//   const R = 6371; // Radius of the Earth in km
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// function deg2rad(deg) {
//   return deg * (Math.PI / 180);
// }

export default function Home() {
  // const [restaurants, setRestaurants] = useState([]);
  // const [loading, setLoading] = useState(true);

  const { restaurants, loading, filteredRestaurants } = useRestaurants();

  const searchQuery = useSelector((state) => state.ui.searchQuery);

  const baseList =
    filteredRestaurants.length > 0 ? filteredRestaurants : restaurants;

  const finalList = baseList.filter((rest) =>
    rest?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nearbyRestaurants = restaurants
    .sort((a, b) => a.distance - b.distance) // closest first
    .slice(0, 15); // limit to 15

  const skeletonCount = useSkeletonCount();

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       try {
  //         const userLat = position.coords.latitude;
  //         const userLng = position.coords.longitude;
  //         const userCoords = { lat: userLat, lng: userLng };

  //         const querySnapshot = await getDocs(collection(db, "restaurants"));
  //         const fetchedRestaurants = [];

  //         querySnapshot.forEach((doc) => {
  //           fetchedRestaurants.push({ id: doc.id, ...doc.data() });
  //         });

  //         // Call your ORS API helper function here
  //         const { distances, validRestaurants } = await fetchDistances(
  //           userCoords,
  //           fetchedRestaurants
  //         );

  //         // Merge distances back to valid restaurants and convert meters to km
  //         const restaurantsWithDistances = validRestaurants.map((rest, i) => ({
  //           ...rest,
  //           distance: distances[i] / 1000,
  //         }));

  //         // Sort by distance
  //         restaurantsWithDistances.sort((a, b) => b.distance - a.distance);

  //         setRestaurants(restaurantsWithDistances);
  //         setLoading(false);
  //       } catch (error) {
  //         console.error("Failed to fetch distances:", error);
  //         setLoading(false);
  //       }
  //     },
  //     (error) => {
  //       console.error("Geolocation error:", error);
  //       setLoading(false);
  //     }
  //   );
  // }, []);

  // if (loading) return <LoadingSpinner />;
  if (loading) {
    // Show 6 skeleton cards as placeholder
    return (
      <div className="relative min-h-screen bg-white dark:bg-black">
        {/* <div className="fixed bottom-4 right-4 z-30">
          <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
        </div> */}

        {/* Categories skeleton */}
        <CategoriesSkeleton />
        <section className="max-w-full md:max-w-fit mx-auto px-4 sm:px-6 md:px-8 gap-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 md:gap-x-4 gap-y-4">
          {Array(skeletonCount)
            .fill(0)
            .map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
        </section>
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-black">
      <Categories />
      <RestaurantSlider
        restaurants={nearbyRestaurants}
        title="Restaurants Near You"
      />
      <div className="max-w-[1500px] px-4 mx-auto md:px-8">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-50">
          All restaurants
        </h1>
      </div>
      <div className="flex items-center">
        <section className="max-w-[1500px] mx-auto px-4 gap-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6 gap-y-4 z-20">
          {finalList.length === 0 ? (
            <p className="text-gray-900 dark:text-gray-50">
              No restaurants found.
            </p>
          ) : (
            finalList.map((rest) => <RestaurantCard key={rest.id} {...rest} />)
          )}
        </section>
      </div>
    </div>
  );
}

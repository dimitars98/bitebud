import { useEffect, useState } from "react";
import RestaurantCard from "../components/RestaurantCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Categories from "../components/Categories";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import RestaurantCardSkeleton from "../ui/RestaurantCardSkeleton";
import CategoriesSkeleton from "../ui/CategoriesSkeleton";
import { fetchDistances } from "..//utils/orsApi";
import useSkeletonCount from "../hooks/useSkeletonCount";
import RestaurantSlider from "../ui/RestaurantSlider";
import { useRestaurants } from "../contexts/RestaurantContext";
import TopPicksSection from "../ui/TopPicksSection";
import { useRestaurantsQuery } from "../hooks/useRestaurantsQuery";
import { FilterIcon } from "lucide-react";
import FilterModal from "../modals/FilterModal";
import { useFilterContext } from "../contexts/FilterContext";

export default function Home() {
  const [showFilterModal, setShowFilterModal] = useState(false);

  const {
    filters,
    setFilters,
    showNearbyOnly,
    setShowNearbyOnly,
    filteredRestaurants,
    setFilteredRestaurants,
    categoryFilterActive,
    setCategoryFilterActive,
  } = useFilterContext();

  function resetFilters() {
    setFilters({
      maxDistance: 150,
      tags: [],
    });
    setCategoryFilterActive(false);
    setShowNearbyOnly(false);
    setFilteredRestaurants([]);
  }

  const {
    data: restaurants = [],
    isLoading: loading,
    isError,
    error,
  } = useRestaurantsQuery();

  const searchQuery = useSelector((state) => state.ui.searchQuery);

  const handleSeeAllNearby = () => {
    setShowNearbyOnly(true);
  };

  const filtersAreActive = filters.tags.length > 0 || filters.maxDistance < 150;

  const baseList =
    filtersAreActive || categoryFilterActive
      ? filteredRestaurants
      : restaurants;

  const finalList = baseList.filter((rest) =>
    rest?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nearbyRestaurants = [...restaurants]
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);

  const skeletonCount = useSkeletonCount();

  useEffect(() => {
    if (!restaurants || restaurants.length === 0) return;

    let filtered = restaurants;

    if (filters.maxDistance !== null) {
      filtered = filtered.filter(
        (rest) => rest.distance <= filters.maxDistance
      );
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter((rest) =>
        filters.tags.some((tag) => rest.tags?.includes(tag))
      );
    }

    setFilteredRestaurants(filtered);
  }, [filters, restaurants, setFilteredRestaurants]);

  // if (loading) return <LoadingSpinner />;
  if (loading) {
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
      <Categories
        restaurants={restaurants}
        setFilteredRestaurants={setFilteredRestaurants}
        setCategoryFilterActive={setCategoryFilterActive}
      />

      <div className="max-w-[1500px] mx-auto px-4 md:px-8 flex justify-end pt-4">
        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm dark:text-gray-100 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
        >
          <FilterIcon className="w-4 h-4" />
          Filters
        </button>
      </div>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        setFilters={setFilters}
      />

      {showNearbyOnly || categoryFilterActive ? (
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-6">
          <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-50">
            {showNearbyOnly ? "All Nearby Restaurants" : "Filtered Restaurants"}
          </h1>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {finalList.length === 0 ? (
              <p className="text-gray-900 dark:text-gray-50">
                No restaurants found.
              </p>
            ) : (
              finalList.map((rest) => (
                <RestaurantCard key={rest.id} {...rest} />
              ))
            )}
          </section>
        </div>
      ) : (
        <>
          <RestaurantSlider
            restaurants={nearbyRestaurants}
            title="Offers near you"
            onSeeAll={handleSeeAllNearby}
          />
          <TopPicksSection restaurants={finalList} />
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
                finalList.map((rest) => (
                  <RestaurantCard key={rest.id} {...rest} />
                ))
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

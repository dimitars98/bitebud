import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import RestaurantCard from "../components/RestaurantCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Categories from "../components/restaurants/Categories";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useSelector } from "react-redux";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import RestaurantCardSkeleton from "../ui/RestaurantCardSkeleton";
import CategoriesSkeleton from "../components/restaurants/CategoriesSkeleton";
import useSkeletonCount from "../hooks/useSkeletonCount";
import { useRestaurants } from "../contexts/RestaurantContext";
import TopPicksSection from "../components/restaurants/TopPicksSection";
import { useRestaurantsQuery } from "../hooks/useRestaurantsQuery";
import { ArrowLeft, FilterIcon } from "lucide-react";
import FilterModal from "../modals/FilterModal";
import { useFilterContext } from "../contexts/FilterContext";
import { filterNearbyRestaurants } from "../lib/geoUtils";
import useUserLocation from "../hooks/useUserLocation";
import RestaurantSlider from "../components/restaurants/RestaurantSlider";
import { useTranslation } from "react-i18next";
import { hasCategory } from "../helpers/hasCategory";

export default function Home() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { t } = useTranslation();

  const { filters, showNearbyOnly, showNearby, showAll, setActiveCategory } =
    useFilterContext();

  // The category filter lives in the URL (/explore?category=Pizza) so Back/Forward,
  // refreshes and links from the landing page always match what's on screen.
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  // keep the shared context in sync for anything else that reads it
  useEffect(() => {
    setActiveCategory(activeCategory || null);
  }, [activeCategory, setActiveCategory]);

  const clearCategoryParam = () => {
    if (activeCategory) setSearchParams({}, { replace: true });
  };
  const handleShowAll = () => {
    showAll();
    clearCategoryParam();
  };
  const handleShowNearby = () => {
    showNearby();
    clearCategoryParam();
  };

  const {
    data: restaurants = [],
    isLoading: loading,
    isError,
  } = useRestaurantsQuery();

  const { location: userLocation } = useUserLocation();

  const nearbyRestaurants = useMemo(
    () => filterNearbyRestaurants(restaurants, userLocation),
    [restaurants, userLocation],
  );

  const sliderLoading =
    loading || !userLocation || nearbyRestaurants.length === 0;

  const searchQuery = useSelector((state) => state.ui.searchQuery);

  // const filtersAreActive = filters.tags.length > 0 || filters.maxDistance < 150;
  const filtersAreActive = filters.tags.length > 0;

  const baseList = useMemo(() => {
    let list = [...restaurants];

    if (activeCategory) {
      list = list.filter((r) => hasCategory(r, activeCategory));
    }

    if (filtersAreActive) {
      list = list.filter((r) =>
        filters.tags.some((tag) => r.tags?.includes(tag)),
      );
    }

    return list;
  }, [restaurants, activeCategory, filters, filtersAreActive]);

  const finalList = baseList.filter((rest) =>
    rest.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const skeletonCount = useSkeletonCount();

  const isSearchMode = searchQuery.length > 0;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-(--text-secondary) dark:text-(--text-secondary)">
        <p>{t("home.loadError")}</p>
      </div>
    );
  }

  // if (loading) return <LoadingSpinner />;
  if (loading) {
    return (
      <div className="relative min-h-screen">
        {/* Categories skeleton */}
        <CategoriesSkeleton />
        <section className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
    <div className="relative">
      <Categories restaurants={restaurants} />

      <div className="max-w-[1500px] mx-auto px-4 md:px-8 flex justify-end pt-4">
        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm dark:text-(--text-secondary) bg-(--bg-secondary) hover:bg-(--bg-secondary-hover) dark:bg-(--brand-bg-secondary) dark:hover:bg-(--brand-bg-secondary-hover) rounded-md"
        >
          <FilterIcon className="w-4 h-4" />
          {t("home.filters")}
        </button>
      </div>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
      />

      {/* 🔎 Conditional rendering */}
      {isSearchMode ? (
        // Search / category results
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-6">
          <h1 className="text-2xl font-semibold mb-4">
            {t("home.searchResults")}
          </h1>

          {!finalList.length && (
            <p className="text-center">{t("common.noRestaurantsFound")}</p>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {finalList.map((rest) => (
              <RestaurantCard key={rest.id} {...rest} />
            ))}
          </section>
        </div>
      ) : showNearbyOnly || activeCategory || filtersAreActive ? (
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-6">
          <button
            onClick={handleShowAll}
            aria-label={t("home.backToAll")}
            className="mb-10 flex items-center gap-2 text-sm bg-(--bg-secondary) dark:bg-(--brand-bg-secondary) p-3 rounded-full hover:scale-105 transition-transform text-gray-700 dark:text-(--text-primary)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center mb-4">
            <h1 className="text-2xl font-semibold ml-4">
              {showNearbyOnly ? t("home.nearYou") : t("home.filtered")}
            </h1>
          </div>

          {/* 🔴 EMPTY STATE */}
          {!showNearbyOnly && finalList.length === 0 && (
            <p className="text-center text-lg text-gray-500 mt-10">
              {t("home.noMatch")}
            </p>
          )}

          {/* 🟢 RESULTS */}
          {finalList.length > 0 && (
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {showNearbyOnly
                ? nearbyRestaurants.map((r) => (
                    <RestaurantCard key={r.id} {...r} />
                  ))
                : finalList.map((r) => <RestaurantCard key={r.id} {...r} />)}
            </section>
          )}
        </div>
      ) : (
        // Default discovery + all restaurants
        <>
          <RestaurantSlider
            restaurants={nearbyRestaurants.slice(0, 6)}
            title={t("home.offersNearYou")}
            onSeeAll={handleShowNearby}
            loading={sliderLoading}
          />

          <TopPicksSection restaurants={finalList} />

          <div className="max-w-[1500px] px-4 mx-auto md:px-8">
            {finalList.length > 0 && (
              <>
                <h1 className="text-2xl font-extrabold text-(--text-primary) dark:text-(--text-primary) mb-4">
                  {t("home.allRestaurants")}
                </h1>
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
                  {finalList.map((rest) => (
                    <RestaurantCard key={rest.id} {...rest} />
                  ))}
                </section>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

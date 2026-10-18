import { createContext, useContext, useMemo, useState } from "react";

const FilterContext = createContext(null);

export function FilterContextProvider({ children }) {
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);

  const [filters, setFilters] = useState({
    tags: [],
    maxDistance: 150,
  });

  const [activeCategory, setActiveCategory] = useState(null);

  /**
   * 🔥 This replaces:
   * - filteredRestaurants state
   * - categoryFilterActive boolean
   */
  const hasActiveFilters = useMemo(() => {
    return (
      filters.tags.length > 0 ||
      filters.maxDistance < 150 ||
      activeCategory !== null
    );
  }, [filters, activeCategory]);

  function resetFilters() {
    setFilters({ tags: [], maxDistance: 150 });
    setActiveCategory(null);
    setShowNearbyOnly(false);
  }

  function showNearby() {
    setShowNearbyOnly(true);
    setActiveCategory(false);
  }

  function showAll() {
    setShowNearbyOnly(false);
    setActiveCategory(false);
  }

  return (
    <FilterContext.Provider
      value={{
        // modal filters
        filters,
        setFilters,

        // category
        activeCategory,
        setActiveCategory,

        // nearby
        showNearbyOnly,
        setShowNearbyOnly,

        // helpers
        hasActiveFilters,
        resetFilters,
        showNearby,
        showAll,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error(
      "useFilterContext must be used within FilterContextProvider",
    );
  }
  return context;
}

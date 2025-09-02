import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterContextProvider({ children }) {
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [categoryFilterActive, setCategoryFilterActive] = useState(false);
  const [filters, setFilters] = useState({
    maxDistance: 150,
    tags: [],
  });

  function resetFilters() {
    setFilters({ maxDistance: 150, tags: [] });
    setCategoryFilterActive(false);
    setShowNearbyOnly(false);
    setFilteredRestaurants([]);
  }

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        showNearbyOnly,
        setShowNearbyOnly,
        filteredRestaurants,
        setFilteredRestaurants,
        categoryFilterActive,
        setCategoryFilterActive,
        resetFilters,
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
      "useFilterContext must be used within FilterContextProvider"
    );
  }
  return context;
}

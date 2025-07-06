import React, { useRef, useState } from "react";
import CategoryItem from "./Categoryitem";
import { useRestaurants } from "../contexts/RestaurantContext";

const categories = [
  {
    id: 1,
    name: "Pizza",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    name: "Burger",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 3,
    name: "Sushi",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 4,
    name: "Salad",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 5,
    name: "Dessert",
    image:
      "https://images.unsplash.com/photo-1543255006-d6395b6f1171?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    name: "Drinks",
    image:
      "https://images.unsplash.com/photo-1617108126666-3b4f0251913a?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    name: "BBQ",
    image:
      "https://images.unsplash.com/photo-1616252980327-ec70572e5df9?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    name: "Mexican",
    image:
      "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 9,
    name: "Healthy",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 10,
    name: "Pasta",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 11,
    name: "Asian",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 12,
    name: "Turkish",
    image:
      "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 13,
    name: "Arabic",
    image:
      "https://images.unsplash.com/photo-1697126248437-db26a30024c5?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 14,
    name: "Vegan",
    image:
      "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 15,
    name: "Vegetarian",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 16,
    name: "Chinese",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 17,
    name: "Macedonian",
    image:
      "https://images.unsplash.com/photo-1740591872073-e0e627756b90?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 18,
    name: "Greek",
    image:
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 19,
    name: "Mediterranean",
    image:
      "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 20,
    name: "Fish",
    image:
      "https://images.unsplash.com/photo-1600699899970-b1c9fadd8f9e?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 21,
    name: "Bakery",
    image:
      "https://images.unsplash.com/photo-1621939650348-2a4139949c7a?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 22,
    name: "Sandwiches",
    image:
      "https://images.unsplash.com/photo-1655279562015-047c3da9a271?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 23,
    name: "Home Cooking",
    image:
      "https://images.unsplash.com/photo-1603496987674-79600a000f55?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 24,
    name: "Tortilla Wraps",
    image:
      "https://images.unsplash.com/photo-1562059390-a761a084768e?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 25,
    name: "Ice Cream",
    image:
      "https://images.unsplash.com/photo-1588195539297-f0b4efdb5472?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 26,
    name: "Cakes",
    image:
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Categories() {
  const scrollRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected

  const { restaurants, setFilteredRestaurants } = useRestaurants();

  const handleFilterByCategory = (categoryName) => {
    // Toggle selection: if clicked again, clear filter
    if (selectedCategory === categoryName) {
      setFilteredRestaurants(null);
      setSelectedCategory(null);
      return;
    }

    const filtered = restaurants.filter((rest) => {
      const categories = rest.categories
        ? rest.categories
            .toLowerCase()
            .split(",")
            .map((c) => c.trim())
        : [];
      const cuisines = rest.cuisine
        ? rest.cuisine
            .toLowerCase()
            .split(",")
            .map((c) => c.trim())
        : [];

      return (
        categories.includes(categoryName.toLowerCase()) ||
        cuisines.includes(categoryName.toLowerCase())
      );
    });

    setFilteredRestaurants(filtered);
    setSelectedCategory(categoryName);
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!scrollRef.current) return;

    const scrollAmount = 200;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-900 px-4 py-3 sm:px-6 lg:px-4 rounded-xl max-w-[1500px] mx-auto mt-4">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
        Categories
      </h2>
      <div className="relative flex items-center">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 items-center justify-center absolute left-0 z-10 bg-opacity-50 rounded-full text-gray-900 dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-800 hover:bg-opacity-80 cursor-pointer transition-all duration-200 ease-in "
          aria-label="Scroll left"
        >
          <span className="material-symbols-rounded lg:text-4xl">
            chevron_left
          </span>
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto overflow-y-visible space-x-3 sm:space-x-4 scrollbar-hide scroll-smooth px-2 sm:px-16 py-6"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {categories.map(({ id, name, image }) => (
            <CategoryItem
              key={id}
              name={name}
              image={image}
              onClick={() => handleFilterByCategory(name)}
            />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 items-center justify-center absolute right-0 z-10 bg-opacity-50 rounded-full text-gray-900 dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-800 hover:bg-opacity-80 cursor-pointer transition-all duration-200 ease-in-out"
          aria-label="Scroll right"
        >
          <span className="material-symbols-rounded text-2xl lg:text-3xl">
            chevron_right
          </span>
        </button>
      </div>
    </section>
  );
}

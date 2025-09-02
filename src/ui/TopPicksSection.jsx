import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Flame, BadgeDollarSign } from "lucide-react";
import { useRestaurantsQuery } from "../hooks/useRestaurantsQuery";
import LoadingSpinner from "./LoadingSpinner";
import { Link } from "react-router-dom";

const FILTERS = [
  { label: "Top Rated", icon: <Star className="w-4 h-4" /> },
  { label: "Trending", icon: <Flame className="w-4 h-4" /> },
  { label: "Under 30 Min", icon: <Clock className="w-4 h-4" /> },
  // { label: "Budget Picks", icon: <BadgeDollarSign className="w-4 h-4" /> },
];

// const mockData = [
//   {
//     id: 1,
//     name: "Sushi World",
//     image: "/images/sushi.jpg",
//     rating: 4.9,
//     deliveryTime: 25,
//     price: "MKD 290",
//   },
//   {
//     id: 2,
//     name: "Burger King",
//     image: "/images/burger.jpg",
//     rating: 4.6,
//     deliveryTime: 30,
//     price: "MKD 350",
//   },
//   {
//     id: 3,
//     name: "Pizza Queen",
//     image: "/images/pizza.jpg",
//     rating: 4.7,
//     deliveryTime: 28,
//     price: "MKD 270",
//   },
//   // ... more items
// ];

export default function TopPicksSection({ restaurants }) {
  const [activeFilter, setActiveFilter] = useState("Top Rated");
  const { isLoading, error } = useRestaurantsQuery();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error loading restaurants: {error.message}</p>;
  if (!restaurants || restaurants.length === 0)
    return <p>No restaurants found.</p>;

  const filteredRestaurants = restaurants.filter((r) => {
    if (activeFilter === "Top Rated") return r.rating >= 4.5;
    if (activeFilter === "Trending") return r.isTrending;
    if (activeFilter === "Under 30 Min") return r.deliveryTime <= 30;
    if (activeFilter === "Budget Picks") {
      const priceNum = parseInt(r.price.replace(/\D/g, ""));
      return priceNum && priceNum <= 300;
    }
    return true;
  });

  return (
    <section className="mt-12 mb-12 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-white mb-4">Top Picks For You</h2>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map(({ label, icon }) => (
          <button
            key={label}
            onClick={() => setActiveFilter(label)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition 
              ${
                activeFilter === label
                  ? "bg-yellow-500 text-black border-yellow-500"
                  : "bg-transparent border-gray-600 dark:text-gray-300 text-gray-600 hover:border-yellow-400"
              }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {filteredRestaurants.map((res) => (
          <Link to={`/restaurant/${res.id}`} key={res.id}>
            <motion.div
              className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-yellow-500/20 transition"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={res.image}
                alt={res.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{res.name}</h3>
                <p className="text-sm text-gray-400">
                  ⭐ {res.rating} • ⏱️ {res.deliveryTime} min
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

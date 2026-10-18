import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Flame, BadgeDollarSign } from "lucide-react";
import { useRestaurantsQuery } from "../../hooks/useRestaurantsQuery";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// `id` drives the filtering below; the visible label is topPicks.filters.<id>.
const FILTERS = [
  { id: "topRated", icon: <Star className="w-4 h-4" /> },
  { id: "trending", icon: <Flame className="w-4 h-4" /> },
  { id: "under30", icon: <Clock className="w-4 h-4" /> },
  // { id: "budget", icon: <BadgeDollarSign className="w-4 h-4" /> },
];

export default function TopPicksSection() {
  const [activeFilter, setActiveFilter] = useState("topRated");
  const { t } = useTranslation();
  const { isLoading, error, data: restaurants } = useRestaurantsQuery();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <section className="mt-12 mb-12 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-(--text-primary) dark:text-white mb-4">
          {t("topPicks.title")}
        </h2>
        <p className="flex justify-center text-red-500">
          {t("topPicks.error")}
        </p>
      </section>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <section className="mt-12 mb-12 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-(--text-primary) dark:text-white mb-4">
          {t("topPicks.title")}
        </h2>
        {/* Filters always visible */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTERS.map(({ id, icon }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition 
                ${
                  activeFilter === id
                    ? "bg-(--brand-primary) text-black border-(--brand-primary)"
                    : "bg-transparent border-gray-600 dark:text-gray-300 text-gray-600 hover:border-(--brand)"
                }`}
            >
              {icon}
              {t(`topPicks.filters.${id}`)}
            </button>
          ))}
        </div>
        <p className="flex justify-center">{t("common.noRestaurantsFound")}</p>
      </section>
    );
  }

  const filteredRestaurants = restaurants.filter((r) => {
    if (activeFilter === "topRated") return r.rating >= 4.5;
    if (activeFilter === "trending") return r.trending;
    if (activeFilter === "under30") return r.deliveryTime <= 30;
    if (activeFilter === "budget") {
      const priceNum = parseInt(r.price.replace(/\D/g, ""));
      return priceNum && priceNum <= 300;
    }
    return true;
  });

  return (
    <section className="mt-12 mb-12 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-(--text-primary) dark:text-white mb-4">
        {t("topPicks.title")}
      </h2>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map(({ id, icon }) => (
          <button
            key={id}
            onClick={() => setActiveFilter(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition 
              ${
                activeFilter === id
                  ? "bg-(--brand-primary) text-black border-(--brand-primary)"
                  : "bg-transparent border-gray-600 dark:text-gray-300 text-gray-600 hover:border-(--brand)"
              }`}
          >
            {icon}
            {t(`topPicks.filters.${id}`)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {filteredRestaurants.map((res) => (
          <Link to={`/restaurant/${res.slug}`} key={res.id}>
            <motion.div
              className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-(--brand-primary)/20 transition"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={res.logo}
                alt={res.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{res.name}</h3>
                <p className="text-sm text-(--text-muted)">
                  ⭐ {res.rating} • ⏱️ {res.deliveryTime} {t("common.min")}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}

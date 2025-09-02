import { useNavigate, useParams } from "react-router-dom";
import MenuCard from "../ui/MenuCard";
import { useCartOpen } from "../contexts/CartOpenContext";
import { useEffect, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import SkeletonImage from "../ui/SkeletonImage";
import { useRestaurantsQuery } from "../hooks/useRestaurantsQuery";
import toast from "react-hot-toast";

export default function RestaurantMenuPage() {
  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const { isCartOpen } = useCartOpen();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: restaurants = [], isLoading: loading } = useRestaurantsQuery();

  const restaurant = restaurants.find((r) => r.id === id);

  const {
    name,
    bannerImage,
    logo,
    menu = [],
    rating,
    deliveryTime,
    hours,
  } = restaurant;

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (restaurant && !isRestaurantOpen(restaurant.hours)) {
      toast("Heads up! This restaurant is currently closed.", {
        // icon: "🕒",
        position: "bottom-center",
        className:
          "bg-white text-red-900 border border-gray-400 rounded-lg whitespace-nowrap",
        style: {
          maxWidth: "100%",
        },

        duration: 5000,
      });
    }
  }, [restaurant]);

  if (loading) return <LoadingSpinner />;
  if (!restaurant)
    return <p className="text-white p-6">Restaurant not found.</p>;

  function isRestaurantOpen(hours) {
    if (!hours || hours.open == null || hours.close == null) return true;
    const currentHour = new Date().getHours();
    return currentHour >= hours.open && currentHour < hours.close;
  }

  const isOpen = isRestaurantOpen(hours);

  const menuFilteredBySearch = Object.entries(menu || {}).reduce(
    (acc, [category, items]) => {
      if (!Array.isArray(items)) return acc;

      const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(menuSearchQuery.toLowerCase())
      );
      if (filteredItems.length > 0) {
        acc[category] = filteredItems;
      }
      return acc;
    },
    {}
  );

  const fallbackBanner = "https://via.placeholder.com/1200x400?text=No+Image";
  const fallbackLogo = "https://via.placeholder.com/150?text=No+Logo";

  return (
    <>
      {/* Header Image */}
      <div className="relative w-full h-96">
        <SkeletonImage
          src={bannerImage || fallbackBanner}
          alt={`${name} banner`}
          className={`h-96 w-full object-cover transition duration-500 ${
            !isOpen ? "grayscale brightness-50" : ""
          }`}
        />
        <div className="absolute inset-0 bg-black opacity-60" />

        <button
          onClick={handleGoBack}
          className="absolute flex top-4 left-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white"
        >
          <span className="material-symbols-rounded text-3xl">arrow_back</span>
        </button>
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row gap-4 md:items-start">
            {/* Left: Logo (desktop only) */}
            <div className="hidden md:block flex-shrink-0">
              <img
                src={logo || fallbackLogo}
                alt={`${name} logo`}
                className="w-32 h-32 rounded-lg object-cover border-2 border-white"
              />
            </div>

            {/* Right section for both mobile & desktop */}
            <div className="flex flex-col gap-2 w-full">
              {/* Mobile layout: logo + name side by side */}
              <div className="flex items-center gap-4 md:hidden">
                <img
                  src={logo}
                  alt={`${name} logo`}
                  className="w-20 h-20 rounded-lg object-cover border-2 border-white"
                />
                <h1 className="text-white text-2xl font-bold drop-shadow-lg">
                  {name}
                </h1>
              </div>

              {/* Desktop layout: just the name */}
              <h1 className="hidden md:block text-white text-3xl font-bold drop-shadow-lg">
                {name}
              </h1>

              {/* Info block (always below name) */}
              <div className="w-full md:w-fit rounded-2xl bg-gray-800/70 border border-gray-500/30 shadow-lg px-4 py-3 text-gray-400">
                <span className="text-sm md:text-base leading-snug">
                  ⭐ {rating} · {isOpen ? "Open" : "Closed now"} · Open{" "}
                  {restaurant?.hours?.open}:00–{restaurant?.hours?.close}:00 ·
                  Min. order MKD300.00 · Delivery time: {deliveryTime} mins
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="bg-gray-100 dark:bg-gray-800 min-h-screen px-4 py-6">
        <div className="max-w-[1500px] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="hidden lg:flex text-3xl font-bold text-gray-800 dark:text-white mb-6">
              Menu
            </h2>
            <div className="relative">
              {/* Search input */}
              <span className="material-symbols-rounded absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder={`Search ${name}`}
                value={menuSearchQuery}
                onChange={(e) => setMenuSearchQuery(e.target.value)}
                className="pl-12 pr-10 py-3 rounded-4xl 
                dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 w-full lg:w-70 caret-gray-400 
                border border-gray-300
                focus:outline-none 
                focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 transition-all duration-300 ease"
              />
              {menuSearchQuery && (
                <button
                  onClick={() => setMenuSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-rounded text-xl">
                    close
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {Object.keys(menuFilteredBySearch).length > 0 ? (
              Object.entries(menuFilteredBySearch).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {items.map((item) => (
                      <MenuCard
                        key={item.id}
                        id={item.id}
                        image={item.image}
                        name={item.name}
                        description={item.description}
                        price={item.price}
                        cartIsOpen={isCartOpen}
                        restaurantId={id}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white">No menu items available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

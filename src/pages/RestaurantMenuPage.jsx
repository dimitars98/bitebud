import { useNavigate, useParams } from "react-router-dom";
import MenuCard from "../ui/MenuCard";
import { useRestaurants } from "../contexts/RestaurantContext";
import { useCartOpen } from "../contexts/CartOpenContext";
import { useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import SkeletonImage from "../ui/SkeletonImage";

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const { restaurants, loading: restaurantsLoading } = useRestaurants();
  const { isCartOpen } = useCartOpen();
  const [menuSearchQuery, setMenuSearchQuery] = useState("");

  const restaurant = restaurants.find((r) => r.id === id);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // go back to the previous page
  };

  if (restaurantsLoading) return <LoadingSpinner />;
  if (!restaurant)
    return <p className="text-white p-6">Restaurant not found.</p>;

  const {
    name,
    bannerImage,
    logo,
    menu = [],
    rating,
    deliveryTime,
    distance,
  } = restaurant;

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(menuSearchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header Image */}
      <div className="relative w-full h-96">
        <SkeletonImage
          src={bannerImage}
          alt={`${name} banner`}
          className="h-96"
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
                src={logo}
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
                  ⭐ {rating} · Offline · Open 10:00-23:00 · Min. order
                  MKD300.00 · Delivery time: {deliveryTime} mins
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
            <h2 className="hidden lg:flex text-3xl font-bold text-white mb-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredMenu.length > 0 ? (
              filteredMenu.map((item) => (
                <MenuCard
                  key={item.id}
                  id={item.id}
                  image={item.image}
                  name={item.name}
                  ingredients={item.ingredients}
                  price={item.price}
                  cartIsOpen={isCartOpen}
                />
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

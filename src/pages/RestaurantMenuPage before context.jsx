import { useParams } from "react-router-dom";
import MenuCard from "../ui/MenuCard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useCartOpen } from "../contexts/CartOpenContext";
import SkeletonImage from "../ui/SkeletonImage";

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [menuSearchQuery, setMenuSearchQuery] = useState("");

  const { isCartOpen } = useCartOpen();

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const docRef = doc(db, "restaurants", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRestaurant({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Restaurant not found");
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurant();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!restaurant)
    return <p className="text-white p-6">Restaurant not found.</p>;

  const { name, bannerImage, logo, menu = [] } = restaurant;

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
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" /> */}
        <div className="absolute inset-0 bg-black opacity-60" />

        {/* Logo & Name centered in container */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="max-w-[1500px] mx-auto flex items-center space-x-4">
            <img
              src={logo}
              alt={`${name} logo`}
              className="w-32 h-32 rounded-lg object-cover border-2 border-white"
            />
            <div className="flex flex-col gap-4">
              <h1 className="text-white text-3xl font-bold drop-shadow-lg">
                {name}
              </h1>
              <div className="w-100 h-20 rounded-2xl bg-gray-800/70  border border-gray-500/30 shadow-lg flex justify-center items-center text-gray-400">
                <span>4.8 Offline · Open all day · Min. order MKD300.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="bg-gray-800 min-h-screen px-4 py-6">
        <div className="max-w-[1500px] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="hidden lg:flex text-3xl font-bold text-white mb-6">
              Menu
            </h2>
            <div className="relative">
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

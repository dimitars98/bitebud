import { useParams, useLocation } from "react-router-dom";
import MenuCard from "../ui/MenuCard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // adjust path if needed
import { useEffect, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner"; // if you have one
import { useCartOpen } from "../contexts/CartOpenContext";

export default function RestaurantMenuPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <div className="flex flex-col justify-center relative w-screen h-96 overflow-hidden">
        <img
          src={bannerImage}
          alt={`${name} banner`}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>

        <div className="absolute bottom-4 left-4 flex items-center space-x-4">
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-32 h-32 rounded-lg object-cover border-2 border-white"
          />
          <h1 className="text-white text-3xl font-bold drop-shadow-lg">
            {name}
          </h1>
        </div>
      </div>

      <div className="bg-gray-800 min-h-screen p-6">
        <h2 className="text-3xl font-bold text-white mb-6">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
          {menu.length > 0 ? (
            menu.map((item) => (
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
    </>
  );
}

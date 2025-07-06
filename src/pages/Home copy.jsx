import React, { useEffect, useState } from "react";

import RestaurantCard from "../components/RestaurantCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Categories from "../components/Categories";
import LoadingSpinner from "../ui/LoadingSpinner";

// const mockRestaurants = [
//   {
//     name: "Sushi Samba",
//     image:
//       "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     rating: 4.7,
//     deliveryTime: 30,
//   },
//   {
//     name: "Burger Town",
//     image:
//       "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     rating: 4.5,
//     deliveryTime: 25,
//   },

//   {
//     name: "Pasta Palace",
//     image:
//       "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
//     rating: 4.6,
//     deliveryTime: 28,
//   },
//   {
//     name: "Curry Kingdom",
//     image:
//       "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     rating: 4.8,
//     deliveryTime: 35,
//   },
//   {
//     name: "Taco Haven",
//     image:
//       "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     rating: 4.4,
//     deliveryTime: 20,
//   },
//   {
//     name: "Dragon Wok",
//     image:
//       "https://images.unsplash.com/photo-1636479649370-fa89fbe0a1ec?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     rating: 4.3,
//     deliveryTime: 32,
//   },
//   {
//     name: "Le Petit Bistro",
//     image:
//       "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
//     rating: 4.7,
//     deliveryTime: 27,
//   },
//   {
//     name: "Mediterraneo",
//     image:
//       "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=80",
//     rating: 4.6,
//     deliveryTime: 29,
//   },
//   {
//     name: "Taste of Seoul",
//     image:
//       "https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     rating: 4.8,
//     deliveryTime: 26,
//   },
//   {
//     name: "Greek Grill",
//     image:
//       "https://images.unsplash.com/photo-1573126161855-f9633aa8a9f0?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     rating: 4.5,
//     deliveryTime: 31,
//   },
//   {
//     name: "Casa Mexicana",
//     image:
//       "https://images.unsplash.com/photo-1680992071073-cb1696ba8d3e?q=80&w=2674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     rating: 4.6,
//     deliveryTime: 22,
//   },

//   {
//     name: "Brazilian Bites",
//     image:
//       "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=80",
//     rating: 4.4,
//     deliveryTime: 24,
//   },
// ];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const restaurantsRef = collection(db, "restaurants");
        const snapshot = await getDocs(restaurantsRef);
        const restaurantsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(restaurantsData);
      } catch (error) {
        console.error("Error fetching restaurants: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="h-screen">
      <Categories />
      <section className="mx-[400px] p-6 grid grid-cols-4 gap-4 bg-white">
        {restaurants.length === 0 ? (
          <p>No restaurants found.</p>
        ) : (
          restaurants.map((rest) => <RestaurantCard key={rest.id} {...rest} />)
        )}
      </section>
    </div>
  );
}

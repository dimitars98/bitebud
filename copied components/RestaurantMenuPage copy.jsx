import { useParams, useLocation } from "react-router-dom";
import MenuCard from "../ui/MenuCard";

const sampleMenu = [
  {
    id: 1,
    name: "Grilled Chicken",
    image:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ingredients: "Chicken, mushrooms in sauce, mixed vegetables",
    price: 350,
  },
  {
    id: 2,
    name: "Vegan Salad",
    image: "/images/vegan-salad.jpg",
    ingredients: "Lettuce, tomatoes, avocado, nuts",
    price: 300,
  },
  // more menu items...
];

// Sample restaurant data (replace with fetched data by id)
const sampleRestaurant = {
  name: "Restaurant name",
  bannerImage:
    "https://images.unsplash.com/photo-1707592357743-5e25b277ca36?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  logo: "/images/restaurant-logo.png",
};

export default function RestaurantMenuPage() {
  const location = useLocation();
  const restaurantData = location.state;

  const { id } = useParams();

  // You would fetch restaurant and menu data here by id instead of using sampleRestaurant/sampleMenu

  return (
    <>
      <div className="relative w-screen h-96 overflow-hidden">
        <img
          src={sampleRestaurant.bannerImage}
          alt={`${sampleRestaurant.name} banner`}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>

        <div className="absolute bottom-4 left-4 flex items-center space-x-4">
          <img
            src={sampleRestaurant.logo}
            alt={`${sampleRestaurant.name} logo`}
            className="w-16 h-16 rounded-full object-cover border-2 border-white"
          />
          <h1 className="text-white text-3xl font-bold drop-shadow-lg">
            {restaurantData?.name}
          </h1>
        </div>
      </div>
      <div className="bg-gray-800 min-h-screen">
        {/* Banner */}

        {/* Menu Section */}
        <div className="p-6">
          <h2 className="text-3xl font-bold text-white mb-6">Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
            {sampleMenu.map((item) => (
              <MenuCard
                key={item.id}
                image={item.image}
                name={item.name}
                ingredients={item.ingredients}
                price={item.price}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

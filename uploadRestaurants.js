import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdulm9r3uD8Bz-Fv6skUIKtN2Y1AN6jPc",
  authDomain: "food-delivery-app-a127f.firebaseapp.com",
  projectId: "food-delivery-app-a127f",
  storageBucket: "food-delivery-app-a127f.firebasestorage.app",
  messagingSenderId: "596551885614",
  appId: "1:596551885614:web:cf51c2b3e14e4f22f9d0bf",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function getRandomLatLng() {
  const lat = 41.98 + Math.random() * (42.0 - 41.98);
  const lng = 21.43 + Math.random() * (21.46 - 21.43);
  return { lat: parseFloat(lat.toFixed(7)), lng: parseFloat(lng.toFixed(7)) };
}

const restaurants = [
  {
    name: "The Hungry Goat",
    city: "Skopje",
    rating: 4.7,
    categories: "Modern, Fusion, BBQ",
    hours: { open: 8, close: 23 },
    tags: ["Free delivery", "Vegetarian"],
    orderNum: 0,
    address: "Partizanski Odredi Blvd",
    location: getRandomLatLng(),
    deliveryTime: 47,
    image:
      "https://images.unsplash.com/photo-1652282564241-c3a728e83d0b?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Fusion",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Avocado Toast",
          description: "Toasted bread topped with smashed avocado.",
          price: 6.42,
          image: "",
        },
        {
          id: 2,
          name: "Berry Pancakes",
          description: "Fluffy pancakes with berries and syrup.",
          price: 6.89,
          image: "",
        },
      ],
      Soups: [
        {
          id: 3,
          name: "Tomato Basil Soup",
          description: "Creamy tomato soup with basil.",
          price: 4.85,
          image: "",
        },
      ],
      Salads: [
        {
          id: 4,
          name: "Greek Salad",
          description: "Cucumbers, tomatoes, olives, feta cheese.",
          price: 4.34,
          image: "",
        },
        {
          id: 5,
          name: "Quinoa Bowl",
          description: "Quinoa with grilled vegetables.",
          price: 5.61,
          image: "",
        },
      ],
      BBQ: [
        {
          id: 6,
          name: "Pulled Pork Sandwich",
          description: "Slow-cooked pork in BBQ sauce.",
          price: 10.62,
          image: "",
        },
        {
          id: 7,
          name: "BBQ Ribs",
          description: "Tender ribs glazed in smoky BBQ.",
          price: 11.83,
          image: "",
        },
      ],
    },
  },
  {
    name: "Taverna Vardar",
    city: "Skopje",
    rating: 4.4,
    categories: "Pizza, Italian, Pasta",
    hours: { open: 11, close: 23 },
    tags: ["Vegetarian"],
    orderNum: 0,
    address: "Makedonija St",
    location: getRandomLatLng(),
    deliveryTime: 41,
    image:
      "https://images.unsplash.com/photo-1746211108786-ca20c8f80ecd?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Italian",
    menu: {
      Pizzas: [
        {
          id: 1,
          name: "Margherita",
          description: "Tomato sauce, mozzarella, fresh basil.",
          price: 8.95,
          image: "",
        },
        {
          id: 2,
          name: "Pepperoni",
          description: "Tomato sauce, mozzarella, pepperoni slices.",
          price: 9.89,
          image: "",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Caesar Salad",
          description: "Romaine, parmesan, croutons, Caesar dressing.",
          price: 6.5,
          image: "",
        },
      ],
      Soups: [
        {
          id: 4,
          name: "Minestrone",
          description: "Classic Italian vegetable soup.",
          price: 5.2,
          image: "",
        },
      ],
      Desserts: [
        {
          id: 5,
          name: "Tiramisu",
          description: "Coffee-flavored Italian dessert.",
          price: 6.75,
          image: "",
        },
      ],
    },
  },
  {
    name: "Cedar Street Eats",
    city: "Skopje",
    rating: 4.5,
    categories: "American, BBQ",
    hours: { open: 9, close: 22 },
    tags: ["Free delivery", "Vegan"],
    orderNum: 0,
    address: "Cedar St 21",
    location: getRandomLatLng(),
    deliveryTime: 39,
    image:
      "https://images.unsplash.com/photo-1709581529998-11b7b2e17f55?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "American",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Berry Pancakes",
          description: "Fluffy pancakes with berries and syrup.",
          price: 6.89,
          image: "",
        },
      ],
      BBQ: [
        {
          id: 2,
          name: "BBQ Ribs",
          description: "Tender ribs glazed in smoky BBQ.",
          price: 11.83,
          image: "",
        },
        {
          id: 3,
          name: "Pulled Pork Sandwich",
          description: "Slow-cooked pork in BBQ sauce.",
          price: 10.62,
          image: "",
        },
      ],
      Salads: [
        {
          id: 4,
          name: "Quinoa Bowl",
          description: "Quinoa with grilled vegetables.",
          price: 5.61,
          image: "",
        },
      ],
      Drinks: [
        {
          id: 5,
          name: "Fresh Lemonade",
          description: "Freshly squeezed lemonade with mint.",
          price: 3.0,
          image: "",
        },
      ],
    },
  },
  {
    name: "Green Leaf Bistro",
    city: "Skopje",
    rating: 4.8,
    categories: "Vegetarian, Vegan, Healthy",
    hours: { open: 7, close: 21 },
    tags: ["Vegan", "Free delivery"],
    orderNum: 0,
    address: "Petrovec Road 5",
    location: getRandomLatLng(),
    deliveryTime: 45,
    image:
      "https://images.unsplash.com/photo-1650092194571-d3c1534562be?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Vegan",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Avocado Toast",
          description: "Toasted bread topped with smashed avocado.",
          price: 6.42,
          image: "",
        },
      ],
      Salads: [
        {
          id: 2,
          name: "Kale & Quinoa Salad",
          description: "Kale, quinoa, almonds, lemon dressing.",
          price: 6.3,
          image: "",
        },
      ],
      Soups: [
        {
          id: 3,
          name: "Butternut Squash Soup",
          description: "Smooth and creamy butternut squash soup.",
          price: 5.0,
          image: "",
        },
      ],
      Desserts: [
        {
          id: 4,
          name: "Chia Seed Pudding",
          description: "Chia pudding with coconut milk and berries.",
          price: 5.5,
          image: "",
        },
      ],
    },
  },
  {
    name: "Riverbank Grill",
    city: "Skopje",
    rating: 4.2,
    categories: "BBQ, American",
    hours: { open: 11, close: 22 },
    tags: ["Free delivery"],
    orderNum: 0,
    address: "Bulevar Partizanski Odredi 33",
    location: getRandomLatLng(),
    deliveryTime: 42,
    image:
      "https://images.unsplash.com/photo-1560380185-9644d262854c?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "BBQ",
    menu: {
      BBQ: [
        {
          id: 1,
          name: "Pulled Pork Sandwich",
          description: "Slow-cooked pork in BBQ sauce.",
          price: 10.62,
          image: "",
        },
        {
          id: 2,
          name: "Grilled Sausage Platter",
          description: "Assorted grilled sausages.",
          price: 11.19,
          image: "",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Coleslaw",
          description: "Classic cabbage and carrot coleslaw.",
          price: 3.5,
          image: "",
        },
      ],
      Drinks: [
        {
          id: 4,
          name: "Craft Beer",
          description: "Locally brewed craft beer.",
          price: 4.0,
          image: "",
        },
      ],
      Desserts: [
        {
          id: 5,
          name: "Apple Pie",
          description: "Warm apple pie with cinnamon.",
          price: 5.75,
          image: "",
        },
      ],
    },
  },
  {
    name: "Skopje Spice",
    city: "Skopje",
    rating: 4.6,
    categories: "Mediterranean, Vegan",
    hours: { open: 7, close: 22 },
    tags: ["Vegan", "Free delivery"],
    orderNum: 0,
    address: "Orce Nikolov 25",
    location: getRandomLatLng(),
    deliveryTime: 43,
    image:
      "https://images.unsplash.com/photo-1649138783888-0ec9c3ec2f21?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Mediterranean",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Falafel Wrap",
          description: "Falafel with fresh veggies and tahini sauce.",
          price: 7.5,
          image: "",
        },
      ],
      Salads: [
        {
          id: 2,
          name: "Tabbouleh",
          description: "Parsley, bulgur, tomato, lemon dressing.",
          price: 5.25,
          image: "",
        },
      ],
      Soups: [
        {
          id: 3,
          name: "Lentil Soup",
          description: "Hearty lentil soup with spices.",
          price: 4.5,
          image: "",
        },
      ],
      Drinks: [
        {
          id: 4,
          name: "Mint Tea",
          description: "Refreshing hot mint tea.",
          price: 2.5,
          image: "",
        },
      ],
    },
  },
  {
    name: "Urban Grill House",
    city: "Skopje",
    rating: 4.1,
    categories: "BBQ, American",
    hours: { open: 10, close: 23 },
    tags: ["Free delivery"],
    orderNum: 0,
    address: "Ilinden Blvd 12",
    location: getRandomLatLng(),
    deliveryTime: 40,
    image:
      "https://images.unsplash.com/photo-1703848651274-331fa8fbe3f8?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "BBQ",
    menu: {
      BBQ: [
        {
          id: 1,
          name: "Pulled Pork Sandwich",
          description: "Slow-cooked pork in BBQ sauce.",
          price: 10.62,
          image: "",
        },
        {
          id: 2,
          name: "Grilled Sausage Platter",
          description: "Assorted grilled sausages.",
          price: 11.19,
          image: "",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Greek Salad",
          description: "Cucumbers, tomatoes, olives, feta cheese.",
          price: 4.34,
          image: "",
        },
      ],
      Drinks: [
        {
          id: 4,
          name: "Craft Soda",
          description: "Locally made craft sodas in various flavors.",
          price: 3.5,
          image: "",
        },
      ],
      Desserts: [
        {
          id: 5,
          name: "Brownie",
          description: "Chocolate fudge brownie with walnuts.",
          price: 4.75,
          image: "",
        },
      ],
    },
  },
  {
    name: "Sunset Deli",
    city: "Skopje",
    rating: 4.4,
    categories: "Vegetarian, Fusion",
    hours: { open: 7, close: 21 },
    tags: ["Vegetarian"],
    orderNum: 0,
    address: "Sunset Blvd 8",
    location: getRandomLatLng(),
    deliveryTime: 38,
    image:
      "https://images.unsplash.com/photo-1629445675409-88dfe3acc603?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Fusion",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Berry Pancakes",
          description: "Fluffy pancakes with berries and syrup.",
          price: 6.89,
          image: "",
        },
      ],
      Soups: [
        {
          id: 2,
          name: "Tomato Basil Soup",
          description: "Creamy tomato soup with basil.",
          price: 4.85,
          image: "",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Quinoa Bowl",
          description: "Quinoa with grilled vegetables.",
          price: 5.61,
          image: "",
        },
      ],
      Desserts: [
        {
          id: 4,
          name: "Chia Seed Pudding",
          description: "Chia pudding with coconut milk and berries.",
          price: 5.5,
          image: "",
        },
      ],
    },
  },
  {
    name: "Urban Pizzeria",
    city: "Skopje",
    rating: 4.2,
    categories: "Pizza, BBQ, Salads, Soups",
    hours: { open: 11, close: 23 },
    tags: ["Free delivery"],
    orderNum: 0,
    address: "Makedonska Street 45",
    location: getRandomLatLng(),
    deliveryTime: 38,
    image:
      "https://images.unsplash.com/photo-1581873372796-635b67ca2008?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHBpenphfGVufDB8fDB8fHwy",
    cuisine: "Italian",
    menu: {
      Pizza: [
        {
          id: 1,
          name: "Margherita",
          description: "Classic pizza with tomato, mozzarella, and basil.",
          price: 7.95,
          image: "",
        },
        {
          id: 2,
          name: "Pepperoni",
          description: "Spicy pepperoni with mozzarella cheese.",
          price: 8.65,
          image: "",
        },
      ],
      BBQ: [
        {
          id: 3,
          name: "BBQ Chicken Wings",
          description: "Grilled chicken wings with BBQ sauce.",
          price: 6.5,
          image: "",
        },
      ],
      Salads: [
        {
          id: 4,
          name: "Caesar Salad",
          description: "Romaine lettuce, parmesan, croutons, Caesar dressing.",
          price: 5.25,
          image: "",
        },
      ],
      Soups: [
        {
          id: 5,
          name: "Minestrone Soup",
          description: "Vegetable soup with beans and pasta.",
          price: 4.75,
          image: "",
        },
      ],
    },
  },

  {
    name: "Cozy Corner Cafe",
    city: "Skopje",
    rating: 4.7,
    categories: "Breakfast, Vegetarian",
    hours: { open: 6, close: 20 },
    tags: ["Vegetarian", "Free delivery"],
    orderNum: 0,
    address: "Petrovec Street 12",
    location: getRandomLatLng(),
    deliveryTime: 36,
    image:
      "https://images.unsplash.com/photo-1573500883698-e3ef47a95feb?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Cafe",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Avocado Toast",
          description: "Toasted bread topped with smashed avocado.",
          price: 6.42,
          image: "",
        },
        {
          id: 2,
          name: "Berry Pancakes",
          description: "Fluffy pancakes with berries and syrup.",
          price: 6.89,
          image: "",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Greek Salad",
          description: "Cucumbers, tomatoes, olives, feta cheese.",
          price: 4.34,
          image: "",
        },
      ],
      Desserts: [
        {
          id: 4,
          name: "Chia Seed Pudding",
          description: "Chia pudding with coconut milk and berries.",
          price: 5.5,
          image: "",
        },
      ],
      Drinks: [
        {
          id: 5,
          name: "Fresh Lemonade",
          description: "Freshly squeezed lemonade with mint.",
          price: 3.0,
          image: "",
        },
      ],
    },
  },

  {
    name: "Taverna Skopje",
    city: "Skopje",
    rating: 4.6,
    categories: "Mediterranean, Greek",
    hours: { open: 11, close: 23 },
    tags: ["Vegetarian", "Free delivery"],
    orderNum: 0,
    address: "Macedonia Square 5",
    location: { lat: 41.9983, lng: 21.425 },
    deliveryTime: 35,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2295&auto=format&fit=crop",
    cuisine: "Mediterranean",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Greek Yogurt with Honey",
          price: 3.5,
          description: "Creamy yogurt topped with local honey and walnuts",
          tags: ["Vegetarian"],
        },
        {
          id: 2,
          name: "Spinach and Feta Omelette",
          price: 6,
          description: "Fluffy omelette with fresh spinach and feta cheese",
          tags: ["Vegetarian"],
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Greek Salad",
          price: 5,
          description: "Tomatoes, cucumbers, olives, onions, and feta cheese",
          tags: ["Vegetarian"],
        },
        {
          id: 4,
          name: "Mediterranean Chickpea Salad",
          price: 6,
          description: "Chickpeas, parsley, lemon dressing, and fresh veggies",
          tags: ["Vegan"],
        },
      ],
      Soups: [
        {
          id: 5,
          name: "Lentil Soup",
          price: 4,
          description: "Traditional lentil soup with herbs and vegetables",
          tags: ["Vegan"],
        },
      ],
      BBQ: [
        {
          id: 6,
          name: "Grilled Lamb Chops",
          price: 12,
          description: "Juicy lamb chops marinated with herbs and garlic",
          tags: [],
        },
      ],
      Desserts: [
        {
          id: 7,
          name: "Baklava",
          price: 4,
          description: "Sweet layered pastry with nuts and honey syrup",
          tags: ["Vegetarian"],
        },
      ],
    },
  },
  {
    name: "Skopje Sushi House",
    city: "Skopje",
    rating: 4.7,
    categories: "Japanese, Sushi",
    hours: { open: 12, close: 22 },
    tags: ["Free delivery"],
    orderNum: 0,
    address: "Vodno Blvd 10",
    location: { lat: 41.985, lng: 21.43 },
    deliveryTime: 30,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2295&auto=format&fit=crop",
    cuisine: "Japanese",
    menu: {
      Sushi: [
        {
          id: 1,
          name: "California Roll",
          price: 8,
          description:
            "Crab meat, avocado, and cucumber rolled with rice and seaweed",
        },
        {
          id: 2,
          name: "Spicy Tuna Roll",
          price: 9,
          description: "Fresh tuna with spicy mayo and cucumber",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Seaweed Salad",
          price: 5,
          description: "Fresh seaweed marinated with sesame and vinegar",
        },
      ],
      Soups: [
        {
          id: 4,
          name: "Miso Soup",
          price: 3,
          description: "Traditional miso broth with tofu and seaweed",
        },
      ],
      Appetizers: [
        {
          id: 5,
          name: "Edamame",
          price: 4,
          description: "Steamed young soybeans with sea salt",
        },
      ],
    },
  },
  {
    name: "Pizzeria Bella",
    city: "Skopje",
    rating: 4.5,
    categories: "Italian, Pizzeria",
    hours: { open: 11, close: 23 },
    tags: ["Free delivery", "Vegetarian"],
    orderNum: 0,
    address: "Ilinden St. 22",
    location: { lat: 41.9932, lng: 21.4431 },
    deliveryTime: 40,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Italian",
    menu: {
      Pizzas: [
        {
          id: 1,
          name: "Margherita",
          price: 7,
          description: "Tomato sauce, mozzarella, fresh basil",
        },
        {
          id: 2,
          name: "Pepperoni",
          price: 9,
          description: "Tomato sauce, mozzarella, pepperoni",
        },
      ],
      Pasta: [
        {
          id: 3,
          name: "Spaghetti Carbonara",
          price: 10,
          description: "Spaghetti with pancetta, eggs, and cheese",
        },
      ],
      Salads: [
        {
          id: 4,
          name: "Caprese Salad",
          price: 6,
          description: "Tomato, mozzarella, and basil with balsamic glaze",
        },
      ],
      BBQ: [
        {
          id: 5,
          name: "BBQ Chicken Pizza",
          price: 11,
          description: "Pizza with BBQ sauce, grilled chicken, and onions",
        },
      ],
      Desserts: [
        {
          id: 6,
          name: "Tiramisu",
          price: 5,
          description: "Classic coffee-flavored Italian dessert",
        },
      ],
    },
  },
  {
    name: "Green Garden Vegan",
    city: "Skopje",
    rating: 4.8,
    categories: "Vegan, Healthy",
    hours: { open: 9, close: 21 },
    tags: ["Vegan", "Free delivery"],
    orderNum: 0,
    address: "Boris Trajkovski Blvd 18",
    location: { lat: 41.9797, lng: 21.4443 },
    deliveryTime: 25,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2295&auto=format&fit=crop",
    cuisine: "Vegan",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Avocado Toast",
          price: 5,
          description:
            "Whole grain toast topped with smashed avocado and cherry tomatoes",
        },
        {
          id: 2,
          name: "Smoothie Bowl",
          price: 6,
          description: "Mixed berries, banana, and granola bowl",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Quinoa Salad",
          price: 7,
          description: "Quinoa, cucumber, tomato, and lemon dressing",
        },
        {
          id: 4,
          name: "Kale Caesar",
          price: 8,
          description: "Kale leaves with vegan Caesar dressing and croutons",
        },
      ],
      Soups: [
        {
          id: 5,
          name: "Pumpkin Soup",
          price: 5,
          description: "Creamy pumpkin soup with spices",
        },
      ],
      Desserts: [
        {
          id: 6,
          name: "Chia Pudding",
          price: 4,
          description: "Chia seeds soaked in almond milk with fresh fruit",
        },
      ],
    },
  },
  {
    name: "Grill Master",
    city: "Skopje",
    rating: 4.4,
    categories: "BBQ, American",
    hours: { open: 12, close: 23 },
    tags: ["Free delivery"],
    orderNum: 0,
    address: "Partizanska St. 35",
    location: { lat: 41.991, lng: 21.4535 },
    deliveryTime: 45,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "American",
    menu: {
      BBQ: [
        {
          id: 1,
          name: "Smoked Ribs",
          price: 14,
          description: "Slow smoked pork ribs with BBQ sauce",
        },
        {
          id: 2,
          name: "BBQ Pulled Pork Sandwich",
          price: 9,
          description: "Pulled pork with coleslaw on a toasted bun",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Coleslaw",
          price: 4,
          description: "Creamy cabbage and carrot salad",
        },
      ],
      Appetizers: [
        {
          id: 4,
          name: "Onion Rings",
          price: 5,
          description: "Crispy fried onion rings with dipping sauce",
        },
      ],
      Desserts: [
        {
          id: 5,
          name: "Apple Pie",
          price: 5,
          description: "Classic apple pie with vanilla ice cream",
        },
      ],
    },
  },
];

async function uploadRestaurants() {
  for (const restaurant of restaurants) {
    try {
      const restaurantsRef = collection(db, "restaurants");
      const q = query(restaurantsRef, where("name", "==", restaurant.name));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Add new restaurant with restaurantId = doc ID
        const newDocRef = doc(restaurantsRef);
        await setDoc(newDocRef, { ...restaurant, restaurantId: newDocRef.id });
        console.log(`Added new restaurant: ${restaurant.name}`);
      } else {
        // Update existing, add restaurantId = doc ID too
        querySnapshot.forEach(async (docSnap) => {
          await setDoc(docSnap.ref, {
            ...restaurant,
            restaurantId: docSnap.id,
          });

          console.log(`Updated restaurant: ${restaurant.name}`);
        });
      }
    } catch (error) {
      console.error("Error uploading restaurant:", error);
    }
  }
}

uploadRestaurants();

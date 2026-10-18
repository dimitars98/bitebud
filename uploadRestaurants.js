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
import slugify from "slugify";

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

function addSlugsToMenu(menu) {
  const result = {};

  for (const [category, items] of Object.entries(menu)) {
    result[category] = items.map((item) => ({
      ...item,
      slug: slugify(item.name, { lower: true, strict: true }),
    }));
  }

  return result;
}

const restaurants = [
  {
    name: "The Hungry Goat",
    city: "Skopje",
    rating: 4.7,
    trending: true,
    categories: "Modern, Fusion, BBQ, Burger, Salad, Desert",
    hours: { open: 8, close: 23 },
    tags: ["Free delivery", "Vegetarian"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",
    address: "Partizanski Odredi Blvd",
    location: getRandomLatLng(),
    deliveryTime: 47,
    bannerImage:
      "https://images.unsplash.com/photo-1600891964923-c75689eb86d0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1652282564241-c3a728e83d0b?q=100&w=1200&auto=format&fit=crop",
    cuisine: "Fusion",
    menu: {
      Starters: [
        {
          id: 1,
          name: "Crispy Goat Cheese Bites",
          description: "Breaded goat cheese balls with honey drizzle.",
          price: 7.25,
          image:
            "https://images.unsplash.com/photo-1734774924912-dcbb467f8599?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 2,
          name: "Spicy Edamame",
          description: "Steamed edamame tossed in chili garlic sauce.",
          price: 5.5,
          image:
            "https://images.unsplash.com/photo-1624034767209-4afc3dc076b4?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Mains: [
        {
          id: 3,
          name: "Fusion Lamb Burger",
          description:
            "Grilled lamb patty with tzatziki and caramelized onions.",
          price: 12.4,
          image:
            "https://images.unsplash.com/photo-1583086987435-49e189663659?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 4,
          name: "Teriyaki Salmon Bowl",
          description:
            "Salmon fillet glazed with teriyaki, served over jasmine rice.",
          price: 13.9,
          image:
            "https://images.unsplash.com/photo-1625229466790-62bae5ab4ff4?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Sides: [
        {
          id: 6,
          name: "Sweet Potato Fries",
          description: "Crispy sweet potato fries with chipotle mayo.",
          price: 4.95,
          image:
            "https://images.unsplash.com/photo-1543353071-087092ec393a?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 7,
          name: "Charred Corn Salad",
          description: "Grilled corn, feta, lime, and herbs.",
          price: 5.75,
          image:
            "https://images.unsplash.com/photo-1632992468854-7b1d83134bc4?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Desserts: [
        {
          id: 8,
          name: "Goat Milk Panna Cotta",
          description: "Creamy panna cotta with berry compote.",
          price: 6.5,
          image:
            "https://images.unsplash.com/photo-1542116021-0ff087fb0a41?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 9,
          name: "Chocolate Lava Cake",
          description: "Rich chocolate cake with molten center.",
          price: 7.2,
          image:
            "https://images.unsplash.com/photo-1673551490812-eaee2e9bf0ef?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Drinks: [
        {
          id: 10,
          name: "House Lemonade",
          description: "Fresh lemonade infused with rosemary.",
          price: 3.5,
          image:
            "https://images.unsplash.com/photo-1656936632096-59fcacae533f?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 11,
          name: "Craft IPA",
          description: "Local craft beer with citrus notes.",
          price: 4.8,
          image:
            "https://images.unsplash.com/photo-1642191572702-329abe6282d2?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },
  {
    name: "Taverna Vardar",
    city: "Skopje",
    rating: 4.4,
    trending: true,
    categories: "Pizza, Italian, Pasta, Salad, Desert",
    hours: { open: 11, close: 23 },
    tags: ["Vegetarian"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",

    address: "Makedonija St",
    location: getRandomLatLng(),
    deliveryTime: 41,
    bannerImage:
      "https://images.unsplash.com/photo-1716959669858-11d415bdead6?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1746211108786-ca20c8f80ecd?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Italian",
    menu: {
      Pizzas: [
        {
          id: 1,
          name: "Margherita",
          description: "Tomato sauce, mozzarella, fresh basil.",
          price: 8.95,
          image:
            "https://images.unsplash.com/photo-1564936281291-294551497d81?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 2,
          name: "Pepperoni",
          description: "Tomato sauce, mozzarella, pepperoni slices.",
          price: 9.89,
          image:
            "https://images.unsplash.com/photo-1564128442383-9201fcc740eb?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Caesar Salad",
          description: "Romaine, parmesan, croutons, Caesar dressing.",
          price: 6.5,
          image:
            "https://images.unsplash.com/photo-1746211108786-ca20c8f80ecd?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Soups: [
        {
          id: 4,
          name: "Minestrone",
          description: "Classic Italian vegetable soup.",
          price: 5.2,
          image:
            "https://images.unsplash.com/photo-1745653418014-76dd881db5ea?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Desserts: [
        {
          id: 5,
          name: "Tiramisu",
          description: "Coffee-flavored Italian dessert.",
          price: 6.75,
          image:
            "https://images.unsplash.com/photo-1712262582593-e13609aaf12b?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },
  {
    name: "Cedar Street Eats",
    city: "Skopje",
    rating: 4.5,
    trending: true,
    categories: "American, BBQ, Sandwiches, Salad",
    hours: { open: 9, close: 22 },
    tags: ["Free delivery", "Vegan"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",
    address: "Cedar St 21",
    location: getRandomLatLng(),
    deliveryTime: 39,
    bannerImage:
      "https://images.unsplash.com/photo-1653235520911-4f1b8edb5a64?q=80&w=1782&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1709581529998-11b7b2e17f55?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "American",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Berry Pancakes",
          description: "Fluffy pancakes with berries and syrup.",
          price: 6.89,
          image:
            "https://images.unsplash.com/photo-1572269608529-3fe02ee4a4f3?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      BBQ: [
        {
          id: 2,
          name: "BBQ Ribs",
          description: "Tender ribs glazed in smoky BBQ.",
          price: 11.83,
          image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 3,
          name: "Pulled Pork Sandwich",
          description: "Slow-cooked pork in BBQ sauce.",
          price: 10.62,
          image:
            "https://images.unsplash.com/photo-1709581529998-11b7b2e17f55?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 4,
          name: "Quinoa Bowl",
          description: "Quinoa with grilled vegetables.",
          price: 5.61,
          image:
            "https://images.unsplash.com/photo-1615865417491-9941019fbc00?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Drinks: [
        {
          id: 5,
          name: "Fresh Lemonade",
          description: "Freshly squeezed lemonade with mint.",
          price: 3.0,
          image:
            "https://images.unsplash.com/photo-1665582295782-eecc2e25b74f?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },
  {
    name: "Green Leaf Bistro",
    city: "Skopje",
    rating: 4.8,
    trending: false,
    categories: "Vegetarian, Vegan, Healthy, Salad, Desert",
    hours: { open: 7, close: 21 },
    tags: ["Vegan", "Free delivery"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",
    address: "Petrovec Road 5",
    location: getRandomLatLng(),
    deliveryTime: 45,
    bannerImage:
      "https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1650092194571-d3c1534562be?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Vegan",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Avocado Toast",
          description: "Toasted bread topped with smashed avocado.",
          price: 6.42,
          image:
            "https://images.unsplash.com/photo-1641283339694-f7bc5b3673ca?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 2,
          name: "Kale & Quinoa Salad",
          description: "Kale, quinoa, almonds, lemon dressing.",
          price: 6.3,
          image:
            "https://images.unsplash.com/photo-1722032617357-7b09276b1a8d?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Soups: [
        {
          id: 3,
          name: "Butternut Squash Soup",
          description: "Smooth and creamy butternut squash soup.",
          price: 5.0,
          image:
            "https://images.unsplash.com/photo-1666083580269-6f409e1765d8?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Desserts: [
        {
          id: 4,
          name: "Chia Seed Pudding",
          description: "Chia pudding with coconut milk and berries.",
          price: 5.5,
          image:
            "https://images.unsplash.com/photo-1588911551705-cb0e32ae6858?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },
  {
    name: "Riverbank Grill",
    city: "Skopje",
    rating: 4.2,
    trending: true,
    categories: "BBQ, American, Sandwiches, Salad, Desert",
    hours: { open: 11, close: 22 },
    tags: ["Free delivery"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",

    address: "Bulevar Partizanski Odredi 33",
    location: getRandomLatLng(),
    deliveryTime: 42,
    bannerImage:
      "https://images.unsplash.com/photo-1709581529998-11b7b2e17f55?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1560380185-9644d262854c?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "BBQ",
    menu: {
      BBQ: [
        {
          id: 1,
          name: "Pulled Pork Sandwich",
          description: "Slow-cooked pork in BBQ sauce.",
          price: 10.62,
          image:
            "https://images.unsplash.com/photo-1709581529998-11b7b2e17f55?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 2,
          name: "Grilled Sausage Platter",
          description: "Assorted grilled sausages.",
          price: 11.19,
          image:
            "https://images.unsplash.com/photo-1654603545248-f5e786d94671?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Coleslaw",
          description: "Classic cabbage and carrot coleslaw.",
          price: 3.5,
          image:
            "https://images.unsplash.com/photo-1537784969314-05a37106f68e?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Drinks: [
        {
          id: 4,
          name: "Craft Beer",
          description: "Locally brewed craft beer.",
          price: 4.0,
          image:
            "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Desserts: [
        {
          id: 5,
          name: "Apple Pie",
          description: "Warm apple pie with cinnamon.",
          price: 5.75,
          image:
            "https://images.unsplash.com/photo-1584541305671-af4f46b4be2f?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },
  {
    name: "Skopje Spice",
    city: "Skopje",
    rating: 4.6,
    trending: true,
    categories: "Mediterranean, Vegan, Arabic",
    hours: { open: 7, close: 22 },
    tags: ["Vegan", "Free delivery"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",

    address: "Orce Nikolov 25",
    location: getRandomLatLng(),
    deliveryTime: 43,
    bannerImage:
      "https://images.unsplash.com/photo-1710091691780-c7eb0dc50cf8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1649138783888-0ec9c3ec2f21?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Mediterranean",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Falafel Wrap",
          description: "Falafel with fresh veggies and tahini sauce.",
          price: 7.5,
          image:
            "https://images.unsplash.com/photo-1667608929017-e5aa9f642be8?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 2,
          name: "Tabbouleh",
          description: "Parsley, bulgur, tomato, lemon dressing.",
          price: 5.25,
          image:
            "https://images.unsplash.com/photo-1594040815645-5442fb6d48f6?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Soups: [
        {
          id: 3,
          name: "Lentil Soup",
          description: "Hearty lentil soup with spices.",
          price: 4.5,
          image:
            "https://images.unsplash.com/photo-1530734575165-ce39d996fbaa?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Drinks: [
        {
          id: 4,
          name: "Mint Tea",
          description: "Refreshing hot mint tea.",
          price: 2.5,
          image:
            "https://images.unsplash.com/photo-1656936632096-59fcacae533f?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },
  {
    name: "Urban Grill House",
    city: "Skopje",
    rating: 4.1,
    trending: true,
    categories: "BBQ, American, Sandwiches, Salad, Desert",
    hours: { open: 10, close: 23 },
    tags: ["Free delivery"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",

    address: "Ilinden Blvd 12",
    location: getRandomLatLng(),
    deliveryTime: 40,
    bannerImage:
      "https://images.unsplash.com/photo-1624384110540-8d686446d6e5?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1703848651274-331fa8fbe3f8?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "BBQ",
    menu: {
      BBQ: [
        {
          id: 1,
          name: "Pulled Pork Sandwich",
          description: "Slow-cooked pork in BBQ sauce.",
          price: 10.62,
          image:
            "https://images.unsplash.com/photo-1761712826051-b873907fb5d3?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 2,
          name: "Grilled Sausage Platter",
          description: "Assorted grilled sausages.",
          price: 11.19,
          image:
            "https://images.unsplash.com/photo-1693422661212-82a6ed1f0417?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Greek Salad",
          description: "Cucumbers, tomatoes, olives, feta cheese.",
          price: 4.34,
          image:
            "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Drinks: [
        {
          id: 4,
          name: "Craft Soda",
          description: "Locally made craft sodas in various flavors.",
          price: 3.5,
          image:
            "https://images.unsplash.com/photo-1594971475674-6a97f8fe8c2b?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Desserts: [
        {
          id: 5,
          name: "Brownie",
          description: "Chocolate fudge brownie with walnuts.",
          price: 4.75,
          image:
            "https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },
  {
    name: "Sunset Deli",
    city: "Skopje",
    rating: 4.4,
    trending: false,
    categories: "Vegetarian, Fusion, Salad, Desert",
    hours: { open: 7, close: 21 },
    tags: ["Vegetarian"],
    orderNum: 0,
    address: "Sunset Blvd 8",
    location: getRandomLatLng(),
    deliveryTime: 38,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",

    bannerImage:
      "https://images.unsplash.com/photo-1520066391310-428f06ebd602?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1629445675409-88dfe3acc603?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Fusion",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Berry Pancakes",
          description: "Fluffy pancakes with berries and syrup.",
          price: 6.89,
          image:
            "https://images.unsplash.com/photo-1522248105696-9625ba87de6e?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Soups: [
        {
          id: 2,
          name: "Tomato Basil Soup",
          description: "Creamy tomato soup with basil.",
          price: 4.85,
          image:
            "https://images.unsplash.com/photo-1692520033169-1951e923398f?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Quinoa Bowl",
          description: "Quinoa with grilled vegetables.",
          price: 5.61,
          image:
            "https://images.unsplash.com/photo-1679279726937-122c49626802?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Desserts: [
        {
          id: 4,
          name: "Chia Seed Pudding",
          description: "Chia pudding with coconut milk and berries.",
          price: 5.5,
          image:
            "https://images.unsplash.com/photo-1629445675409-88dfe3acc603?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },
  {
    name: "Urban Pizzeria",
    city: "Skopje",
    rating: 4.2,
    trending: true,
    categories: "Pizza, BBQ, Salad",
    hours: { open: 11, close: 23 },
    tags: ["Free delivery"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",
    address: "Makedonska Street 45",
    location: getRandomLatLng(),
    deliveryTime: 38,
    bannerImage:
      "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1581873372796-635b67ca2008?q=100&w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHBpenphfGVufDB8fDB8fHwy",
    cuisine: "Italian",
    menu: {
      Pizza: [
        {
          id: 1,
          name: "Margherita",
          description: "Classic pizza with tomato, mozzarella, and basil.",
          price: 7.95,
          image:
            "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 2,
          name: "Pepperoni",
          description: "Spicy pepperoni with mozzarella cheese.",
          price: 8.65,
          image:
            "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      BBQ: [
        {
          id: 3,
          name: "BBQ Chicken Wings",
          description: "Grilled chicken wings with BBQ sauce.",
          price: 6.5,
          image:
            "https://images.unsplash.com/photo-1650939986300-ce9609921fa7?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 4,
          name: "Caesar Salad",
          description: "Romaine lettuce, parmesan, croutons, Caesar dressing.",
          price: 5.25,
          image:
            "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Soups: [
        {
          id: 5,
          name: "Minestrone Soup",
          description: "Vegetable soup with beans and pasta.",
          price: 4.75,
          image:
            "https://images.unsplash.com/photo-1665593998976-d957f2827fe7?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },

  {
    name: "Cozy Corner Cafe",
    city: "Skopje",
    rating: 4.7,
    trending: false,
    categories: "Breakfast, Vegetarian, Salad, Desert",
    hours: { open: 6, close: 20 },
    tags: ["Vegetarian", "Free delivery"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",

    address: "Petrovec Street 12",
    location: getRandomLatLng(),
    deliveryTime: 36,
    bannerImage:
      "https://images.unsplash.com/photo-1662375716007-3d61760d6977?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1573500883698-e3ef47a95feb?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Cafe",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Avocado Toast",
          description: "Toasted bread topped with smashed avocado.",
          price: 6.42,
          image:
            "https://images.unsplash.com/photo-1515041761709-f9fc96e04cd3?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 2,
          name: "Berry Pancakes",
          description: "Fluffy pancakes with berries and syrup.",
          price: 6.89,
          image:
            "https://images.unsplash.com/photo-1673646961450-8432d46e3a40?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Greek Salad",
          description: "Cucumbers, tomatoes, olives, feta cheese.",
          price: 4.34,
          image:
            "https://images.unsplash.com/photo-1626200926749-cccc3d2caf12?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Desserts: [
        {
          id: 4,
          name: "Chia Seed Pudding",
          description: "Chia pudding with coconut milk and berries.",
          price: 5.5,
          image:
            "https://images.unsplash.com/photo-1612690871228-1d0748928eb3?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Drinks: [
        {
          id: 5,
          name: "Fresh Lemonade",
          description: "Freshly squeezed lemonade with mint.",
          price: 3.0,
          image:
            "https://images.unsplash.com/photo-1507281549113-040fcfef650e?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },

  {
    name: "Taverna Skopje",
    city: "Skopje",
    rating: 4.6,
    trending: false,
    categories: "Mediterranean, Greek, BBQ, Salad, Desert",
    hours: { open: 11, close: 23 },
    tags: ["Vegetarian", "Free delivery"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",

    address: "Macedonia Square 5",
    location: { lat: 41.9983, lng: 21.425 },
    deliveryTime: 35,
    bannerImage:
      "https://images.unsplash.com/photo-1659275798977-6eee03f687a2?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=100&w=2295&auto=format&fit=crop",
    cuisine: "Mediterranean",
    menu: {
      Breakfast: [
        {
          id: 1,
          name: "Greek Yogurt with Honey",
          price: 3.5,
          description: "Creamy yogurt topped with local honey and walnuts",
          tags: ["Vegetarian"],
          image:
            "https://images.unsplash.com/photo-1670843838196-0c1c15e85d5e?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 2,
          name: "Spinach and Feta Omelette",
          price: 6,
          description: "Fluffy omelette with fresh spinach and feta cheese",
          tags: ["Vegetarian"],
          image:
            "https://images.unsplash.com/photo-1630684789447-2484443c6c1b?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Greek Salad",
          price: 5,
          description: "Tomatoes, cucumbers, olives, onions, and feta cheese",
          tags: ["Vegetarian"],
          image:
            "https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 4,
          name: "Mediterranean Chickpea Salad",
          price: 6,
          description: "Chickpeas, parsley, lemon dressing, and fresh veggies",
          tags: ["Vegan"],
          image:
            "https://images.unsplash.com/photo-1688807450144-9d10de5eb913?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Soups: [
        {
          id: 5,
          name: "Lentil Soup",
          price: 4,
          description: "Traditional lentil soup with herbs and vegetables",
          tags: ["Vegan"],
          image:
            "https://images.unsplash.com/photo-1552298013-de2af4b94854?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      BBQ: [
        {
          id: 6,
          name: "Grilled Lamb Chops",
          price: 12,
          description: "Juicy lamb chops marinated with herbs and garlic",
          tags: [],
          image:
            "https://images.unsplash.com/photo-1761983723667-99c7fd98af53?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Desserts: [
        {
          id: 7,
          name: "Baklava",
          price: 4,
          description: "Sweet layered pastry with nuts and honey syrup",
          tags: ["Vegetarian"],
          image:
            "https://images.unsplash.com/photo-1617806501553-d3a6a3a7b227?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },
  {
    name: "Skopje Sushi House",
    city: "Skopje",
    rating: 4.7,
    trending: true,
    categories: "Japanese, Sushi, Salad, Asian",
    hours: { open: 12, close: 22 },
    tags: ["Free delivery"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",

    address: "Vodno Blvd 10",
    location: { lat: 41.985, lng: 21.43 },
    deliveryTime: 30,
    bannerImage:
      "https://images.unsplash.com/photo-1617196034738-26c5f7c977ce?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=100&w=2295&auto=format&fit=crop",
    cuisine: "Japanese",
    menu: {
      Sushi: [
        {
          id: 1,
          name: "California Roll",
          price: 8,
          description:
            "Crab meat, avocado, and cucumber rolled with rice and seaweed",
          image:
            "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 2,
          name: "Spicy Tuna Roll",
          price: 9,
          description: "Fresh tuna with spicy mayo and cucumber",
          image:
            "https://images.unsplash.com/photo-1558985212-92c2ff0b56e7?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Seaweed Salad",
          price: 5,
          description: "Fresh seaweed marinated with sesame and vinegar",
          image:
            "https://images.unsplash.com/photo-1629761444875-7f8293507e68?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Soups: [
        {
          id: 4,
          name: "Miso Soup",
          price: 3,
          description: "Traditional miso broth with tofu and seaweed",
          image:
            "https://images.unsplash.com/photo-1637024696628-02cb19cc1829?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Appetizers: [
        {
          id: 5,
          name: "Edamame",
          price: 4,
          description: "Steamed young soybeans with sea salt",
          image:
            "https://images.unsplash.com/photo-1605756002145-f49a67efaaea?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
    },
  },
  {
    name: "Pizzeria Bella",
    city: "Skopje",
    rating: 4.5,
    trending: true,
    categories: "Italian, Pizza, Pasta, Salad, BBQ, Desert",
    hours: { open: 16, close: 8 },
    tags: ["Free delivery", "Vegetarian"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",

    address: "Ilinden St. 22",
    location: { lat: 41.9932, lng: 21.4431 },
    deliveryTime: 40,
    bannerImage:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Italian",
    menu: {
      Pizzas: [
        {
          id: 1,
          name: "Margherita",
          image:
            "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          price: 7,
          description: "Tomato sauce, mozzarella, fresh basil",
        },
        {
          id: 2,
          name: "Pepperoni",
          image:
            "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          price: 9,
          description: "Tomato sauce, mozzarella, pepperoni",
        },
      ],
      Pasta: [
        {
          id: 3,
          name: "Spaghetti Carbonara",
          image:
            "https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          price: 10,
          description: "Spaghetti with pancetta, eggs, and cheese",
        },
      ],
      Salads: [
        {
          id: 4,
          name: "Caprese Salad",
          image:
            "https://images.unsplash.com/photo-1595587870672-c79b47875c6a?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          price: 6,
          description: "Tomato, mozzarella, and basil with balsamic glaze",
        },
      ],
      BBQ: [
        {
          id: 5,
          name: "BBQ Chicken Pizza",
          image:
            "https://images.unsplash.com/photo-1604917869287-3ae73c77e227?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          price: 11,
          description: "Pizza with BBQ sauce, grilled chicken, and onions",
        },
      ],
      Desserts: [
        {
          id: 6,
          name: "Tiramisu",
          image:
            "https://images.unsplash.com/photo-1707269388230-60ceceac3e6b?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          price: 5,
          description: "Classic coffee-flavored Italian dessert",
        },
      ],
    },
  },

  {
    name: "Grill Master",
    city: "Skopje",
    rating: 4.4,
    trending: false,
    categories: "BBQ, American, Salad, Desert",
    hours: { open: 12, close: 23 },
    tags: ["Free delivery"],
    orderNum: 0,
    partnerId: "JkZSfEHYOIVOj7Lx9k1EKbKOpTi1",

    address: "Partizanska St. 35",
    location: { lat: 41.991, lng: 21.4535 },
    deliveryTime: 45,
    bannerImage:
      "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    logo: "https://images.unsplash.com/photo-1544025162-d76694265947?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "American",
    menu: {
      BBQ: [
        {
          id: 1,
          name: "Smoked Ribs",
          price: 14,
          description: "Slow smoked pork ribs with BBQ sauce",
          image:
            "https://images.unsplash.com/photo-1593030668930-8130abedd2b0?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: 2,
          name: "BBQ Pulled Pork Sandwich",
          price: 9,
          description: "Pulled pork with coleslaw on a toasted bun",
          image:
            "https://images.unsplash.com/photo-1761712826051-b873907fb5d3?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Salads: [
        {
          id: 3,
          name: "Coleslaw",
          price: 4,
          description: "Creamy cabbage and carrot salad",
          image:
            "https://images.unsplash.com/photo-1573403707491-38a4ea19edc1?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Appetizers: [
        {
          id: 4,
          name: "Onion Rings",
          price: 5,
          description: "Crispy fried onion rings with dipping sauce",
          image:
            "https://images.unsplash.com/photo-1625938146369-adc83368bda7?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      Desserts: [
        {
          id: 5,
          name: "Apple Pie",
          price: 5,
          description: "Classic apple pie with vanilla ice cream",
          image:
            "https://images.unsplash.com/photo-1647540245408-171b9eba826e?q=100&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

      // THIS LINE IS ESSENTIAL
      const querySnapshot = await getDocs(q);

      // Helper: add slug to every menu item
      const addSlugsToMenu = (menu) => {
        const result = {};
        for (const [category, items] of Object.entries(menu)) {
          result[category] = items.map((item) => ({
            ...item,
            slug: slugify(item.name, { lower: true, strict: true }),
          }));
        }
        return result;
      };

      const menuWithSlugs = addSlugsToMenu(restaurant.menu);

      if (querySnapshot.empty) {
        const newDocRef = doc(restaurantsRef);
        await setDoc(newDocRef, {
          ...restaurant,
          restaurantId: newDocRef.id,
          slug: slugify(restaurant.name, { lower: true, strict: true }),
          menu: menuWithSlugs,
        });
        console.log(`Added new restaurant: ${restaurant.name}`);
      } else {
        querySnapshot.forEach(async (docSnap) => {
          await setDoc(docSnap.ref, {
            ...restaurant,
            restaurantId: docSnap.id,
            slug: slugify(restaurant.name, { lower: true, strict: true }),
            menu: menuWithSlugs,
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

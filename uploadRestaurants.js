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

const restaurants = [
  {
    name: "Venice Fontana",
    city: "Skopje",
    rating: 4.7,
    categories: "BBQ",
    orderNum: 0,
    address: "Boris Trajkovski 4a, Skopje 1000",
    tags: [],
    // distance: "1.2km",
    location: { lat: 41.9862367, lng: 21.4368167 },
    deliveryTime: "30-40",
    cuisine: "Macedonian",
    logo: "/1483_190424141022981_400x400.jpg",
    bannerImage:
      "https://images.unsplash.com/photo-1707592357743-5e25b277ca36?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80...",
    menu: [
      {
        id: 1,
        name: "Tavche Gravche",
        image:
          "https://cdn.pixabay.com/photo/2017/03/27/14/56/beans-2179665_960_720.jpg",
        ingredients: "Beans, paprika, oil, onion",
        price: 180,
      },
      {
        id: 2,
        name: "Shopska Salad",
        image:
          "https://cdn.pixabay.com/photo/2018/06/18/16/05/salad-3482749_960_720.jpg",
        ingredients: "Tomatoes, cucumbers, white cheese, olives",
        price: 120,
      },
    ],
  },
  {
    name: "Picerija Verona - Kisela Voda",
    city: "Skopje",
    rating: 4.9,
    categories: "Pizza",
    tags: ["Free delivery"],
    // distance: "500m",
    address: "XCGV+JX6, Skopje 1000",
    location: { lat: 41.9767849, lng: 21.4398999 },
    orderNum: 1,
    deliveryTime: "35-50",
    image:
      "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?q=80&w=2664&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Italian",
  },
  {
    name: "Gyro House Centar",
    city: "Skopje",
    rating: 4.2,
    categories: "Pizza",
    tags: [],
    orderNum: 2,
    // distance: "2.3km",
    address: "Blvd. Saint Clement of Ohrid BB, Skopje 1000",
    location: { lat: 41.9977984, lng: 21.4225342 },
    deliveryTime: "30-45",
    image:
      "https://cdn.pixabay.com/photo/2016/10/21/22/24/gyro-1759333_1280.jpg",
    cuisine: "Greek",
  },
  {
    name: "Twiggy Burger",
    city: "Skopje",
    rating: 4.4,
    categories: "Pizza",
    tags: [],
    orderNum: 0,
    // distance: "2.6km",
    address: "Blvd. Jane Sandanski no. 82 9A/10",
    location: { lat: 41.9850608, lng: 21.4612958 },
    deliveryTime: 30,
    image:
      "https://images.unsplash.com/photo-1534790566855-4cb788d389ec?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "American",
  },
  {
    name: "Baking Bread",
    city: "Skopje",
    rating: 4.7,
    categories: "Pizza",
    tags: [],
    orderNum: 0,
    // distance: "2.1km",
    address: "Blvd. Vidoe Smilevski Bato no. 3 Locale 7",
    location: { lat: 41.9825189, lng: 21.4698098 },
    deliveryTime: 30,
    image:
      "https://images.unsplash.com/photo-1547584370-2cc98b8b8dc8?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "American",
  },
  {
    name: "Burger Slut - Kisela Voda",
    city: "Skopje",
    rating: 4.7,
    categories: "Pizza",
    tags: [],
    // distance: "1.1km",
    address: "Blvd. Boris Trajkovski",
    location: { lat: 41.9862589, lng: 21.4345813 },
    orderNum: 0,
    deliveryTime: 30,
    image:
      "https://images.unsplash.com/photo-1605345981660-ab44e036a21d?q=80&w=2588&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "American",
  },
  {
    name: "Gostlinica Fontana",
    city: "Skopje",
    rating: 4.7,
    categories: "BBQ",
    tags: ["Free delivery"],
    orderNum: 0,
    // distance: "1.2km",
    address: "Blvd. Boris Trajkovski",
    location: { lat: 41.9863263, lng: 21.4345412 },
    deliveryTime: 30,
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Macedonian",
  },
  {
    name: "15 za 12",
    city: "Skopje",
    rating: 4.9,
    categories: "Pizza",
    tags: ["Vegetarian"],
    orderNum: 0,
    // distance: "400m",
    address: "Hristo Tatarchev 47f",
    location: { lat: 41.9768223, lng: 21.4437994 },
    deliveryTime: 45,
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Italian",
  },
  {
    name: "Munchies Burger",
    city: "Skopje",
    rating: 4.3,
    categories: "Pizza",
    tags: [],
    orderNum: 0,
    // distance: "3.4km",
    address: "Blvd. Jane Sandanski",
    location: { lat: 41.9878867, lng: 21.4509149 },
    deliveryTime: 40,
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "American",
  },
  {
    name: "Srekja Bar Food",
    city: "Skopje",
    rating: 4.6,
    categories: "Pizza",
    tags: ["Vegan"],
    orderNum: 0,
    // distance: "2.2km",
    address: "3rd Macedonian Brigade 60",
    location: { lat: 41.9811986, lng: 21.4529412 },
    deliveryTime: 30,
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Macedonian, American, Italian",
  },
  {
    name: "Enriko Pizza and Pasta",
    city: "Skopje",
    rating: 4.4,
    categories: "Pizza",
    tags: ["Vegetarian"],
    orderNum: 0,
    // distance: "3.5km",
    address: "293X+7R6, T.C. Leptokarija, Blvd. Partizanski Odredi",
    location: { lat: 41.9811986, lng: 21.4529412 },
    deliveryTime: "40-50",
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Italian",
  },
  {
    name: "Skopski Merak",
    city: "Skopje",
    rating: 4.8,
    categories: "Pizza",
    tags: [],
    orderNum: 0,
    // distance: "3.8km",
    address: "Debarca St 51, 1000",
    location: { lat: 42.0010096, lng: 21.4173384 },
    deliveryTime: "40-50",
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Macedonian",
  },
  {
    name: "Restoran Dion (Aerodrom)",
    city: "Skopje",
    rating: 4.7,
    categories: "Pizza",
    tags: [],
    orderNum: 0,
    // distance: "2.4km",
    address: "3rd Macedonian Brigade Blvd 39/1-1",
    location: { lat: 41.9816732, lng: 21.4535734 },
    deliveryTime: 30,
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Macedonian",
  },
  {
    name: "Engin Çigköfte (Raw Meatball)",
    city: "Skopje",
    rating: 4.6,
    categories: "Pizza",
    tags: ["Vegan"],
    orderNum: 0,
    // distance: "2.4km",
    address: "Old Bazaar - Skopje Old Town",
    location: { lat: 41.9997231, lng: 21.4332092 },
    deliveryTime: 40,
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Turkish",
  },
  {
    name: "Doner & Burger Plaset",
    city: "Skopje",
    rating: 4.5,
    categories: "Pizza",
    tags: [],
    orderNum: 0,
    // distance: "4.1km",
    address: "Cvetan Dimov 129",
    location: { lat: 42.0120612, lng: 21.4421401 },
    deliveryTime: "45-55",
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "American, Turkish",
  },
  {
    name: "Gostilnica Dukat",
    city: "Skopje",
    rating: 4.8,
    categories: "Pizza",
    tags: [],
    orderNum: 0,
    // distance: "3.6km",
    address: "MK, Boulevard Mitropolit Teodosij Gologanov 79",
    location: { lat: 41.9949773, lng: 21.4103559 },
    deliveryTime: "30-40",
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Macedonian",
  },
  {
    name: "Restaurant „Kantina“",
    city: "Skopje",
    rating: 4.9,
    categories: "Pizza",
    tags: ["Vegetarian"],
    orderNum: 0,
    // distance: "4.1km",
    address: "Radnjanska 6",
    location: { lat: 42.0007014, lng: 21.4165176 },
    deliveryTime: "30-40",
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Macedonian",
  },
  {
    name: "La Puerta GTC",
    city: "Skopje",
    rating: 4.8,
    categories: "Pizza",
    tags: ["Vegetarian", "Free delivery"],
    orderNum: 0,
    // distance: "2.2km",
    address: "11th October St.",
    location: { lat: 41.9945108, lng: 21.430851 },
    deliveryTime: "30-40",
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cuisine: "Mexican",
  },
  // {
  //   name: "Gostilnica Marokana",
  //   city: "Vinica",
  //   rating: 4.8,
  //   orderNum: 0,
  //   // distance: "2.2km",
  //   address: "Vinica",
  //   location: { lat: 41.8864628, lng: 22.5151185 },
  //   deliveryTime: "30-40",
  //   image:
  //     "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=2295&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   cuisine: "Italian",
  // },
];

async function uploadRestaurants() {
  for (const restaurant of restaurants) {
    try {
      // Query restaurants with same name and location
      const restaurantsRef = collection(db, "restaurants");
      const q = query(
        restaurantsRef,
        where("name", "==", restaurant.name),
        where("location.lat", "==", restaurant.location.lat),
        where("location.lng", "==", restaurant.location.lng)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // No restaurant found: add new
        const newDocRef = doc(restaurantsRef);
        await setDoc(newDocRef, restaurant);
        console.log(`Added new restaurant: ${restaurant.name}`);
      } else {
        // Restaurant exists: update all matched docs (should usually be just one)
        querySnapshot.forEach(async (docSnap) => {
          await setDoc(docSnap.ref, restaurant, { merge: true });
          console.log(`Updated restaurant: ${restaurant.name}`);
        });
      }
    } catch (error) {
      console.error("Error uploading restaurant:", error);
    }
  }
}

uploadRestaurants();

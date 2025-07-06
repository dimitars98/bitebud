// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdulm9r3uD8Bz-Fv6skUIKtN2Y1AN6jPc",
  authDomain: "food-delivery-app-a127f.firebaseapp.com",
  projectId: "food-delivery-app-a127f",
  storageBucket: "food-delivery-app-a127f.firebasestorage.app",
  messagingSenderId: "596551885614",
  appId: "1:596551885614:web:cf51c2b3e14e4f22f9d0bf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

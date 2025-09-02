import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdulm9r3uD8Bz-Fv6skUIKtN2Y1AN6jPc",
  authDomain: "food-delivery-app-a127f.firebaseapp.com",
  projectId: "food-delivery-app-a127f",
  storageBucket: "food-delivery-app-a127f.firebasestorage.app",
  messagingSenderId: "596551885614",
  appId: "1:596551885614:web:cf51c2b3e14e4f22f9d0bf",
};

const actionCodeSettings = {
  url: `${window.location.origin}/auth-complete`,
  handleCodeInApp: true,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, actionCodeSettings };

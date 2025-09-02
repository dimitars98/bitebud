import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    const addressRef = collection(db, "users", user.uid, "addresses");

    const unsubscribe = onSnapshot(
      addressRef,
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAddresses(fetched);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching addresses:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { addresses, loading };
}

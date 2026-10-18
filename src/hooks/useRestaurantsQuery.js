// src/hooks/useRestaurantsQuery.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect } from "react";
import { docsWithId } from "../utils/firestore";

// async function fetchRestaurants() {
//   const snapshot = await getDocs(collection(db, "restaurants"));
//   return snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(), // includes distance field set server-side
//   }));
// }

// export function useRestaurantsQuery() {
//   return useQuery({
//     queryKey: ["restaurants"],
//     queryFn: fetchRestaurants,
//     staleTime: 1000 * 60 * 5,
//   });
// }

export function useRestaurantsQuery() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const q = query(collection(db, "restaurants"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = docsWithId(snapshot);
      queryClient.setQueryData(["restaurants"], data);
    });

    return () => unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "restaurants"));
      return docsWithId(snapshot);
    },
    staleTime: Infinity,
  });
}

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useMemo } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { docsWithId } from "../utils/firestore";

export function useOrders(userId, type) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["orders", userId, type], [userId, type]);

  const queryResult = useQuery({
    queryKey,
    queryFn: () => new Promise(() => {}), // <- stays loading until snapshot updates data
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;

    const ordersRef = collection(db, "orders");

    const q =
      // type === "ongoing"
      //   ? query(
      //       ordersRef,
      //       where("userId", "==", userId),
      //       where("status", "<", 5)
      //     )
      //   : query(
      //       ordersRef,
      //       where("userId", "==", userId),
      //       where("status", "==", 5)
      //     );
      type === "ongoing"
        ? query(
            ordersRef,
            where("userId", "==", userId),
            where("status", "in", ["awaitingCourier", "delivering"])
          )
        : query(
            ordersRef,
            where("userId", "==", userId),
            where("status", "==", "completed")
          );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = docsWithId(snapshot);

      // Populate the cache
      queryClient.setQueryData(queryKey, orders);
    });

    return () => unsubscribe();
  }, [userId, type, queryClient, queryKey]);

  return queryResult;
}

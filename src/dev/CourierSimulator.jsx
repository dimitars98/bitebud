import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function CourierSimulator() {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const simulateCourier = async () => {
      const orderId = localStorage.getItem("ongoingOrderId");
      if (!orderId) {
        console.warn("No ongoing order found");
        return;
      }

      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        console.error("Order not found");
        return;
      }

      const order = orderSnap.data();
      const { restaurantLocation, deliveryLocation } = order;

      if (!restaurantLocation || !deliveryLocation) {
        console.error("Missing location data");
        return;
      }

      const steps = 20;
      const delay = 1000;

      const latStep = (deliveryLocation.lat - restaurantLocation.lat) / steps;
      const lngStep = (deliveryLocation.lng - restaurantLocation.lng) / steps;

      for (let i = 0; i <= steps; i++) {
        const newLat = restaurantLocation.lat + latStep * i;
        const newLng = restaurantLocation.lng + lngStep * i;

        await updateDoc(orderRef, {
          courierLocation: {
            lat: newLat,
            lng: newLng,
          },
        });

        console.log(`Step ${i + 1}: Updated courier location`);
        await new Promise((res) => setTimeout(res, delay));
      }

      console.log("Courier has arrived!");
    };

    if (isRunning) {
      simulateCourier();
    }
  }, [isRunning]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-xl">
      <h2 className="text-xl font-bold mb-2">Courier Simulator</h2>
      <button
        className="bg-yellow-400 px-4 py-2 rounded-xl text-black font-semibold"
        onClick={() => setIsRunning(true)}
      >
        Start Courier
      </button>
    </div>
  );
}

import { useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function CourierSimulator({ orderId }) {
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  const startSimulation = async () => {
    if (!orderId) {
      alert("No order ID provided!");
      return;
    }

    setIsRunning(true);
    setLoading(true);

    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
      console.error("Order not found");
      setIsRunning(false);
      setLoading(false);
      return;
    }

    const order = orderSnap.data();
    const { restaurantLocation, deliveryLocation } = order;

    if (!restaurantLocation || !deliveryLocation) {
      console.error("Missing location data");
      setIsRunning(false);
      setLoading(false);
      return;
    }

    const totalSteps = 5; // we will go from step 0 → 5
    const delay = 2000;

    // movement increments
    const latStep =
      (deliveryLocation.lat - restaurantLocation.lat) / totalSteps;
    const lngStep =
      (deliveryLocation.lng - restaurantLocation.lng) / totalSteps;

    // Run steps 0 → 5
    for (let step = 0; step <= totalSteps; step++) {
      const newLat = restaurantLocation.lat + latStep * step;
      const newLng = restaurantLocation.lng + lngStep * step;

      // status mapping
      let status;
      if (step === 0) status = "awaitingCourier";
      else if (step > 0 && step < 5) status = "delivering";
      else if (step === 5) status = "completed";

      await updateDoc(orderRef, {
        step: step, // STEP NUMBER (used by your step tracker)
        status: status, // BUSINESS STATUS
        courierLocation: { lat: newLat, lng: newLng },
      });

      await new Promise((res) => setTimeout(res, delay));
    }

    console.log("Courier simulation finished!");
    setIsRunning(false);
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-xl mb-6 text-center">
      <button
        className="bg-yellow-400 px-6 py-2 rounded-xl text-black font-semibold disabled:opacity-50"
        onClick={startSimulation}
        disabled={isRunning}
      >
        {loading ? "Simulating..." : "Start Courier"}
      </button>
    </div>
  );
}

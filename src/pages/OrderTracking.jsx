// src/pages/OrderTracking.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const steps = [
  "Order Placed",
  "Order Accepted",
  "Courier On The Way",
  "Courier Picked Up The Order",
  "Courier Is Headed Your Way", // longer text wraps
  "Order Delivered",
];

// const exampleOrder = {
//   items: [
//     { id: 1, name: "Pizza Margherita", price: 350, quantity: 2 },
//     { id: 2, name: "Coca Cola", price: 50, quantity: 3 },
//   ],
//   subtotal: 850,
//   deliveryFee: 100,
//   total: 950,
// };

export default function OrderTracking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { orderId } = useParams();

  // useEffect(() => {
  //   if (currentStep < steps.length - 1) {
  //     const timer = setTimeout(() => {
  //       setCurrentStep((prev) => prev + 1);
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [currentStep]);

  useEffect(() => {
    const orderRef = doc(db, "orders", orderId);

    const unsubscribe = onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOrder(data);
        if (typeof data.status === "number") {
          setCurrentStep(data.status);
        }
      } else {
        console.error("No such order!");
        setOrder(null);
      }
      setLoading(false); // <-- Add this here so loading ends when data is fetched
    });

    return () => unsubscribe(); // clean up listener on unmount
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center text-lg mt-10">Loading your order...</div>
    );
  }

  if (!order) {
    return (
      <div className="text-center text-lg mt-10 text-red-500">
        Order not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-10 text-center">Track Your Order</h1>
      {/* Increased height to accommodate centered circles and labels clearly */}
      <div className="relative mb-16 h-32">
        {/* The horizontal line behind steps */}
        <div
          className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -z-10"
          style={{ transform: "translateY(-50%)" }}
        ></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-yellow-400 -z-10 transition-all duration-500"
          style={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
            transform: "translateY(-50%)",
          }}
        ></div>

        <div className="flex justify-between h-full items-start">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <motion.div
                key={step}
                className="flex flex-col items-center text-center relative flex-1 h-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {/* Circle container: fixed size and centered vertically on the line */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shrink-0 absolute z-10 
                    ${
                      isCompleted
                        ? "bg-yellow-400 border-yellow-400 text-white"
                        : isActive
                        ? "bg-white border-yellow-400 text-yellow-400 font-semibold"
                        : "bg-white border-gray-300 text-gray-400"
                    }
                    `}
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }} // Center circle horizontally and vertically
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Label below, max width & multiline centered */}
                <span
                  className={`text-sm break-words whitespace-normal absolute text-center
                    ${
                      isCompleted
                        ? "text-yellow-600"
                        : isActive
                        ? "text-yellow-500 font-semibold"
                        : "text-gray-400"
                    }
                    `}
                  style={{
                    maxWidth: "90px", // limit width for multiline wrap
                    top: "calc(50% + 24px)", // Start 24px (half circle height) below the center line
                    left: "50%", // Center horizontally
                    transform: "translateX(-50%)", // Adjust for own width
                    marginTop: "0.5rem", // Add some space between circle and text
                  }}
                >
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
      ---
      {/* Order Details */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 border-b pb-3 border-gray-200 dark:border-gray-700">
          Order Details
        </h2>

        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between py-3 text-gray-900 dark:text-white"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.price} MKD × {item.quantity}
                </p>
              </div>
              <p className="font-semibold">{item.price * item.quantity} MKD</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 space-y-3 text-gray-800 dark:text-white text-right text-lg">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{order.subtotal} MKD</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>{order.deliveryFee} MKD</span>
          </div>
          <div className="flex justify-between font-bold text-xl border-t pt-3 border-gray-300 dark:border-gray-700">
            <span>Total</span>
            <span>{order.total} MKD</span>
          </div>
        </div>
      </section>
    </div>
  );
}

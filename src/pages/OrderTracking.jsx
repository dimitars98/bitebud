import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Map from "../components/Map";
import CourierSimulator from "../dev/CourierSimulator";

const steps = [
  "Order Placed",
  "Order Accepted",
  "Courier On The Way",
  "Courier Picked Up The Order",
  "Courier Is Headed Your Way",
  "Order Delivered",
];

export default function OrderTracking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();

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
      setLoading(false);
    });
    return () => unsubscribe();
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
    <div className="max-w-[1500px] mx-auto p-4 sm:p-6 flex items-center flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold mb-10 text-center">
          Track Your Order
        </h1>

        <CourierSimulator />

        {/* Horizontal Step Tracker (desktop) */}
        <div className="hidden sm:block relative mb-16 h-32">
          <div
            className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600 z-0"
            style={{ transform: "translateY(-50%)" }}
          ></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-yellow-400 dark:bg-yellow-500 z-0 transition-all duration-500"
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
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shrink-0 absolute z-10 
                      ${
                        isCompleted
                          ? "bg-yellow-400 border-yellow-400 text-white"
                          : isActive
                          ? "bg-white border-yellow-400 text-yellow-400 font-semibold"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
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

                  <span
                    className={`text-sm break-words whitespace-normal absolute text-center
                      ${
                        isCompleted
                          ? "text-yellow-600"
                          : isActive
                          ? "text-yellow-500 font-semibold"
                          : "text-gray-400"
                      }`}
                    style={{
                      maxWidth: "90px",
                      top: "calc(50% + 24px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      marginTop: "0.5rem",
                    }}
                  >
                    {step}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Vertical Step Tracker (mobile) */}
        <div className="block sm:hidden relative border-l-4 border-gray-200 dark:border-gray-700 pl-6 ml-6 mb-16">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <motion.div
                key={step}
                className="relative mb-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 absolute z-10 shadow-sm
                    ${
                      isCompleted
                        ? "bg-yellow-400 border-yellow-400 text-white"
                        : isActive
                        ? "bg-white border-yellow-400 text-yellow-400 font-semibold"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  style={{
                    left: "-2.9rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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

                <div className="ml-4">
                  <h3
                    className={`text-base font-medium ${
                      isCompleted
                        ? "text-yellow-600 dark:text-yellow-300"
                        : isActive
                        ? "text-yellow-500 dark:text-yellow-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Order Details */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 border-b pb-2 sm:pb-3 dark:text-white border-gray-200 dark:border-gray-700">
            Order Details
          </h2>

          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between py-3 text-gray-900 dark:text-white text-sm sm:text-base"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {item.price} MKD × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {item.price * item.quantity} MKD
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 sm:space-y-3 text-gray-800 dark:text-white text-right text-sm sm:text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{order.subtotal} MKD</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee} MKD</span>
            </div>
            <div className="flex justify-between font-bold text-base sm:text-xl border-t pt-3 border-gray-300 dark:border-gray-700">
              <span>Total</span>
              <span>{order.total} MKD</span>
            </div>
          </div>
        </section>
      </div>
      <div className="w-full lg:w-[400px]">
        <Map order={order} />
      </div>
    </div>
  );
}

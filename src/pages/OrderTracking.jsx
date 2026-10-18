import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import CourierSimulator from "../dev/CourierSimulator";
import { useCurrency } from "../contexts/CurrencyContext";
import DeliveryMap from "../components/order/DeliveryMap";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";


// helper: interpolate between two coordinates
function interpolatePosition(start, end, progress) {
  const lat = start[0] + (end[0] - start[0]) * progress;
  const lng = start[1] + (end[1] - start[1]) * progress;
  return [lat, lng];
}

export default function OrderTracking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // restaurant + customer coordinates
  const restaurantLocation = [41.9987, 21.427]; // example
  const [customerLocation] = useState([41.9985, 21.4361]); // example
  const [courierLocation, setCourierLocation] = useState([41.9981, 21.4254]); // start

  const { orderId } = useParams();
  const { formatCurrency } = useCurrency();
  const { width, height } = useWindowSize();
  const { t } = useTranslation();
  // Step labels: orders.steps in the locale files (shared with the profile page).
  const steps = t("orders.steps", { returnObjects: true });

  useEffect(() => {
    const statusToStepIndex = {
      awaitingCourier: 0,
      delivering: 3,
      completed: 5,
    };

    const orderRef = doc(db, "orders", orderId);
    const unsubscribe = onSnapshot(orderRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOrder(data);
        // if (typeof data.status === "number") {
        //   setCurrentStep(data.status);
        // }
        // convert status string to step index
        if (typeof data.step === "number") {
          setCurrentStep(data.step);
        } else {
          // fallback for old orders
          if (typeof data.status === "string") {
            setCurrentStep(statusToStepIndex[data.status] ?? 0);
          }
        }
      } else {
        setOrder(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [orderId]);

  // animate courier movement based on step
  useEffect(() => {
    let interval;
    if (currentStep === 2 || currentStep === 3) {
      // move toward restaurant
      interval = setInterval(() => {
        setCourierLocation((prev) =>
          interpolatePosition(prev, restaurantLocation, 0.05)
        );
      }, 1000);
    } else if (currentStep === 4 || currentStep === 5) {
      // move toward customer
      interval = setInterval(() => {
        setCourierLocation((prev) =>
          interpolatePosition(prev, customerLocation, 0.05)
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, customerLocation, restaurantLocation]);

  // toast notifications on step change
  useEffect(() => {
    if (order) {
      toast.success(t("tracking.statusUpdated", { step: steps[currentStep] }));
    }
    // fire on status changes only, not on a language switch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, order]);

  if (loading)
    return <div className="text-center mt-10">{t("tracking.loading")}</div>;
  if (!order)
    return (
      <div className="text-center mt-10 text-red-500">
        {t("tracking.notFound")}
      </div>
    );

  return (
    <div className="max-w-[1500px] mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <h1 className="text-2xl dark:text-(--text-primary) text-(--text-primary) sm:text-3xl font-bold mb-10 text-center">
          {t("tracking.title")}
        </h1>

        <CourierSimulator orderId={orderId} />

        {/* Horizontal Step Tracker (desktop) */}
        <div className="hidden sm:block relative mb-16 h-32">
          <div
            className="absolute inset-x-0 top-1/2 z-0"
            style={{
              transform: "translateY(-50%)",
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            <div className="relative h-1 bg-gray-300 dark:bg-gray-600 rounded-full">
              <div
                className="absolute top-0 left-0 h-1 bg-(--brand) dark:bg-(--brand-primary) rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(100, (currentStep / (steps.length - 1)) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>

          <div
            className="absolute top-1/2 left-0 w-full flex justify-between items-start z-10"
            style={{
              transform: "translateY(-20%)",
              paddingLeft: 24,
              paddingRight: 24,
            }}
          >
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              const isLastAndCompleted =
                index === steps.length - 1 && currentStep === steps.length - 1;

              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                >
                  {/* Circle */}
                  <motion.div
                    className={`
              w-12 h-12 rounded-full flex items-center justify-center border-4 shrink-0
              ${
                isCompleted || isLastAndCompleted
                  ? "bg-(--brand) border-(--brand) text-white"
                  : isActive
                  ? "bg-white border-(--brand) text-(--brand) font-semibold"
                  : "bg-(--bg-main) border-gray-300 text-(--text-muted)"
              }
            `}
                    style={{ position: "relative", top: 0 }}
                    animate={
                      isActive
                        ? {
                            scale: [1, 1.2, 1],
                            boxShadow: "0 0 10px rgba(255,200,0,0.6)",
                          }
                        : {}
                    }
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {isCompleted || isLastAndCompleted ? (
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
                  </motion.div>

                  {/* Label */}
                  <span
                    className={`
              text-sm break-words whitespace-normal mt-3
              ${
                isCompleted || isLastAndCompleted
                  ? "text-(--brand-hover)"
                  : isActive
                  ? "text-(--brand-primary) font-semibold"
                  : "text-gray-400"
              }
            `}
                    style={{ maxWidth: "90px" }}
                  >
                    {step}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Vertical Step Tracker (mobile) */}
        <div className="block sm:hidden relative border-l-4 border-(--border-primary) dark:border-(--border-primary) pl-6 ml-6 mb-16">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <motion.div
                key={index}
                className="relative mb-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 absolute z-10 shadow-sm
            ${
              isCompleted
                ? "bg-(--brand) border-(--brand) text-white"
                : isActive
                ? "bg-(--bg-main) border-(--brand) text-(--brand) font-semibold"
                : "bg-white border-gray-300 text-(--text-muted)"
            }`}
                  style={{
                    left: "-2.9rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
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
                </motion.div>

                <div className="ml-4">
                  <h3
                    className={`text-base font-medium ${
                      isCompleted
                        ? "text-(--brand-hover) dark:text-yellow-300"
                        : isActive
                        ? "text-(--brand-primary) dark:text-(--brand)"
                        : "text-gray-500 dark:text-(--text-muted)"
                    }`}
                  >
                    {step}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Courier card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md mb-6 overflow-hidden">
          {/* Header */}
          <div className="bg-(--brand) dark:bg-(--brand-primary) px-4 py-2 flex justify-between items-center">
            <h2 className="font-bold text-lg text-white">
              {t("tracking.yourCourier")}
            </h2>
            <span className="text-sm font-medium text-white">
              {t("tracking.onTheWay")}
            </span>
          </div>

          {/* Body */}
          <div className="flex items-center gap-4 p-4">
            <img
              src="/courier-avatar.png"
              alt={t("tracking.courierAlt")}
              className="w-16 h-16 rounded-full border-2 border-(--brand) shadow-sm"
            />
            <div className="flex-1">
              <p className="font-semibold text-(--text-primary) dark:text-(--text-primary)">
                Alex
              </p>
              <div className="flex items-center text-(--brand-primary) text-sm">
                {/* rating stars */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span className="ml-1">4.9</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-(--text-muted)">
                {t("tracking.bicycle")}
              </p>
              <p className="text-xs text-(--text-muted) dark:text-gray-500">
                {t("tracking.eta", { min: 15 })}
              </p>
            </div>
            <button className="flex items-center gap-2 bg-(--brand) hover:bg-(--brand-primary) text-white px-4 py-2 rounded-lg text-sm font-medium shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.2.48 2.53.74 3.9.74a1 1 0 011 1v3.5a1 1 0 01-1 1C10.61 22 2 13.39 2 3.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.37.26 2.7.74 3.9a1 1 0 01-.21 1.11l-2.41 2.28z" />
              </svg>
              {t("tracking.call")}
            </button>
          </div>
        </div>

        {/* Map */}
        <DeliveryMap
          courierLocation={courierLocation}
          customerLocation={customerLocation}
        />

        {/* Confetti when delivered */}
        {/* {currentStep === steps.length - 1 && (
          <Confetti width={width} height={height} />
        )} */}

        {/* Order Details (your existing code) */}
        <section className="bg-(--bg-main) dark:bg-(--brand-bg-primary) rounded-2xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 border-b pb-2 sm:pb-3 dark:text-white border-(--border-primary) dark:border-(--border-primary)">
            {t("tracking.details")}
          </h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between py-3 text-(--text-primary) dark:text-white text-sm sm:text-base"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-(--text-muted)">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 sm:space-y-3 text-(--text-secondary) dark:text-white text-right text-sm sm:text-lg">
            <div className="flex justify-between">
              <span>{t("checkout.subtotal")}</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("cart.deliveryFee")}</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-base sm:text-xl border-t pt-3 border-(--border-primary) dark:border-(--border-primary)">
              <span>{t("orders.total")}</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

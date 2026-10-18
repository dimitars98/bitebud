import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import LoadingSpinner from "../ui/LoadingSpinner";
import AddressForm from "../components/profile/AddressForm";
import ScrollToTop from "../components/layout/ScrollToTop";
import Modal from "../ui/Modal";

import { useAuth } from "../hooks/useAuth";
import {
  ClipboardList,
  Truck,
  Home,
  LogOut,
  CreditCard,
  User,
} from "lucide-react";
import { useOrders } from "../hooks/useOrders";
import { useCurrency } from "../contexts/CurrencyContext";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../helpers/dates";

// Step labels: orders.steps in the locale files (same order).
const STEP_COUNT = 6;

const statusToStepIndex = {
  awaitingCourier: 0, // "Order Placed"
  delivering: 3, // "Courier Picked Up The Order" (example)
  completed: 5, // "Order Delivered"
};

export default function Profile() {
  // Other pages can open a specific tab, e.g. checkout links here with
  // state: { section: "addresses" }.
  const location = useLocation();
  const [selectedSection, setSelectedSection] = useState(
    location.state?.section ?? "ongoing",
  );

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const { formatCurrency } = useCurrency();
  const { t, i18n } = useTranslation();
  const steps = t("orders.steps", { returnObjects: true });

  const { data: ongoingOrders, isLoading: loadingOngoing } = useOrders(
    user?.uid,
    "ongoing"
  );

  const { data: deliveredOrders, isLoading: loadingDelivered } = useOrders(
    user?.uid,
    "delivered"
  );

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);

  const renderOrderCard = (order) => {
    // const progress = ((order.status + 1) / steps.length) * 100;
    const stepIndex = statusToStepIndex[order.status] ?? 0;
    const progress = ((stepIndex + 1) / STEP_COUNT) * 100;

    return (
      <motion.li
        key={order.id}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="p-6 bg-gradient-to-br from-white/70 via-white/40 to-gray-100/30 
          dark:from-gray-900/70 dark:via-gray-900/40 dark:to-gray-800/30 
          backdrop-blur-xl rounded-3xl hover:shadow-lg 
          hover:scale-[1.02] transition-all border border-gray-200/40 
          dark:border-gray-700/40 cursor-pointer"
        onClick={() => navigate(`/order-tracking/${order.id}`)}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-(--text-primary) dark:text-(--text-primary)">
            {t("orders.number", { number: order.orderNumber })}
          </h3>
          <span>{order.restaurantName}</span>
          <span
            className={`flex items-center gap-2 px-4 py-1.5 text-sm sm:text-base 
              font-semibold rounded-full transition-all
              ${
                order.status === "completed"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              }`}
          >
            {/* {steps[order.status] || "Unknown"} */}
            {steps[stepIndex]}
          </span>
        </div>
        <span className="mb-10">
          {t("orders.createdOn", {
            date: formatDateTime(
              order.createdAt,
              i18n.resolvedLanguage,
              t("orders.na"),
            ),
          })}
        </span>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div
            className="h-2 rounded-full bg-(--brand-primary) dark:bg-yellow-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Total */}
        <div
          className="mb-6 flex justify-between items-center 
          bg-white/40 dark:bg-gray-800/40 
          px-5 py-3 rounded-2xl shadow-inner 
          text-lg font-semibold text-gray-900 dark:text-white"
        >
          <span className="tracking-wide">{t("orders.total")}</span>
          <span className="text-yellow-600 dark:text-yellow-300 font-bold">
            {formatCurrency(order.total)}
          </span>
        </div>

        {/* Items */}
        <div className="space-y-3">
          <span className="text-gray-600 dark:text-(--text-muted) font-medium uppercase tracking-wider text-sm">
            {t("orders.items")}
          </span>
          <div className="flex flex-wrap gap-3">
            {order.items.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-between 
                  bg-gradient-to-r from-gray-100/60 to-gray-200/40 
                  dark:from-gray-700/60 dark:to-gray-800/40 
                  px-4 py-2 rounded-full shadow-sm 
                  text-sm sm:text-base font-medium 
                  text-(--text-primary) dark:text-gray-100"
              >
                <span>{item.name}</span>
                <span className="ml-2 text-gray-500 dark:text-gray-300">
                  ×{item.quantity}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.li>
    );
  };
  return (
    <>
      <ScrollToTop />

      <div className="flex flex-col md:flex-row max-w-[1500px] mx-auto h-screen bg-gray-50 dark:bg-(--brand-bg-primary)">
        {/* Sidebar */}
        <aside
          className="
    hidden md:block w-64
    bg-(--bg-main) dark:bg-(--brand-bg-secondary)
    shadow-md p-6
    sticky top-0
h-screen    overflow-y-auto
  "
        >
          <h2 className="text-xl font-bold mb-6 text-(--text-secondary) dark:text-white">
            {t("profile.title")}
          </h2>
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setSelectedSection("personal")}
              className={`flex items-center gap-2 text-left rounded-lg px-4 py-3 transition-all relative
    ${
      selectedSection === "personal"
        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
        : "text-gray-700 dark:text-gray-300 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-gray-700"
    }`}
            >
              {selectedSection === "personal" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-yellow-500 rounded-full"></span>
              )}
              <User className="w-5 h-5" />
              {t("profile.personal")}
            </button>

            <button
              onClick={() => setSelectedSection("ongoing")}
              className={`flex items-center gap-2 text-left rounded-lg px-4 py-3 transition-all relative
                ${
                  selectedSection === "ongoing"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    : "text-gray-700 dark:text-gray-300 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-gray-700"
                }`}
            >
              {/* Accent line */}
              {selectedSection === "ongoing" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-yellow-500 rounded-full"></span>
              )}
              <ClipboardList className="w-5 h-5" />
              {t("profile.ongoing")}
            </button>
            <button
              onClick={() => setSelectedSection("delivered")}
              className={`flex items-center gap-2 text-left rounded-lg px-4 py-3 transition-all relative
                ${
                  selectedSection === "delivered"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    : "text-gray-700 dark:text-gray-300 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-gray-700"
                }`}
            >
              {/* Accent line */}
              {selectedSection === "delivered" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-yellow-500 rounded-full"></span>
              )}
              <Truck className="w-5 h-5" />
              {t("profile.delivered")}
            </button>
            <button
              onClick={() => setSelectedSection("payment")}
              className={`flex items-center gap-2 text-left rounded-lg px-4 py-3 transition-all relative
    ${
      selectedSection === "payment"
        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
        : "text-gray-700 dark:text-gray-300 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-gray-700"
    }`}
            >
              {selectedSection === "payment" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-yellow-500 rounded-full"></span>
              )}
              <CreditCard /> {t("profile.payment")}
            </button>

            <button
              onClick={() => setSelectedSection("addresses")}
              className={`flex items-center gap-2 text-left rounded-lg px-4 py-3 transition-all relative
                ${
                  selectedSection === "addresses"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    : "text-gray-700 dark:text-gray-300 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-gray-700"
                }`}
            >
              {/* Accent line */}
              {selectedSection === "addresses" && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-yellow-500 rounded-full"></span>
              )}
              <Home className="w-5 h-5" />
              {t("profile.addresses")}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg px-4 py-3 relative"
            >
              <LogOut className="w-5 h-5" />
              {t("profile.logOut")}
            </button>
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="block md:hidden p-4">
          <select
            value={selectedSection || ""}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full p-3 rounded-lg bg-(--bg-main) dark:bg-gray-800 text-(--text-secondary) dark:text-white border border-(--border-primary) dark:border-(--border-primary) outline-none"
          >
            <option value="personal">{t("profile.personal")}</option>
            <option value="ongoing">{t("profile.ongoing")}</option>
            <option value="delivered">{t("profile.delivered")}</option>
            <option value="payment">{t("profile.payment")}</option>
            <option value="addresses">{t("profile.addresses")}</option>
          </select>
        </div>

        {/* Main content */}
        {/* <main className="flex-1 p-4 sm:p-6 md:p-10 text-(--text-secondary) dark:text-white"> */}
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl md:text-2xl font-bold mb-6">
            {!user ? null : ( // or <Spinner /> or a skeleton
              <p className="text-xl font-semibold">
                {t("profile.welcome", {
                  name: user?.displayName?.split(" ").at(0) ?? "",
                })}
              </p>
            )}
          </h1>

          {/* Ongoing orders */}
          {selectedSection === "ongoing" && (
            <section className="space-y-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-(--text-secondary) dark:text-white">
                {t("profile.ongoing")}
              </h2>
              {loadingOngoing ? (
                <LoadingSpinner />
              ) : !ongoingOrders ? null : ongoingOrders.length === 0 ? ( // Still loading SSR, guard state
                <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10">
                  <div className="text-center">
                    <ClipboardList className="w-10 h-10 mx-auto text-(--text-muted) dark:text-gray-500" />
                    <p className="mt-3 text-gray-600 dark:text-(--text-muted)">
                      {t("profile.noOngoing")}
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.ul
                    key="ongoing-orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {ongoingOrders.map((order) => renderOrderCard(order))}
                  </motion.ul>
                </AnimatePresence>
              )}
            </section>
          )}

          {/* Delivered orders */}
          {selectedSection === "delivered" && (
            <section className="space-y-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-(--text-secondary) dark:text-white">
                {t("profile.delivered")}
              </h2>
              {loadingDelivered ? (
                <LoadingSpinner />
              ) : !deliveredOrders ? null : deliveredOrders.length === 0 ? ( // Still initializing, don't flash "no orders"
                <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10">
                  <div className="text-center">
                    <Truck className="w-10 h-10 mx-auto text-(--text-muted) dark:text-gray-500" />
                    <p className="mt-3 text-gray-600 dark:text-(--text-muted)">
                      {t("profile.noDelivered")}
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.ul
                    key="delivered-orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {deliveredOrders.map((order) => renderOrderCard(order))}
                  </motion.ul>
                </AnimatePresence>
              )}
            </section>
          )}

          {selectedSection === "payment" && (
            <section className="space-y-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-(--text-secondary) dark:text-white">
                {t("profile.payment")}
              </h2>

              <div className="p-6 bg-white/70 dark:bg-gray-800/60 backdrop-blur rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t("profile.paymentIntro")}
                </p>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-center">
                  <div className="text-5xl mb-3">💳</div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {t("profile.noPayment")}
                  </p>
                  <button className="px-6 py-3 bg-(--brand-primary) hover:bg-(--brand-hover) text-white rounded-xl transition-all font-semibold">
                    {t("profile.addPayment")}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Addresses */}
          {selectedSection === "addresses" && (
            <section className="space-y-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-(--text-secondary) dark:text-white">
                {t("profile.addresses")}
              </h2>
              <div className="p-6 bg-white/70 dark:bg-gray-800/60 backdrop-blur rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t("profile.addressesIntro")}
                </p>
                <AddressForm />
              </div>
            </section>
          )}
          {selectedSection === "personal" && (
            <section className="space-y-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-(--text-secondary) dark:text-white">
                {t("profile.personalTitle")}
              </h2>

              <div className="p-6 bg-white/70 dark:bg-gray-800/60 backdrop-blur rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm space-y-6">
                <p className="text-gray-600 dark:text-gray-300">
                  {t("profile.personalIntro")}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("profile.fullName")}
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.displayName || ""}
                      className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("profile.email")}
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("profile.phone")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("profile.phonePh")}
                      className="w-full p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <button className="px-6 py-3 mt-4 bg-(--brand-primary) hover:bg-(--brand-hover) text-white rounded-xl transition-all font-semibold">
                  {t("profile.save")}
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}

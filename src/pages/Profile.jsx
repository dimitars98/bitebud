import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import LoadingSpinner from "../ui/LoadingSpinner";
import AddressForm from "../forms/AddressForm";
import ScrollToTop from "../components/ScrollToTop";
import Modal from "../modals/Modal";

import { useAuth } from "../hooks/useAuth";

const steps = [
  "Order Placed",
  "Order Accepted",
  "Courier On The Way",
  "Courier Picked Up The Order",
  "Courier Is Headed Your Way",
  "Order Delivered",
];

export default function Profile() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    if (selectedSection !== "ongoing" || !user) return;

    setLoadingOrders(true);

    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", user.uid),
      where("status", "<", 5) // status less than 5 means ongoing
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOngoingOrders(orders);
      setLoadingOrders(false);
    });

    return () => unsubscribe();
  }, [selectedSection, user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col md:flex-row max-w-[1500px] mx-auto min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar (hidden on mobile) */}
        <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 shadow-md p-6 space-y-2">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            My Profile
          </h2>
          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => setSelectedSection("ongoing")}
              className="text-left text-gray-700 dark:text-gray-300 hover:text-yellow-500 rounded-lg px-4 py-3 hover:bg-yellow-50 dark:hover:bg-gray-700"
            >
              Ongoing Orders
            </button>
            <button
              onClick={() => setSelectedSection("delivered")}
              className="text-left text-gray-700 dark:text-gray-300 hover:text-yellow-500 rounded-lg px-4 py-3 hover:bg-yellow-50 dark:hover:bg-gray-700"
            >
              Delivered Orders
            </button>
            <button
              onClick={() => setSelectedSection("addresses")}
              className="text-left text-gray-700 dark:text-gray-300 hover:text-yellow-500 rounded-lg px-4 py-3 hover:bg-yellow-50 dark:hover:bg-gray-700"
            >
              My Addresses
            </button>
            <button
              onClick={handleLogout}
              className="text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg px-4 py-3"
            >
              Log Out
            </button>
          </nav>
        </aside>

        {/* Mobile Nav Dropdown */}
        <div className="block md:hidden p-4">
          <select
            value={selectedSection || ""}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          >
            <option value="" disabled>
              Select a section
            </option>
            <option value="ongoing">Ongoing Orders</option>
            <option value="delivered">Delivered Orders</option>
            <option value="addresses">My Addresses</option>
          </select>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 text-gray-800 dark:text-white">
          <h1 className="text-xl md:text-2xl font-bold mb-4">
            Welcome to your profile
          </h1>

          {selectedSection === "ongoing" && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Ongoing Orders
              </h2>

              {loadingOrders ? (
                <LoadingSpinner />
              ) : ongoingOrders.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No ongoing orders found.
                </p>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.ul
                    key="ongoing-orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {ongoingOrders.map((order) => (
                      <motion.li
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.25 }}
                        className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Order #{order.orderNumber}
                          </h3>
                          <span className="px-3 py-1 text-sm rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                            {steps[order.status] || "Unknown"}
                          </span>
                        </div>

                        <div className="text-gray-700 dark:text-gray-300 space-y-2">
                          <p>
                            <strong>Total:</strong>{" "}
                            <span className="font-medium">
                              {order.total} MKD
                            </span>
                          </p>

                          <div>
                            <strong>Items:</strong>
                            <ul className="list-disc list-inside ml-4 mt-1 text-sm space-y-0.5">
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.name}{" "}
                                  <span className="text-gray-500 dark:text-gray-400">
                                    (x{item.quantity})
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              )}
            </section>
          )}
          {selectedSection === "addresses" && <AddressForm />}
        </main>
      </div>
    </>
  );
}

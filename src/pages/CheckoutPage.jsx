// src/pages/Checkout.jsx
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const db = getFirestore();

  const deliveryFee = 100; // Flat rate for now
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // User is logged out, redirect to home page
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handlePlaceOrder = async () => {
    if (!user) return;

    try {
      const docRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cartItems.map(({ id, name, price, quantity }) => ({
          id,
          name,
          price,
          quantity,
        })),
        subtotal,
        deliveryFee,
        total,
        status: 0,
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("ongoingOrderId", docRef.id);
      clearCart();
      navigate("/order-confirmation", { state: { orderId: docRef.id } });
    } catch (error) {
      console.error("Failed to place order:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 lg:p-8 text-gray-800 dark:text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-tight">
        Your Order Checkout
      </h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <p className="text-xl text-gray-500 dark:text-gray-300 mb-4">
            Your cart is looking a little empty...
          </p>
          <p className="text-md text-gray-400 dark:text-gray-500">
            Start adding some delicious items!
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cart Items */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-5 border-b pb-3 border-gray-200 dark:border-gray-700">
              Items in Your Cart
            </h2>
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-4 transition-all duration-200 hover:shadow-md"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.price} MKD x {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {item.price * item.quantity} MKD
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Order Summary */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-5 border-b pb-3 border-gray-200 dark:border-gray-700">
              Order Summary
            </h2>
            <div className="space-y-4 text-md">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Subtotal
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {subtotal} MKD
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  Delivery Fee
                </span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {deliveryFee} MKD
                </span>
              </div>
              <div className="flex justify-between items-center font-bold text-xl pt-4 border-t border-gray-200 dark:border-gray-700">
                <span>Total Due</span>
                <span>{total} MKD</span>
              </div>
            </div>
          </section>

          {/* Action Button */}
          <button
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-white font-bold py-4 rounded-2xl transition-all duration-300 ease-in-out transform  hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 cursor-pointer"
            onClick={handlePlaceOrder}
          >
            Place Order Now
          </button>
        </div>
      )}
    </div>
  );
}

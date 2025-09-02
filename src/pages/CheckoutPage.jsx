import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  runTransaction,
  query,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { geocodeAddress } from "../utils/geocode";
import { collection as firestoreCollection } from "firebase/firestore";

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [restaurantLocation, setRestaurantLocation] = useState(null);

  const location = useLocation();
  const restaurantId = location.state?.restaurantId;

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
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    async function fetchAddresses() {
      if (!user) return;

      setLoadingAddresses(true);

      const addressesRef = collection(db, "users", user.uid, "addresses");
      const q = query(addressesRef);
      const snapshot = await getDocs(q);

      const fetchedAddresses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAddresses(fetchedAddresses);

      const defaultAddress = fetchedAddresses.find((addr) => addr.default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (fetchedAddresses.length > 0) {
        setSelectedAddressId(fetchedAddresses[0].id);
      }

      setLoadingAddresses(false);
    }

    fetchAddresses();
  }, [user, db]);

  useEffect(() => {
    if (!user || !restaurantId) return;

    async function fetchRestaurantLocation() {
      const restaurantDoc = await getDoc(doc(db, "restaurants", restaurantId));
      if (restaurantDoc.exists()) {
        setRestaurantLocation(restaurantDoc.data().location);
      } else {
        console.error("Restaurant not found");
      }
    }

    fetchRestaurantLocation();
  }, [user, restaurantId, db]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handlePlaceOrder = async () => {
    if (!user) return;

    try {
      const addressSnapshot = await getDocs(
        firestoreCollection(db, "users", user.uid, "addresses")
      );
      const addresses = addressSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId
      );
      if (!selectedAddress) {
        alert("Please select a delivery address.");
        return;
      }

      const fullAddress = `${selectedAddress.street}, Skopje`;
      const location = await geocodeAddress(fullAddress, apiKey);

      if (!location) {
        alert("Failed to determine location from address.");
        return;
      }

      const orderNumber = await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, "meta", "counters");
        const counterDoc = await transaction.get(counterRef);

        if (!counterDoc.exists()) {
          throw "Counter document does not exist!";
        }

        const newOrderNumber = counterDoc.data().lastOrderNumber + 1;
        transaction.update(counterRef, { lastOrderNumber: newOrderNumber });
        return newOrderNumber;
      });

      const docRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        orderNumber,
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
        deliveryAddress: selectedAddress,
        deliveryLocation: location,
        restaurantLocation: restaurantLocation || {
          lat: 41.9981,
          lng: 21.4254,
        }, // fallback coords
        courierLocation: null,
      });

      // localStorage.setItem("ongoingOrderId", docRef.id);
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

          {loadingAddresses ? (
            <p>Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <p>
              You have no saved delivery addresses. Please add one in your
              profile.
            </p>
          ) : (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                Select Delivery Address
              </h2>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block p-3 border rounded-lg cursor-pointer transition 
            ${
              selectedAddressId === address.id
                ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900"
                : "border-gray-300 dark:border-gray-700"
            }
          `}
                  >
                    <input
                      type="radio"
                      name="deliveryAddress"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mr-3"
                    />
                    <span>
                      {address.street},
                      {address.entranceInfo && `${address.entranceInfo}, `}
                      {address.floor && `Floor: ${address.floor}, `}
                      Phone: {address.phone} {address.default && "(Default)"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

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

import { useSelector } from "react-redux";
import { useCart } from "../contexts/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useRestaurantsQuery } from "../hooks/useRestaurantsQuery";
import { isRestaurantOpen } from "../helpers/isRestaurantOpen";

export default function CartDrawer({ isOpen, onClose, onTriggerLogin }) {
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);

  const { cartItems, removeFromCart, restaurantId } = useCart();

  const { data: restaurants = [] } = useRestaurantsQuery();
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  console.log({ restaurantId, restaurant, restaurants });

  const isRestaurantClosed = restaurant && !isRestaurantOpen(restaurant.hours);

  const cartHasItems = cartItems.length > 0;
  const shouldDisableOrderButton = cartHasItems && isRestaurantClosed;
  const orderButtonText = shouldDisableOrderButton ? "Closed" : "Order Now";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        ref={drawerRef}
        className={`flex justify-between flex-col fixed right-0 top-0 h-full w-screen md:w-100 bg-white dark:bg-gray-800 dark:text-white shadow-lg transition-transform duration-300 z-50 md:rounded-tl-2xl md:rounded-bl-xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-50 cursor-pointer transition-all duration-300 flex items-center justify-center"
            >
              <span className="material-symbols-rounded text-2xl leading-none">
                close
              </span>
            </button>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="mb-3 flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.price} MKD x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        {isRestaurantClosed && (
          <div className="text-sm text-red-500 text-center mb-4">
            🚫 This restaurant is currently closed.
            <br />
            {restaurant?.hours?.open != null && (
              <span className="text-gray-500">
                It will open at <strong>{restaurant.hours.open}:00</strong>.
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => {
            if (!user) {
              onTriggerLogin();
            } else if (shouldDisableOrderButton) {
              alert("This restaurant is currently closed.");
            } else {
              onClose();
              navigate("/checkout", { state: { restaurantId } });
            }
          }}
          disabled={shouldDisableOrderButton}
          className={`w-full mt-6 font-semibold py-3 rounded-xl transition-all ${
            !shouldDisableOrderButton
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-yellow-400 text-black hover:bg-yellow-300"
          }`}
        >
          {orderButtonText}
        </button>
      </div>
    </>
  );
}

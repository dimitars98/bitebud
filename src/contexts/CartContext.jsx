import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  function addToCart(item, restId) {
    setCartItems((prev) => {
      if (prev.length > 0 && restaurantId && restaurantId !== restId) {
        alert("You can only order from one restaurant at a time.");
        return prev;
      }

      const existing = prev.find((i) => i.id === item.id);

      if (prev.length === 0) {
        setRestaurantId(restId);
      }

      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: item.quantity } : i
        );
      }

      return [...prev, item];
    });
  }

  function removeFromCart(id) {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (updated.length === 0) {
        setRestaurantId(null);
      }
      return updated;
    });
  }

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, restaurantId }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

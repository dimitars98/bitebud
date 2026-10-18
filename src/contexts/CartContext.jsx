import { X } from "lucide-react";
import { createContext, useContext, useState, useEffect } from "react";
import PopupModal from "../components/cart/PopupModal";
import { useTranslation } from "react-i18next";
import { MAX_ITEM_QTY } from "../helpers/cartTotals";

const CartContext = createContext();
const CART_STORAGE_KEY = "foodapp_cart";

export function CartProvider({ children }) {
  const storedCart = (() => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  })();

  const [cartItems, setCartItems] = useState(storedCart.cartItems || []);
  const [restaurantId, setRestaurantId] = useState(
    storedCart.restaurantId || null,
  );
  const [partnerId, setPartnerId] = useState(storedCart.partnerId || null); // ✅ track partner globally too
  const [conflictMessage, setConflictMessage] = useState("");
  const { t } = useTranslation();

  function addToCart(item, restId, partnerIdValue) {
    setCartItems((prev) => {
      if (prev.length > 0 && restaurantId && restaurantId !== restId) {
        setConflictMessage("cart.oneRestaurant"); // translation key, shown by PopupModal
        return prev;
      }

      const existing = prev.find((i) => i.id === item.id);

      if (prev.length === 0) {
        setRestaurantId(restId);
        setPartnerId(partnerIdValue);
      }

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: item.quantity,
                restaurantId: restId,
                partnerId: partnerIdValue,
              }
            : i,
        );
      }

      return [
        ...prev,
        { ...item, restaurantId: restId, partnerId: partnerIdValue },
      ];
    });
  }

  function removeFromCart(id) {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (updated.length === 0) {
        setRestaurantId(null);
        setPartnerId(null);
      }
      return updated;
    });
  }

  // +1, up to MAX_ITEM_QTY.
  function increaseQty(id) {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.min(i.quantity + 1, MAX_ITEM_QTY) } : i,
      ),
    );
  }

  // -1; at quantity 1 the item is removed (and an empty cart forgets its restaurant).
  function decreaseQty(id) {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      if (item.quantity > 1) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
        );
      }
      const updated = prev.filter((i) => i.id !== id);
      if (updated.length === 0) {
        setRestaurantId(null);
        setPartnerId(null);
      }
      return updated;
    });
  }

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
    setPartnerId(null);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({
        cartItems,
        restaurantId,
        partnerId,
      }),
    );
  }, [cartItems, restaurantId, partnerId]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        restaurantId,
        partnerId,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      }}
    >
      {children}
      <PopupModal
        isOpen={!!conflictMessage}
        onClose={() => setConflictMessage("")}
        message={conflictMessage && t(conflictMessage)}
      />
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

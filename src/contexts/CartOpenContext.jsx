import { createContext, useContext, useState } from "react";

const CartOpenContext = createContext();

export function CartOpenProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <CartOpenContext.Provider value={{ isCartOpen, setIsCartOpen }}>
      {children}
    </CartOpenContext.Provider>
  );
}

export function useCartOpen() {
  return useContext(CartOpenContext);
}

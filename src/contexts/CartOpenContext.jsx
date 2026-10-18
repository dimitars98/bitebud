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

// eslint-disable-next-line react-refresh/only-export-components
export function useCartOpen() {
  return useContext(CartOpenContext);
}

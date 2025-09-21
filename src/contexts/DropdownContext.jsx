// contexts/DropdownContext.js
import { createContext, useContext, useState } from "react";

const DropdownContext = createContext();

export function DropdownProvider({ children }) {
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  return (
    <DropdownContext.Provider
      value={{ mobileDropdownOpen, setMobileDropdownOpen }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

export function useDropdown() {
  return useContext(DropdownContext);
}

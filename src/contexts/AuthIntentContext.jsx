// src/contexts/AuthIntentContext.js
import { createContext, useContext, useState } from "react";

const AuthIntentContext = createContext();

export function AuthIntentProvider({ children }) {
  const [authIntent, setAuthIntent] = useState(null);

  return (
    <AuthIntentContext.Provider value={{ authIntent, setAuthIntent }}>
      {children}
    </AuthIntentContext.Provider>
  );
}

export function useAuthIntent() {
  const ctx = useContext(AuthIntentContext);
  if (!ctx) {
    throw new Error("useAuthIntent must be used within an AuthIntentProvider");
  }
  return ctx;
}

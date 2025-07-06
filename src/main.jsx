import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import store from "../store"; // Your Redux store setup
import { CartProvider } from "./contexts/CartContext";
import { CartOpenProvider } from "./contexts/CartOpenContext";
import { AuthProvider } from "./contexts/AuthContext";
import { RestaurantProvider } from "./contexts/RestaurantContext";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <CartProvider>
      <CartOpenProvider>
        <AuthProvider>
          <RestaurantProvider>
            <App />
          </RestaurantProvider>
        </AuthProvider>
      </CartOpenProvider>
    </CartProvider>
  </Provider>
);

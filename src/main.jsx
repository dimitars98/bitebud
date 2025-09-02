import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import store from "../src/store/store"; // Your Redux store setup
import { CartProvider } from "./contexts/CartContext";
import { CartOpenProvider } from "./contexts/CartOpenContext";
import { AuthProvider } from "./contexts/AuthContext";
import AuthListener from "./components/AuthListener";
import { FilterContextProvider } from "./contexts/FilterContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <CartProvider>
        <CartOpenProvider>
          <AuthListener>
            <FilterContextProvider>
              {/* <AuthProvider> */}
              {/* <RestaurantProvider> */}
              <App />
              {/* </RestaurantProvider> */}
              {/* </AuthProvider> */}
            </FilterContextProvider>
          </AuthListener>
        </CartOpenProvider>
      </CartProvider>
    </Provider>
  </QueryClientProvider>
);

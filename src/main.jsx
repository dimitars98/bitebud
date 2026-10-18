import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./i18n"; // sets up translations before anything renders
import "./index.css";
import "./styles/theme.css";
import "leaflet/dist/leaflet.css";
import store from "../src/store/store"; 
import { CartProvider } from "./contexts/CartContext";
import { CartOpenProvider } from "./contexts/CartOpenContext";
import AuthListener from "./components/auth/AuthListener";
import { FilterContextProvider } from "./contexts/FilterContext";
import { DropdownProvider } from "./contexts/DropdownContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { AuthIntentProvider } from "./contexts/AuthIntentContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <DropdownProvider>
        <CartProvider>
          <CartOpenProvider>
            <AuthListener>
              <AuthIntentProvider>
                <FilterContextProvider>
                  <CurrencyProvider>
                    <App />
                  </CurrencyProvider>
                </FilterContextProvider>
              </AuthIntentProvider>
            </AuthListener>
          </CartOpenProvider>
        </CartProvider>
      </DropdownProvider>
    </Provider>
  </QueryClientProvider>
);

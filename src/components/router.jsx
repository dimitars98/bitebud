// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Restaurant from "../pages/Restaurant";
import Login from "./Login";
import SignUp from "./SignUp";
import CheckoutPage from "../pages/CheckoutPage";
import RestaurantMenuPage from "../pages/RestaurantMenuPage";
import Profile from "../pages/Profile";
import OrderConfirmation from "../pages/OrderConfirmation";
import OrderTracking from "../pages/OrderTracking";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout fullWidth={true} />, // shared layout (Navbar, Footer, etc.)
    children: [
      { index: true, element: <Home /> },
      { path: "cart", element: <Cart /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "restaurant/:id", element: <RestaurantMenuPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "order-confirmation", element: <OrderConfirmation /> },
      { path: "order-tracking/:orderId", element: <OrderTracking /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

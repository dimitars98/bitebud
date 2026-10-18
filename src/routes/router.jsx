import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import CheckoutPage from "../pages/CheckoutPage";
import RestaurantMenuPage from "../pages/RestaurantMenuPage";
import Profile from "../pages/Profile";
import OrderConfirmation from "../pages/OrderConfirmation";
import OrderTracking from "../pages/OrderTracking";
import EmailLinkHandler from "../pages/EmailLinkHandler";
import AccountCreated from "../pages/AccountCreated";
import LandingPage from "../pages/Landing";
import PartnerSignup from "../pages/PartnerSignup";
import CourierSignup from "../pages/CourierSignup";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PartnerLogin from "../pages/PartnerLogin";
import CourierLogin from "../pages/CourierLogin";
import RequireRole from "../components/auth/RequireRole";
import PartnerDashboard from "../pages/PartnerDashboard";
import CourierDashboard from "../pages/CourierDashboard";
import SearchResults from "../pages/SearchResults";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout fullWidth={true} />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "explore", element: <Home /> },
      { path: "cart", element: <Cart /> },
      { path: "search", element: <SearchResults /> },

      // { path: "login", element: <Login /> },
      // { path: "signup", element: <SignUp /> },
      { path: "restaurant/:slug", element: <RestaurantMenuPage /> },
      {
        path: "restaurant/:slug/item/:itemSlug",
        element: <RestaurantMenuPage />,
      },
      {
        path: "/checkout",
        element: (
          <Elements stripe={stripePromise}>
            <CheckoutPage />
          </Elements>
        ),
      },
      { path: "order-confirmation", element: <OrderConfirmation /> },
      { path: "order-tracking/:orderId", element: <OrderTracking /> },
      { path: "profile", element: <Profile /> },
      { path: "partner-form", element: <PartnerSignup /> },
      { path: "courier-form", element: <CourierSignup /> },
      { path: "partner-login", element: <PartnerLogin /> },
      { path: "courier-login", element: <CourierLogin /> },
      { path: "auth-complete", element: <EmailLinkHandler /> },
      { path: "account-created", element: <AccountCreated /> },
      {
        path: "partner-dashboard",
        element: (
          <RequireRole role="partner">
            <PartnerDashboard />
          </RequireRole>
        ),
      },
      {
        path: "courier-dashboard",
        element: (
          <RequireRole role="courier">
            <CourierDashboard />
          </RequireRole>
        ),
      },
    ],
  },
]);

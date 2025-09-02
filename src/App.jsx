import { RouterProvider } from "react-router-dom";
import { router } from "./components/router";
import { Toaster } from "react-hot-toast";
import CookieConsent from "./ui/CookieConsent";

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
      <CookieConsent />
    </>
  );
}

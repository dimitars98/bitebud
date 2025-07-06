import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./components/router";
import { Toaster } from "react-hot-toast";
import CookieConsent from "./ui/CookieConsent";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" reverseOrder={false} />
        <RouterProvider router={router} />
        <CookieConsent />
      </QueryClientProvider>
    </>
  );
}

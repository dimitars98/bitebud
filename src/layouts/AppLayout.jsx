import { collection, onSnapshot, query, where } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import CartDrawer from "../components/cart/CartDrawer";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/NavBar";
import ScrollReset from "../components/layout/ScrollReset";
import ScrollToTop from "../components/layout/ScrollToTop";
import { db } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "../modals/AuthModal";
import Modal from "../ui/Modal";
import RatingModal from "../modals/RatingModal";
import { docsWithId } from "../utils/firestore";

export default function AppLayout({ fullWidth = false }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? true : false;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentOrderToRate, setCurrentOrderToRate] = useState(null);

  const navigate = useNavigate();

  const { user } = useAuth();

  const handleAuthSuccess = ({ isSignup }) => {
    setTimeout(() => {
      closeAuth();

      if (isSignup) {
        navigate("/account-created");
      }
    }, 200);
  };

  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuth = useCallback(() => {
    setIsAuthOpen(false);
  }, []);

  useEffect(() => {
    const shouldLockScroll = isAuthOpen || isCartOpen;

    if (shouldLockScroll) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isAuthOpen, isCartOpen]);

  useEffect(() => {
    if (!user) return;

    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const unratedDelivered = docsWithId(snapshot)
        .filter((order) => order.step === 5 && !order.courierRating);

      if (unratedDelivered.length > 0) {
        setCurrentOrderToRate(unratedDelivered[0]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // useEffect(() => {
  //   const root = document.documentElement;

  //   if (isDarkTheme) {
  //     root.classList.add("dark");
  //     localStorage.setItem("theme", "dark");
  //   } else {
  //     root.classList.remove("dark");
  //     localStorage.setItem("theme", "light");
  //   }
  // }, [isDarkTheme]);

  return (
    <div className="bg-(--bg-main) dark:bg-(--bg-main) min-h-screen relative flex flex-col ">
      {/* <div className="fixed bottom-4 right-4 z-30">
        <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
      </div> */}
      <Navbar
        onCartClick={toggleCart}
        onLoginClick={() => openAuth("login")}
        onSignUpClick={() => openAuth("signup")}
        setIsDarkTheme={setIsDarkTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ScrollReset />
      <main
        className={`flex-grow ${
          fullWidth ? "px-0" : "px-4 sm:px-6 md:px-8 lg:px-[400px]"
        } overflow-hidden`}
      >
        <ScrollToTop />

        <Outlet
          context={{ searchQuery, isDarkTheme, setIsDarkTheme, openAuth }}
        />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        onTriggerLogin={openAuth}
      />
      <Modal
        authModal={true}
        isOpen={isAuthOpen}
        onClose={closeAuth}
        key="auth-modal"
      >
        {/* <Modal.CloseButton authModal={true} /> */}
        <AuthModal initialMode={authMode} onSuccess={handleAuthSuccess} />
      </Modal>

      <AnimatePresence>
        {currentOrderToRate && (
          <RatingModal
            order={currentOrderToRate}
            onClose={() => setCurrentOrderToRate(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

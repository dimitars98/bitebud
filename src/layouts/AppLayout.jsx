import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../features/auth/authSlice";
import { auth } from "../firebase/firebase";
import Modal from "../modals/Modal";
import ThemeToggle from "../ui/ThemeToggle";
import ScrollToTop from "../components/ScrollToTop";
import AuthModal from "../modals/AuthModal";
import { AnimatePresence } from "framer-motion";

export default function AppLayout({ fullWidth = false }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? true : false;
  });
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

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
    if (isAuthOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Clean up in case component unmounts while modal is open
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isAuthOpen]);

  useEffect(() => {
    const root = document.documentElement;

    if (isDarkTheme) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkTheme]);

  return (
    <div className="dark:bg-black min-h-screen relative flex flex-col ">
      <div className="fixed bottom-4 right-4 z-30">
        <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
      </div>
      <Navbar
        onCartClick={toggleCart}
        onLoginClick={() => openAuth("login")}
        onSignUpClick={() => openAuth("signup")}
        setIsDarkTheme={setIsDarkTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main
        className={`flex-grow ${
          fullWidth ? "px-0" : "px-4 sm:px-6 md:px-8 lg:px-[400px]"
        }`}
      >
        <ScrollToTop />
        <Outlet context={{ searchQuery, isDarkTheme, setIsDarkTheme }} />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        onTriggerLogin={openAuth}
      />

      <AnimatePresence>
        {isAuthOpen && (
          <Modal isOpen={isAuthOpen} onClose={closeAuth} key="auth-modal">
            <Modal.CloseButton />
            <Modal.Body>
              <AuthModal initialMode={authMode} onSuccess={handleAuthSuccess} />
            </Modal.Body>
          </Modal>
        )}
      </AnimatePresence>
      {/* {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={closeAuth}
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
        />
      )} */}

      <Footer />
    </div>
  );
}

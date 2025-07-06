import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import Login from "../components/Login";
import { Outlet } from "react-router-dom";
import SignUp from "./SignUp";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../features/auth/authSlice";
import { auth } from "../../firebase";

export default function AppLayout({ fullWidth = false }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? true : false;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email }));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openLogin = () => {
    setIsLoginOpen(true); // Mount modal
    setTimeout(() => setIsLoginVisible(true), 10); // Animate in
  };

  const closeLogin = () => {
    setIsLoginVisible(false); // Animate out
    setTimeout(() => setIsLoginOpen(false), 300); // Unmount after animation
  };

  const openSignUp = () => {
    setIsSignUpOpen(true);
    setTimeout(() => setIsSignUpVisible(true), 10);
  };

  const closeSignUp = () => {
    setIsSignUpVisible(false);
    setTimeout(() => setIsSignUpOpen(false), 300);
  };

  useEffect(() => {
    if (!isLoginOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeLogin();
      }
    };

    // Disable background scroll
    document.body.classList.add("overflow-hidden");

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup on close
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isLoginOpen]);

  useEffect(() => {
    if (!isSignUpOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeSignUp();
      }
    };

    document.body.classList.add("overflow-hidden");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSignUpOpen]);

  useEffect(() => {
    const root = document.documentElement;
    console.log("Applying theme:", isDarkTheme ? "dark" : "light");

    if (isDarkTheme) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkTheme]);

  console.log("Dark theme?", isDarkTheme);

  return (
    <div className="dark:bg-black min-h-screen relative flex flex-col ">
      <Navbar
        onCartClick={toggleCart}
        onLoginClick={openLogin}
        onSignUpClick={openSignUp}
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
      />

      <main
        className={`flex-grow ${
          fullWidth ? "px-0" : "px-4 sm:px-6 md:px-8 lg:px-[400px]"
        }`}
      >
        <Outlet />
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {isCartOpen && <div onClick={closeCart} className="fixed inset-0 z-40" />}

      {/* Login Modal */}
      {isLoginOpen && (
        <>
          {/* Blurred backdrop */}
          <div
            className={`fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
              isLoginVisible ? "opacity-100" : "opacity-0"
            } pointer-events-none`}
          />

          {/* Modal content */}
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4 pointer-events-auto">
            <div
              className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative transform transition-all duration-300 ease-out ${
                isLoginVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              {/* Close button */}
              <button
                onClick={closeLogin}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>

              {/* Login form */}
              <Login onSuccess={closeLogin} />
            </div>
          </div>
        </>
      )}

      {isSignUpOpen && (
        <>
          <div
            onClick={closeSignUp}
            className={`fixed inset-0 z-50 bg-transparent backdrop-filter backdrop-blur-sm transition-opacity duration-300 ease-out ${
              isSignUpVisible ? "opacity-100" : "opacity-0"
            }`}
          />
          <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <div
              className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative transform transition-all duration-300 ease-out ${
                isSignUpVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              <button
                onClick={closeSignUp}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
              <SignUp onSuccess={closeSignUp} />
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}

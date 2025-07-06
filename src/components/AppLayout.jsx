import React, { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
// import Login from "../components/Login"; // We'll pass Login form as children to Modal
// import SignUp from "./SignUp"; // We'll pass SignUp form as children to Modal
import { Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser, logout } from "../features/auth/authSlice";
import { auth } from "../../firebase";
import Login from "../components/Login"; // Make sure to import these as they are children
import SignUp from "./SignUp"; // Make sure to import these as they are children
import Modal from "../ui/Modal";
import ThemeToggle from "../ui/ThemeToggle";
import ScrollToTop from "./ScrollToTop";

export default function AppLayout({ fullWidth = false }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false); // For animation
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = useState(false); // For animation
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? true : false;
  });
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();

  const cartDrawerRef = useRef();

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (cartDrawerRef.current && !cartDrawerRef.current.contains(e.target)) {
        closeCart(); // close drawer if clicked outside
      }
    }

    if (isCartOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isCartOpen]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoUrl,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Cart Handlers
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Login Modal Handlers
  const openLogin = () => {
    setIsLoginOpen(true); // Mount modal
    setTimeout(() => setIsLoginVisible(true), 10); // Animate in
  };

  const closeLogin = useCallback(() => {
    setIsLoginVisible(false); // Animate out
    // Only unmount after animation completes
    setTimeout(() => {
      setIsLoginOpen(false);
      document.body.classList.remove("overflow-hidden"); // Ensure scroll is re-enabled
    }, 300);
  }, []);

  // SignUp Modal Handlers
  const openSignUp = () => {
    setIsSignUpOpen(true);
    setTimeout(() => setIsSignUpVisible(true), 10);
  };

  // const closeSignUp = () => {
  //   setIsSignUpVisible(false);
  //   setTimeout(() => {
  //     setIsSignUpOpen(false);
  //     document.body.classList.remove("overflow-hidden"); // Ensure scroll is re-enabled
  //   }, 300);
  // };

  const closeSignUp = useCallback(() => {
    setIsSignUpVisible(false);
    setTimeout(() => {
      setIsSignUpOpen(false);
      document.body.classList.remove("overflow-hidden");
    }, 300);
  }, []);

  // Effect for handling body scroll and Escape key for Login Modal
  useEffect(() => {
    if (isLoginOpen) {
      // document.body.classList.add("overflow-hidden");
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          closeLogin();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        // Do NOT remove overflow-hidden here, it's handled in closeLogin/closeSignUp
      };
    }
  }, [isLoginOpen, closeLogin]); // Include closeLogin in dependency array

  // Effect for handling body scroll and Escape key for SignUp Modal
  useEffect(() => {
    if (isSignUpOpen) {
      // document.body.classList.add("overflow-hidden");
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          closeSignUp();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        // Do NOT remove overflow-hidden here, it's handled in closeLogin/closeSignUp
      };
    }
  }, [isSignUpOpen, closeSignUp]); // Include closeSignUp in dependency array

  // Theme Toggle Effect
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

  return (
    <div className="dark:bg-black min-h-screen relative flex flex-col ">
      <div className="fixed bottom-4 right-4 z-30">
        <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
      </div>
      <Navbar
        onCartClick={toggleCart}
        onLoginClick={openLogin}
        onSignUpClick={openSignUp}
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
        onTriggerLogin={openLogin}
      />
      {/* Removed the extra backdrop div for CartDrawer here, CartDrawer should handle its own backdrop */}

      {/* Login Modal */}
      <Modal
        isOpen={isLoginOpen}
        onClose={closeLogin}
        isVisible={isLoginVisible}
      >
        <Login onSuccess={closeLogin} />
      </Modal>

      {/* SignUp Modal */}
      <Modal
        isOpen={isSignUpOpen}
        onClose={closeSignUp}
        isVisible={isSignUpVisible}
      >
        <SignUp onSuccess={closeSignUp} />
      </Modal>

      <Footer />
    </div>
  );
}

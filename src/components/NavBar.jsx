import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { onLog } from "firebase/app";
import { setSearchQuery } from "../features/ui/uiSlice"; // adjust path
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({
  onCartClick,
  onLoginClick,
  onSignUpClick,
  isDarkTheme,
  setIsDarkTheme,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileToggleButtonRef = useRef(null); // <--- ADD THIS NEW REF

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const searchQuery = useSelector((state) => state.ui.searchQuery);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const handleLoginClick = () => {
    setMenuOpen(false);
    onLoginClick();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      // Step 1: Check if the click originated from the mobile toggle button itself.
      // If it did, we should ignore this click for the outside handler.
      if (
        mobileToggleButtonRef.current &&
        mobileToggleButtonRef.current.contains(event.target)
      )
        return; // Exit early, don't close the menu

      // Step 2: Proceed with the regular outside click logic for the dropdown.
      if (dropdownRef.current) {
        const isClickInsideDropdown = dropdownRef.current.contains(
          event.target
        );

        if (!isClickInsideDropdown) {
          setMenuOpen(false);
        }
      }
    }

    if (menuOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 50); // Small delay

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]); // Dependencies

  useEffect(() => {
    if (user) {
      setMenuOpen(false);
    }
  }, [user]);

  return (
    <nav className="h-20 border-b dark:border-gray-800 border-gray-200 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 px-4 sm:px-6 py-4">
      {/* Mobile layout: centered logo with right-aligned icons */}

      <div className="sm:hidden flex justify-between items-center w-full h-full px-2">
        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-bold text-yellow-500">
          SkopjeEats
        </Link>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          {/* <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} /> */}

          <button
            onClick={onCartClick}
            className="flex items-center justify-center h-full"
          >
            <span className="material-symbols-rounded text-gray-800 dark:text-gray-400 text-2xl leading-none">
              shopping_bag
            </span>
          </button>
          <button
            ref={mobileToggleButtonRef}
            onClick={(e) => {
              e.stopPropagation(); // <--- Add this line
              setMenuOpen(!menuOpen);
            }}
            className="flex items-center justify-center h-full text-gray-800 dark:text-gray-400 focus:outline-none"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  className="material-symbols-rounded text-2xl leading-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  close
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  className="material-symbols-rounded text-2xl leading-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  menu
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Desktop layout: original layout untouched */}
      <div className="hidden sm:flex justify-between items-center flex-wrap gap-4 max-w-[1500px] mx-auto">
        <Link to="/" className="text-2xl font-bold text-yellow-500">
          SkopjeEats
        </Link>

        <div className="transition-all duration-300 w-70 focus-within:w-100 px-4">
          <div className="relative">
            <span className="material-symbols-rounded absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              search
            </span>

            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="focus:border-2 placeholder-gray-500 dark:text-white focus:border-yellow-500 outline-none py-3 pl-12 pr-10 w-full rounded-4xl transition-colors duration-300 ease-in bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            />

            {searchQuery && (
              <button
                onClick={() => dispatch(setSearchQuery(""))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none cursor-pointer"
                aria-label="Clear search"
              >
                <span className="material-symbols-rounded text-xl">close</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-4 text-gray-900">
            <button
              onClick={onCartClick}
              className="flex items-center justify-center h-full focus:outline-none hover:text-amber-400 cursor-pointer transition-all duration-200 ease-in dark:text-gray-400"
            >
              <span className="material-symbols-rounded">shopping_bag</span>
            </button>
          </div>

          <div className="hidden sm:flex space-x-2">
            {!user ? (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-sm px-4 py-2 rounded-lg border border-yellow-500 hover:bg-yellow-500 hover:text-white transition duration-200 ease-in cursor-pointer dark:text-white"
                >
                  Log In
                </button>
                <button
                  onClick={onSignUpClick}
                  className="text-sm px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-200 ease-in cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                {/* <div className="flex items-center gap-2 mr-2">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  {user.displayName && (
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {user.displayName}
                    </span>
                  )}
                </div> */}

                <Link
                  to="profile"
                  className="flex items-center gap-2 mr-2 transition"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <span className="material-symbols-rounded text-2xl dark:text-gray-400">
                      account_circle
                    </span>
                  )}
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    Profile
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col justify-between h-60 -mx-4 sm:mx-0 mt-4 pb-12 space-y-4 bg-white dark:bg-gray-900 w-screen px-4 origin-top"
          >
            {/* Your mobile menu content (search input, buttons, etc.) */}
            <div className="relative w-full">
              <span className="material-symbols-rounded absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                search
              </span>
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                className="w-full text-gray-900 dark:text-gray-50 focus:border-2 focus:border-yellow-500 outline-none py-3 pl-12 pr-6 rounded-4xl transition-colors duration-300 ease-in bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              />
            </div>

            <div className="flex flex-col gap-2">
              {!user ? (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="text-sm dark:text-white px-4 py-2 rounded-lg border border-yellow-500 hover:bg-yellow-500 hover:text-white transition cursor-pointer"
                  >
                    Log In
                  </button>
                  <button
                    onClick={onSignUpClick}
                    className="text-sm px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                >
                  Log Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

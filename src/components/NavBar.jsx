import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { setSearchQuery } from "../features/ui/uiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useFilterContext } from "../contexts/FilterContext";

export default function Navbar({ onCartClick, onLoginClick, onSignUpClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  const mobileToggleButtonRef = useRef(null);

  const { resetFilters } = useFilterContext();

  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const searchQuery = useSelector((state) => state.ui.searchQuery);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
    setMenuOpen(false);
  };

  const handleLoginClick = () => {
    setMenuOpen(false);
    onLoginClick();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileToggleButtonRef.current &&
        mobileToggleButtonRef.current.contains(event.target)
      )
        return;

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
      }, 50);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [menuOpen]);

  useEffect(() => {
    function handleClickOutsideProfileDropdown(e) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target) &&
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutsideProfileDropdown);
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideProfileDropdown
      );
    };
  }, [profileDropdownOpen]);

  useEffect(() => {
    if (user) {
      setMenuOpen(false);
    }
  }, [user]);

  return (
    <nav className="border-b flex flex-col items-center dark:border-gray-800 border-gray-200 bg-white dark:bg-gray-900 shadow-md sticky top-0 z-30 px-2 md:px-4 sm:px-6 py-4">
      {/* Mobile layout: centered logo with right-aligned icons */}

      <div className="sm:hidden flex justify-between items-center w-full h-full px-2">
        {/* Left: Logo */}
        <Link
          to="/"
          onClick={resetFilters}
          className="text-2xl font-bold text-yellow-500"
        >
          Bite<span className="text-gray-800 dark:text-white">Bud</span>
        </Link>

        {/* Right: Icons */}
        <div className="flex items-center space-x-2">
          {/* <ThemeToggle toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} /> */}

          <button
            onClick={onCartClick}
            className="flex items-center justify-center h-full"
          >
            <span className="material-symbols-rounded text-gray-800 dark:text-gray-400 text-2xl leading-none">
              shopping_bag
            </span>
          </button>
          {user && (
            <div
              ref={profileRef}
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="relative flex items-center gap-2 mr-2 transition cursor-pointer"
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
              <span className="hidden md:block text-sm text-gray-800 dark:text-gray-200">
                Profile
              </span>

              {/* Dropdown */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    ref={profileDropdownRef}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-[110%] right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg z-50"
                  >
                    <div className="flex flex-col text-sm text-gray-800 dark:text-gray-100">
                      <Link
                        to="/profile"
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={() => alert("Change language")}
                        className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        Language: EN
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:text-white transition"
                      >
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <button
            ref={mobileToggleButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className={`${
              user ? "hidden" : ""
            } flex items-center justify-center h-full text-gray-800 dark:text-gray-400 focus:outline-none`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  className="material-symbols-rounded text-2xl leading-none flex items-center justify-center"
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
      <div className="hidden sm:flex items-center justify-between h-full w-full max-w-[1500px] mx-auto relative">
        {/* Left: Logo */}
        <Link
          to="/"
          onClick={resetFilters}
          className="text-3xl font-bold text-yellow-500 shrink-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400"
        >
          Bite<span className="text-gray-800 dark:text-white">Bud</span>
        </Link>

        {/* <div className="transition-all duration-300 w-70 focus-within:w-100 px-4"> */}
        <div className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 w-[280px] focus-within:w-[380px]">
          <div className="relative">
            <span className="material-symbols-rounded absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              search
            </span>

            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="border border-transparent focus:border-2 placeholder-gray-500 dark:text-white focus:border-yellow-500 outline-none py-3 pl-12 pr-10 w-full rounded-4xl transition-colors duration-300 ease-in bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
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
              className="flex items-center justify-center h-full focus:outline-none hover:text-amber-400 cursor-pointer transition-all duration-200 ease-in dark:text-gray-400 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400"
            >
              <span className="material-symbols-rounded">shopping_bag</span>
            </button>
          </div>

          <div className="hidden sm:flex space-x-2">
            {!user ? (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-sm px-4 py-2 rounded-lg border border-yellow-500 hover:bg-yellow-500 hover:text-white transition duration-200 ease-in cursor-pointer dark:text-white focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400"
                >
                  Log In
                </button>
                <button
                  onClick={onSignUpClick}
                  className="text-sm px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-200 ease-in cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex gap-3 relative">
                <div
                  ref={profileRef}
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="relative flex items-center gap-2 mr-2 transition cursor-pointer select-none"
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

                  {/* Dropdown */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        ref={profileDropdownRef}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[110%] right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col text-sm text-gray-800 dark:text-gray-100">
                          <Link
                            to="/profile"
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            My Profile
                          </Link>
                          <button
                            onClick={() => alert("Change language")}
                            className="px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          >
                            Language: EN
                          </button>
                          <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:text-white transition"
                          >
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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

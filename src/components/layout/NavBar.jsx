import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { setSearchQuery } from "../../features/ui/uiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useFilterContext } from "../../contexts/FilterContext";
import { useCart } from "../../contexts/CartContext";
import DarkModeToggle from "../../ui/DarkModeToggle";
import { Search, User, User2 } from "lucide-react";
import CurrencySelector from "../currency/CurrencySelector";
import MobileCurrencySelector from "../currency/MobileCurrencySelector";
import Logo from "./Logo";
import LanguageSwitcher from "../LanguageSwitcher";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useTranslation } from "react-i18next";

export default function Navbar({ onCartClick, onLoginClick, onSignUpClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // phone slide-down sheet
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // desktop avatar menu
  const [isSearching, setIsSearching] = useState(false);

  // Mobile sheet: the panel, and the two buttons that toggle it
  // (hamburger when logged out, avatar when logged in).
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const mobileAvatarRef = useRef(null);
  // Desktop account menu: the avatar button, and the panel it opens.
  const profileTriggerRef = useRef(null);
  const profileMenuRef = useRef(null);
  const navRef = useRef(null); // used to measure the navbar height

  const { t } = useTranslation();
  const { resetFilters } = useFilterContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const user = useSelector((state) => state.auth.user);
  const { user, loading } = useSelector((state) => state.auth); // const { user, loading } = useAuth();

  const searchQuery = useSelector((state) => state.ui.searchQuery);

  const { totalQuantity } = useCart();

  const location = useLocation();

  // The first keystroke pushes a new history entry, so Back returns to the page you
  // searched from; later keystrokes replace it so each letter isn't its own entry.
  const updateSearch = (value) => {
    dispatch(setSearchQuery(value));
    const onSearchPage = location.pathname === "/search";

    if (!value.trim()) {
      navigate("/explore", { replace: onSearchPage });
    } else {
      navigate(`/search?q=${encodeURIComponent(value)}`, {
        replace: onSearchPage,
      });
    }
  };

  // Keep the search box in sync with the URL: going Back/Forward onto /search restores
  // the query, leaving /search clears it (no stale "Search Results" on other pages).
  useEffect(() => {
    const urlQuery =
      location.pathname === "/search"
        ? (new URLSearchParams(location.search).get("q") ?? "")
        : "";
    if (urlQuery !== searchQuery) dispatch(setSearchQuery(urlQuery));
    // only react to URL changes; searchQuery is read, not watched
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, dispatch]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  const handleSignupClick = () => {
    setIsMobileMenuOpen(false);
    onSignUpClick();
  };

  const handleLoginClick = () => {
    setIsMobileMenuOpen(false);
    onLoginClick();
  };

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       // Fetch role from Firestore
  //       let role = null;

  //       const collections = ["users", "partners", "couriers"];
  //       for (let col of collections) {
  //         const docRef = doc(db, col, user.uid);
  //         const docSnap = await getDoc(docRef);
  //         if (docSnap.exists()) {
  //           role = docSnap.data().role;
  //           break;
  //         }
  //       }

  //       // Dispatch to Redux
  //       dispatch(
  //         setUser({
  //           uid: user.uid,
  //           email: user.email,
  //           displayName: user.displayName,
  //           photoURL: user.photoURL,
  //           role,
  //         })
  //       );
  //     } else {
  //       dispatch(logout());
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [dispatch]);

  // useEffect(() => {
  //   const id = setTimeout(() => {
  //     if (!searchQuery.trim()) {
  //       navigate("/", { replace: true });
  //     } else {
  //       navigate(`/search?q=${encodeURIComponent(searchQuery)}`, {
  //         replace: true,
  //       });
  //     }
  //   }, 200);

  //   return () => clearTimeout(id);
  // }, [searchQuery, navigate]);

  // useEffect(() => {
  //   document.documentElement.style.setProperty(
  //     "--nav-height",
  //     `${navRef.current.offsetHeight}px`
  //   );
  // }, []);

  useEffect(() => {
    const update = () => {
      document.documentElement.style.setProperty(
        "--nav-height",
        `${navRef.current.offsetHeight}px`,
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Close a menu when you click outside it. The button that opens a menu counts
  // as "inside", otherwise pressing it would close the menu and reopen it.
  useClickOutside(
    [profileMenuRef, profileTriggerRef],
    () => setIsProfileMenuOpen(false),
    { enabled: isProfileMenuOpen },
  );
  useClickOutside(
    [mobileMenuRef, mobileMenuButtonRef, mobileAvatarRef],
    () => setIsMobileMenuOpen(false),
    { enabled: isMobileMenuOpen },
  );


  return (
    <nav
      ref={navRef}
      className="border-b flex flex-col items-center dark:border-(--border-primary) border-(--border-primary) bg-white dark:bg-(--brand-bg-primary) shadow-[0_2px_8px_rgba(0,0,0,0.08)] sticky top-0 z-[999] px-4 md:px-6 py-4"
    >
      {/* Mobile layout */}
      <div className="md:hidden flex justify-between items-center w-full h-full">
        <Link
          to="/"
          onClick={resetFilters}
          aria-label={t("common.homeLabel")}
          className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand-primary)"
        >
          <Logo size={38} />
        </Link>

        <div className="flex items-center space-x-2">
          <DarkModeToggle />
          <MobileCurrencySelector />
          <LanguageSwitcher />

          <button
            onClick={onCartClick}
            aria-label={t("nav.openCart")}
            className="relative flex items-center justify-center h-full"
          >
            <span className="material-symbols-rounded text-(--text-primary) dark:text-(--text-muted) text-2xl leading-none">
              shopping_bag
            </span>
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-(--badge-bg) dark:bg-(--badge-bg) text-gray-50 dark:text-gray-900 text-xs font-bold h-4 w-4 flex items-center justify-center rounded-full text-center">
                {totalQuantity}
              </span>
            )}
          </button>

          {user && (
            <div
              ref={mobileAvatarRef}
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen((prev) => !prev);
              }}
              className="relative flex items-center gap-2 mr-2 transition cursor-pointer z-50"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <span className="text-2xl text-(--text-primary) dark:text-white">
                  <User />
                </span>
              )}
            </div>
          )}

          <button
            ref={mobileMenuButtonRef}
            onClick={(e) => {
              e.stopPropagation(); // prevent overlay closing immediately
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            aria-label={
              isMobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")
            }
            aria-expanded={isMobileMenuOpen}
            className={`${
              user ? "hidden" : ""
            } flex items-center justify-center h-full text-(--text-secondary) dark:text-(--text-muted) focus:outline-none`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
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

      {/* Desktop layout */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8 h-full w-full max-w-[1500px] mx-auto">
        <Link
          to="/"
          onClick={() => {
            resetFilters();
            dispatch(setSearchQuery(""));
          }}
          aria-label={t("common.homeLabel")}
          className="flex items-center shrink-0 rounded-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand-primary)"
        >
          <Logo size={46} />
        </Link>

        {/* In the flow (not absolutely centred) so it can never cover the controls on the right */}
        <div className="flex-1 min-w-0 flex justify-center">
          <div className="relative w-full max-w-[420px]">
            <span className="material-symbols-rounded absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder={t("nav.searchPlaceholder")}
              value={searchQuery}
              // onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              onChange={(e) => updateSearch(e.target.value)}
              className="border border-transparent focus:border-2 placeholder-gray-500 dark:text-(--text-primary) focus:border-(--brand) outline-none py-3 pl-12 pr-10 w-full rounded-4xl transition-colors duration-300 ease-in bg-(--bg-secondary) dark:bg-(--brand-bg-secondary) hover:bg-(--bg-secondary-hover) dark:hover:bg-(--brand-bg-secondary-hover)"
            />
            {searchQuery && (
              <button
                onClick={() => updateSearch("")}
                className="absolute right-3 top-0 bottom-0 my-auto flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
                aria-label={t("nav.clearSearch")}
              >
                <span className="material-symbols-rounded text-xl">close</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-4 text-(--text-primary)">
            <DarkModeToggle />
            <MobileCurrencySelector />
            <LanguageSwitcher />
            <button
              onClick={onCartClick}
              aria-label={t("nav.openCart")}
              className="relative flex items-center justify-center h-full focus:outline-none hover:text-(--brand-primary) cursor-pointer transition-all duration-200 ease-in dark:text-(--text-muted) focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand-primary)"
            >
              <span className="material-symbols-rounded">shopping_bag</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-(--badge-bg) dark:bg-(--badge-bg) text-white dark:text-gray-900 text-xs font-bold h-4 w-4 flex items-center justify-center rounded-full text-center">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>

          <div className="flex gap-2">
            {!user && !loading && (
              <>
                <button
                  onClick={onLoginClick}
                  className="
                    text-sm px-4 py-2 rounded-lg 
                    border border-(--brand) 
                    text-yellow-600 dark:text-(--brand-primary)
                    hover:bg-(--brand-soft) dark:hover:bg-slate-800
                    transition duration-200 ease-in
                    cursor-pointer 
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)"
                >
                  {t("nav.logIn")}
                </button>

                <button
                  onClick={onSignUpClick}
                  className="
                  text-sm px-4 py-2 rounded-lg 
                  bg-(--brand) text-white 
                  hover:bg-(--brand-hover) 
                  transition duration-200 ease-in
                  cursor-pointer 
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)
                "
                >
                  {t("nav.signUp")}
                </button>
              </>
            )}

            {user && (
              <div className="relative">
                <button
                  ref={profileTriggerRef}
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  aria-label={t("nav.accountMenu")}
                  aria-haspopup="menu"
                  aria-expanded={isProfileMenuOpen}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full border-4 border-transparent hover:border-(--brand)/30 transition-colors"
                    />
                  ) : (
                    <span className="text-2xl text-(--text-primary) hover:text-(--brand-primary) transition-colors duration-200 dark:text-white">
                      <User />
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      ref={profileMenuRef}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-4 w-48 bg-white dark:bg-(--brand-bg-secondary) shadow-lg rounded-lg py-2 z-50"
                      onClick={(e) => {
                        // e.stopPropagation();
                        setIsProfileMenuOpen(false);
                      }}
                    >
                      <div className="flex flex-col text-sm">
                        {/* {user?.role === "customer" && ( */}
                        <>
                          <Link
                            to="/profile"
                            className="text-(--text-primary) dark:(--text-primary) px-4 py-2 dark:hover:bg-(--brand-bg-secondary-hover) hover:bg-gray-100"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            {t("nav.myProfile")}
                          </Link>
                        </>
                        {/* )} */}
                        {user?.role === "partner" && (
                          <Link
                            to="partner-dashboard"
                            className="text-(--text-primary) dark:(--text-primary) px-4 py-2 dark:hover:bg-(--brand-bg-secondary-hover) hover:bg-gray-100"
                          >
                            {t("nav.partnerDashboard")}
                          </Link>
                        )}

                        {user?.role === "courier" && (
                          <Link
                            to="courier-dashboard"
                            className="text-(--text-primary) dark:(--text-primary) px-4 py-2 dark:hover:bg-(--brand-bg-secondary-hover) hover:bg-gray-100"
                          >
                            {t("nav.courierDashboard")}
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 text-left text-red-500 dark:hover:bg-red-500/30 hover:bg-red-100"
                        >
                          {t("nav.logOut")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0, transformOrigin: "top" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            layout // <-- enables smooth height animations
            className={`fixed top-16 left-0 w-full md:hidden flex flex-col gap-6 px-4 pb-6 z-[999] border-b bg-white dark:bg-(--brand-bg-primary) border-b-(--border-primary)
      `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Bar */}
            <motion.div layout className="relative w-full mt-3">
              <span className="material-symbols-rounded absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                search
              </span>

              <input
                type="text"
                placeholder={t("nav.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => updateSearch(e.target.value)}
                onFocus={() => setIsSearching(true)}
                onBlur={() => setIsSearching(false)}
                className="w-full text-(--text-primary) dark:text-(--text-primary) py-3 pl-12 pr-6 rounded-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand) 
            bg-(--bg-secondary) dark:bg-(--brand-bg-secondary)
            transition-colors duration-300"
              />
            </motion.div>

            {/* Buttons — animate fade + slide when hidden */}
            <AnimatePresence>
              {!isSearching && (
                <motion.div
                  key="menuButtons"
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-2"
                >
                  {!user ? (
                    <>
                      <button
                        onClick={handleLoginClick}
                        className="text-sm text-(--brand-primary) dark:text-(--brand-primary) px-4 py-2 rounded-lg border border-(--brand-primary) hover:bg-(--brand-primary) transition cursor-pointer"
                      >
                        {t("nav.logIn")}
                      </button>
                      <button
                        onClick={handleSignupClick}
                        className="text-sm px-4 py-2 rounded-lg bg-(--brand-primary) text-white transition cursor-pointer"
                      >
                        {t("nav.signUp")}
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-sm text-center text-(--text-muted) px-4 py-2 rounded-lg mt-6 border border-(--border-primary)"
                      >
                        {t("nav.myProfile")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-sm px-4 py-2 rounded-lg mb-6 border border-red-500 text-red-500 transition"
                      >
                        {t("nav.logOut")}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              layout
              className="w-full flex justify-center pb-2"
            >
              <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

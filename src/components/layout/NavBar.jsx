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
import { ChevronRight, LogOut, User } from "lucide-react";
import CurrencySelector from "../currency/CurrencySelector";
import MobileCurrencySelector from "../currency/MobileCurrencySelector";
import Logo from "./Logo";
import LanguageSwitcher from "../LanguageSwitcher";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import MobilePreferences from "./MobilePreferences";
import { useTranslation } from "react-i18next";

export default function Navbar({ onCartClick, onLoginClick, onSignUpClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // phone slide-down sheet
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // desktop avatar menu

  // Mobile sheet: the panel, and the button that toggles it
  // (hamburger when logged out, your avatar when logged in).
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
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
    [mobileMenuRef, mobileMenuButtonRef],
    () => setIsMobileMenuOpen(false),
    { enabled: isMobileMenuOpen },
  );
  useEscapeKey(() => setIsMobileMenuOpen(false), isMobileMenuOpen);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Shown in the avatar when there's no photo, and in the account card.
  const accountName = user?.displayName || user?.email || "";
  const initial = accountName.trim().charAt(0).toUpperCase() || "?";

  return (
    <nav
      ref={navRef}
      className="border-b flex flex-col items-center dark:border-(--border-primary) border-(--border-primary) bg-white dark:bg-(--brand-bg-primary) shadow-[0_2px_8px_rgba(0,0,0,0.08)] sticky top-0 z-[999] px-4 md:px-6 py-4"
    >
      {/* Mobile layout: logo, cart and the menu button. Theme, currency and
          language live inside the menu so the bar stays uncluttered. */}
      <div className="md:hidden flex justify-between items-center w-full h-full">
        <Link
          to="/"
          onClick={resetFilters}
          aria-label={t("common.homeLabel")}
          className="flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand-primary)"
        >
          <Logo size={38} />
        </Link>

        <div className="flex items-center gap-1 -mr-2">
          <button
            onClick={onCartClick}
            aria-label={t("nav.openCart")}
            className="relative flex size-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand-primary)"
          >
            <span className="material-symbols-rounded text-(--text-primary) dark:text-(--text-muted) text-2xl leading-none">
              shopping_bag
            </span>
            {totalQuantity > 0 && (
              <span className="absolute top-1.5 right-1 bg-(--badge-bg) dark:bg-(--badge-bg) text-gray-50 dark:text-gray-900 text-xs font-bold h-4 min-w-4 px-1 flex items-center justify-center rounded-full text-center">
                {totalQuantity}
              </span>
            )}
          </button>

          <button
            ref={mobileMenuButtonRef}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label={
              user
                ? t("nav.accountMenu")
                : isMobileMenuOpen
                  ? t("nav.closeMenu")
                  : t("nav.openMenu")
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="flex size-11 items-center justify-center rounded-full text-(--text-secondary) dark:text-(--text-muted) focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand-primary)"
          >
            {user ? (
              <span
                className={`flex size-[34px] items-center justify-center overflow-hidden rounded-full bg-gray-800 text-sm font-bold text-white transition-shadow ${
                  isMobileMenuOpen
                    ? "ring-2 ring-(--brand-primary) ring-offset-2 ring-offset-white dark:ring-offset-(--brand-bg-primary)"
                    : ""
                }`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  initial
                )}
              </span>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isMobileMenuOpen ? "close" : "menu"}
                  className="material-symbols-rounded text-2xl leading-none flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? "close" : "menu"}
                </motion.span>
              </AnimatePresence>
            )}
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
          {/* 280px, grows to 380px while focused (max-w-full keeps it from overflowing on narrow screens) */}
          <div className="relative w-[280px] focus-within:w-[380px] max-w-full transition-all duration-300">
            <span className="material-symbols-rounded absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder={t("nav.searchPlaceholder")}
              value={searchQuery}
              // onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              onChange={(e) => updateSearch(e.target.value)}
              className="border-2 border-transparent placeholder-gray-500 dark:text-(--text-primary) focus:border-(--brand) outline-none py-[11px] pl-12 pr-10 w-full rounded-4xl transition-colors duration-300 ease-in bg-(--bg-secondary) dark:bg-(--brand-bg-secondary) hover:bg-(--bg-secondary-hover) dark:hover:bg-(--brand-bg-secondary-hover)"
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

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ top: "var(--nav-height, 76px)" }}
            className="fixed left-0 w-full md:hidden z-[999] max-h-[calc(100dvh-var(--nav-height,76px))] overflow-y-auto border-b border-(--border-primary) bg-white dark:bg-(--brand-bg-primary) shadow-[0_12px_24px_rgba(17,24,39,0.08)]"
          >
            <div className="flex flex-col gap-3.5 px-4 pt-3.5 pb-3">
              {/* Account card */}
              {user && (
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-2xl bg-(--bg-secondary) dark:bg-(--brand-bg-secondary) px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-800 text-[17px] font-bold text-white">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      initial
                    )}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-semibold text-(--text-primary) dark:text-white">
                      {accountName}
                    </span>
                    <span className="text-sm text-(--text-muted) dark:text-gray-400">
                      {t("nav.viewProfile")}
                    </span>
                  </span>
                  <ChevronRight
                    size={18}
                    className="shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                </Link>
              )}

              {(user?.role === "partner" || user?.role === "courier") && (
                <Link
                  to={
                    user.role === "partner"
                      ? "/partner-dashboard"
                      : "/courier-dashboard"
                  }
                  onClick={closeMobileMenu}
                  className="flex h-12 items-center justify-between rounded-xl border border-(--border-primary) px-3.5 text-[15px] text-(--text-primary) dark:text-white"
                >
                  {user.role === "partner"
                    ? t("nav.partnerDashboard")
                    : t("nav.courierDashboard")}
                  <ChevronRight
                    size={18}
                    className="text-gray-400"
                    aria-hidden="true"
                  />
                </Link>
              )}

              {/* Search */}
              <div className="relative">
                <span
                  className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  aria-hidden="true"
                >
                  search
                </span>
                <input
                  type="text"
                  aria-label={t("nav.searchPlaceholder")}
                  placeholder={t("nav.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => updateSearch(e.target.value)}
                  className="w-full border-2 border-transparent focus:border-(--brand) outline-none text-(--text-primary) dark:text-(--text-primary) placeholder-gray-500 py-[11px] pl-12 pr-10 rounded-4xl bg-(--bg-secondary) dark:bg-(--brand-bg-secondary) transition-colors duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={() => updateSearch("")}
                    className="absolute right-3 top-0 bottom-0 my-auto flex items-center justify-center text-gray-400 hover:text-gray-500 cursor-pointer"
                    aria-label={t("nav.clearSearch")}
                  >
                    <span className="material-symbols-rounded text-xl">
                      close
                    </span>
                  </button>
                )}
              </div>

              {/* Log in / Sign up */}
              {!user && !loading && (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleLoginClick}
                    className="h-[46px] rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-transparent text-[15px] font-semibold text-(--text-primary) dark:text-white cursor-pointer hover:bg-(--bg-secondary) dark:hover:bg-(--brand-bg-secondary) transition-colors"
                  >
                    {t("nav.logIn")}
                  </button>
                  <button
                    onClick={handleSignupClick}
                    className="h-[46px] rounded-xl bg-(--brand-primary) text-[15px] font-semibold text-gray-900 cursor-pointer hover:brightness-95 transition"
                  >
                    {t("nav.signUp")}
                  </button>
                </div>
              )}

              <div className="h-px bg-(--border-primary)" />

              <MobilePreferences />

              {user && (
                <button
                  onClick={handleLogout}
                  className="flex h-13 w-full items-center gap-3.5 border-t border-(--border-primary) px-1 text-left text-[15px] font-semibold text-red-700 dark:text-red-400 cursor-pointer"
                >
                  <LogOut size={20} aria-hidden="true" />
                  {t("nav.logOut")}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

import { useNavigate, useParams } from "react-router-dom";
import MenuCard from "../components/restaurants/MenuCard";
import { useCartOpen } from "../contexts/CartOpenContext";
import { useCart } from "../contexts/CartContext";
import { useEffect, useMemo, useRef, useState } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";
import SkeletonImage from "../ui/SkeletonImage";
import { useRestaurantsQuery } from "../hooks/useRestaurantsQuery";
import toast from "react-hot-toast";
import { useCurrency } from "../contexts/CurrencyContext";
import { isRestaurantOpen } from "../lib/isRestaurantOpen";
import { formatHour } from "../lib/formatHour";
import { MAX_ITEM_QTY, MIN_ORDER_PRICE } from "../helpers/cartTotals";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../lib/cn";
import MenuItemModal from "../modals/MenuItemModal";
import { useTranslation } from "react-i18next";


export default function RestaurantMenuPage() {
  /* =======================
     STATE & CONTEXT
  ======================= */
  const params = useParams();
  const { t } = useTranslation();
  const { slug, itemSlug } = params;

  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [openItemSlug, setOpenItemSlug] = useState(itemSlug);
  const [hoveredTabRect, setHoveredTabRect] = useState(null);
  const [activeTabRect, setActiveTabRect] = useState(null);
  const [tabsContainerRect, setTabsContainerRect] = useState({ left: 0 });
  const [navHeight, setNavHeight] = useState(0);

  const tabsContainerRef = useRef(null);

  const [lastHoveredRect, setLastHoveredRect] = useState(null);

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredTabRect(rect);
    setLastHoveredRect(rect);
  };

  const handleMouseLeave = () => {
    setHoveredTabRect(null); // fade out, but keep last rect alive
  };

  const { isCartOpen } = useCartOpen();
  const { addToCart, cartItems, restaurantId: cartRestaurantId } = useCart();
  const navigate = useNavigate();
  const { data: restaurants = [], isLoading } = useRestaurantsQuery();
  const { formatCurrency } = useCurrency();

  const categoryRefs = useRef({});
  const tabsTriggerRef = useRef(null);
  const [tabsSticky, setTabsSticky] = useState(false);

  const restaurant = restaurants.find((r) => r.slug === slug);

  useEffect(() => {
    setOpenItemSlug(itemSlug);
  }, [itemSlug]);

  /* =======================
     HELPERS
  ======================= */
  // isRestaurantOpen comes from helpers/ (handles minutes and overnight hours,
  // e.g. 16:00–08:00), the same check the hero board and restaurant cards use.

  /* =======================
     EFFECTS (UNCONDITIONAL)
  ======================= */

  // Menu filtering (SAFE)
  const menuFilteredBySearch = useMemo(() => {
    if (!restaurant?.menu) return {};

    return Object.entries(restaurant.menu).reduce((acc, [category, items]) => {
      if (!Array.isArray(items)) return acc;

      const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(menuSearchQuery.toLowerCase()),
      );

      if (filteredItems.length) acc[category] = filteredItems;
      return acc;
    }, {});
  }, [restaurant, menuSearchQuery]);

  const categories = Object.keys(menuFilteredBySearch);

  const activeMenuItem = useMemo(() => {
    if (!openItemSlug || !restaurant?.menu) return null;

    for (const items of Object.values(restaurant.menu)) {
      const found = items.find((item) => item.slug === openItemSlug);
      if (found) return found;
    }
    return null;
  }, [openItemSlug, restaurant]);

  useEffect(() => {
    if (!menuSearchQuery && categories.length && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [menuSearchQuery, categories, activeCategory]);

  // const navHeight =
  //   Number(
  //     getComputedStyle(document.documentElement)
  //       .getPropertyValue("--nav-height")
  //       .replace("px", ""),
  //   ) || 0;

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--nav-height")
      .replace("px", "");

    setNavHeight(Number(value) || 0);
  }, []);

  // Measure container once
  useEffect(() => {
    if (!tabsContainerRef.current) return;

    const rect = tabsContainerRef.current.getBoundingClientRect();

    setTabsContainerRect((prev) => {
      if (
        prev &&
        Math.round(prev.left) === Math.round(rect.left) &&
        Math.round(prev.top) === Math.round(rect.top) &&
        Math.round(prev.width) === Math.round(rect.width) &&
        Math.round(prev.height) === Math.round(rect.height)
      ) {
        return prev; // no change → prevent re-render loop
      }
      return rect;
    });
  }, [categories]);

  // Measure active tab safely
  useEffect(() => {
    if (!tabsContainerRef.current || !activeCategory) return;

    const activeButton = tabsContainerRef.current.querySelector(
      `button[data-category="${activeCategory}"]`,
    );

    if (!activeButton) return;

    const tabRect = activeButton.getBoundingClientRect();
    const containerRect = tabsContainerRef.current.getBoundingClientRect();

    const newRect = {
      left: tabRect.left - containerRect.left,
      top: tabRect.top - containerRect.top,
      width: tabRect.width,
      height: tabRect.height,
    };

    setActiveTabRect((prev) => {
      if (
        prev &&
        Math.round(prev.left) === Math.round(newRect.left) &&
        Math.round(prev.top) === Math.round(newRect.top) &&
        Math.round(prev.width) === Math.round(newRect.width) &&
        Math.round(prev.height) === Math.round(newRect.height)
      ) {
        return prev; // no change → skip re-render
      }
      return newRect;
    });
  }, [activeCategory]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => setTabsSticky(!entry.isIntersecting),
  //     { rootMargin: `-${navHeight}px 0px 0px 0px`, threshold: 0 },
  //   );

  //   if (tabsTriggerRef.current) observer.observe(tabsTriggerRef.current);

  //   return () => observer.disconnect();
  // }, [navHeight]);

  useEffect(() => {
    const trigger = tabsTriggerRef.current;
    if (!trigger || navHeight === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setTabsSticky(!entry.isIntersecting);
      },
      {
        rootMargin: `-${navHeight}px 0px 0px 0px`,
        threshold: 0,
      },
    );

    observer.observe(trigger);

    return () => observer.disconnect();
  }, [navHeight, tabsTriggerRef.current]);

  // Closed restaurant toast
  useEffect(() => {
    if (!restaurant) return;

    if (!isRestaurantOpen(restaurant.hours)) {
      toast(t("menuPage.closedToast"), {
        position: "bottom-center",
        className:
          "bg-white text-red-900 border border-gray-400 rounded-lg whitespace-nowrap",
        duration: 5000,
      });
    }
    // only when the restaurant loads, not again on a language switch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant]);

  /* =======================
     GUARDS (AFTER HOOKS)
  ======================= */
  if (isLoading) return <LoadingSpinner />;

  if (!restaurant) {
    return <p className="text-white p-6">{t("menuPage.notFound")}</p>;
  }

  /* =======================
     SAFE DESTRUCTURING
  ======================= */
  const {
    name,
    bannerImage,
    logo,
    rating,
    deliveryTime,
    hours,
    restaurantId,
    partnerId,
  } = restaurant;

  const isOpen = isRestaurantOpen(hours);
  const opensAt = formatHour(hours?.open);
  const closesAt = formatHour(hours?.close);

  const infoTile =
    "flex flex-col gap-0.5 bg-(--restaurant-card-bg)/90 px-4 py-2.5 md:px-5 md:py-3";
  const infoLabel = "text-xs md:text-[13px] font-semibold text-slate-400";
  const infoValueBase =
    "m-0 flex items-center gap-1.5 whitespace-nowrap text-[15px] md:text-base font-bold";
  const infoValue = `${infoValueBase} text-white`;

  const fallbackBanner = "https://via.placeholder.com/1200x400?text=No+Image";
  const fallbackLogo = "https://via.placeholder.com/150?text=No+Logo";

  /* =======================
     RENDER
  ======================= */
  return (
    <>
      {/* Header */}
      <div className="relative w-full h-96">
        <SkeletonImage
          src={bannerImage || fallbackBanner}
          alt={t("menuPage.bannerAlt", { name })}
          className="h-96 w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <button
          onClick={() => navigate("/explore")}
          aria-label={t("menuPage.back")}
          className="absolute top-4 left-4 z-10 
             w-12 h-12 rounded-full 
             bg-black/50 text-white 
             flex items-center justify-center"
        >
          <span className="material-symbols-rounded text-3xl leading-none">
            arrow_back
          </span>
        </button>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row gap-4">
            <div className="hidden md:block">
              <img
                src={logo || fallbackLogo}
                className="w-32 h-32 rounded-lg border-2 border-white"
                alt={name}
              />
            </div>
            {/* RESTAURANT INFO */}
            <div className="flex flex-col gap-2 w-fit">
              <div className="flex items-center gap-4 md:hidden">
                <img
                  src={logo || fallbackLogo}
                  className="w-20 h-20 rounded-lg border-2 border-white"
                  alt={name}
                />
                <h1 className="text-white text-2xl font-bold">{name}</h1>
              </div>

              <h1 className="hidden md:block text-white text-3xl font-bold">
                {name}
              </h1>

              {/* Info board: labelled tiles in the same style as the hero's departure board.
                  gap-px over a faint background draws the dividers, in the 2x2 grid on phones
                  and in the single row on wider screens. */}
              <dl className="m-0 grid grid-cols-2 sm:flex sm:w-fit gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 shadow-xl backdrop-blur-md">
                <div className={infoTile}>
                  <dt className={infoLabel}>{t("menuPage.rating")}</dt>
                  <dd className={infoValue}>
                    <span className="text-(--brand-primary)" aria-hidden="true">
                      ★
                    </span>
                    {rating ?? "–"}
                  </dd>
                </div>

                <div className={infoTile}>
                  <dt className={infoLabel}>
                    {isOpen ? t("menuPage.openNow") : t("common.closed")}
                  </dt>
                  <dd className={infoValue}>
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 shrink-0 rounded-full ${isOpen ? "bg-green-400 shadow-[0_0_0_4px_rgba(74,222,128,0.18)]" : "bg-slate-500"}`}
                    />
                    {isOpen
                      ? closesAt && t("menuPage.until", { time: closesAt })
                      : opensAt
                        ? t("menuPage.opens", { time: opensAt })
                        : t("menuPage.hoursUnavailable")}
                  </dd>
                </div>

                <div className={infoTile}>
                  <dt className={infoLabel}>{t("menuPage.minOrder")}</dt>
                  <dd className={infoValue}>
                    {formatCurrency(MIN_ORDER_PRICE)}
                  </dd>
                </div>

                <div className={infoTile}>
                  <dt className={infoLabel}>{t("menuPage.delivery")}</dt>
                  <dd className={`${infoValueBase} text-(--brand-primary)`}>
                    {deliveryTime ?? "–"}
                    <span className="text-sm font-semibold text-slate-400">
                      {t("common.min")}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Trigger for IntersectionObserver */}
      <div ref={tabsTriggerRef} />
      {/* DESKTOP STICKY TABS */}
      <div>
        {!menuSearchQuery && categories.length > 0 && (
          <div
            className={`hidden md:block z-40 transition-all duration-300 ${
              tabsSticky
                ? "fixed top-18 left-0 right-0 bg-gray-50/90 dark:bg-(--brand-bg-primary)/90 backdrop-blur"
                : "relative bg-transparent"
            }`}
          >
            <div className="max-w-[1500px] mx-auto px-4 py-3">
              <div className="flex justify-center">
                {/* <div className="relative flex gap-3 rounded-full px-3 py-2 transition-colors duration-300 bg-gray-200/70 dark:bg-gray-800/70 backdrop-blur">
                  {categories.map((category) => {
                    const isActive = activeCategory === category;

                    return (
                      <button
                        key={category}
                        onMouseEnter={() => setHoveredTab(category)}
                        onMouseLeave={() => setHoveredTab(null)}
                        onClick={() => {
                          setActiveCategory(category);
                          categoryRefs.current[category]?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                        className="relative px-4 py-2 text-md font-medium rounded-full"
                      >
                        <AnimatePresence>
                          {isActive && (
                            <motion.span
                              layoutId="activeTab"
                              className="absolute inset-0 rounded-full bg-amber-400"
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 35,
                              }}
                            />
                          )}
                        </AnimatePresence>

                        <motion.span
                          className={`relative z-10 ${
                            isActive
                              ? "text-black"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.15 }}
                        >
                          {category}
                        </motion.span>
                      </button>
                    );
                  })}
                </div> */}
                <div
                  ref={tabsContainerRef}
                  className="relative flex gap-3 rounded-full px-3 py-2 transition-colors duration-300 bg-gray-200/70 dark:bg-gray-800/70 backdrop-blur"
                >
                  {/* ACTIVE pill */}
                  {activeTabRect && (
                    <motion.div
                      className="absolute rounded-full bg-amber-400 z-10"
                      style={{
                        left: activeTabRect.left,
                        top: activeTabRect.top,
                        width: activeTabRect.width,
                        height: activeTabRect.height,
                      }}
                      layoutId="activeTab"
                      transition={{
                        type: "spring",
                        stiffness: 1000, // 🔥 faster snap
                        damping: 30,
                        mass: 0.3,
                      }}
                    />
                  )}

                  <motion.div
                    className="absolute rounded-full bg-gray-400/30 dark:bg-gray-600/50 z-0"
                    animate={{
                      left: hoveredTabRect?.left ?? lastHoveredRect?.left ?? 0,
                      top: hoveredTabRect?.top ?? lastHoveredRect?.top ?? 0,
                      width:
                        hoveredTabRect?.width ?? lastHoveredRect?.width ?? 0,
                      height:
                        hoveredTabRect?.height ?? lastHoveredRect?.height ?? 0,
                      opacity: hoveredTabRect ? 1 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 40,
                    }}
                  />

                  {/* Buttons */}
                  {categories.map((category) => {
                    const isActive = activeCategory === category;
                    return (
                      <button
                        key={category}
                        data-category={category}
                        onMouseEnter={(e) => {
                          if (!tabsContainerRef.current) return;
                          if (activeCategory === category) return;

                          const tabRect =
                            e.currentTarget.getBoundingClientRect();
                          const containerRect =
                            tabsContainerRef.current.getBoundingClientRect();

                          const relativeRect = {
                            left: tabRect.left - containerRect.left,
                            top: tabRect.top - containerRect.top,
                            width: tabRect.width,
                            height: tabRect.height,
                          };

                          setHoveredTabRect(relativeRect);
                          setLastHoveredRect(relativeRect);
                        }}
                        onMouseLeave={() => {
                          if (activeCategory !== category) {
                            setHoveredTabRect(null);
                          }
                        }}
                        onClick={() => {
                          setActiveCategory(category);
                          categoryRefs.current[category]?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                        className={`relative px-4 py-2 text-md font-medium rounded-full z-10 ${
                          isActive
                            ? "text-black"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="bg-gray-100 dark:bg-(--bg-main) min-h-screen px-4 py-6">
        <div className="max-w-[1500px] mx-auto">
          {/* Desktop Tabs */}

          {/* Search */}
          <div className="flex justify-end mb-4">
            <input
              value={menuSearchQuery}
              onChange={(e) => setMenuSearchQuery(e.target.value)}
              placeholder={t("menuPage.searchPlaceholder", { name })}
              className="w-full md:w-80 px-5 py-3 rounded-full placeholder:text-gray-500 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-(--brand-primary) caret-gray-400"
            />
          </div>

          {/* Mobile Tabs */}
          {!menuSearchQuery && categories.length > 0 && (
            <div className="md:hidden sticky top-0 z-30 -mx-4 px-4 py-3 bg-gray-100 dark:bg-(--bg-main)">
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      activeCategory === category
                        ? "bg-amber-400 text-black"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MOBILE: active category only */}
          <div className="md:hidden mt-6">
            {activeCategory && menuFilteredBySearch[activeCategory] && (
              <>
                <h3 className="text-2xl font-semibold mb-4">
                  {activeCategory}
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  {menuFilteredBySearch[activeCategory].map((item) => (
                    <MenuCard
                      key={item.id}
                      {...item}
                      cartIsOpen={isCartOpen}
                      restaurantId={restaurantId}
                      partnerId={partnerId}
                      onClick={() =>
                        navigate(`/restaurant/${slug}/item/${item.slug}`)
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* DESKTOP: all categories */}
          <div className="hidden md:flex flex-col gap-10 mt-6">
            {Object.entries(menuFilteredBySearch).map(([category, items]) => (
              <section
                key={category}
                ref={(el) => (categoryRefs.current[category] = el)}
                className="scroll-mt-48"
              >
                <h3 className="text-(--text-secondary) dark:text-(--text-secondary) text-2xl font-semibold mb-4">
                  {category}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {items.map((item) => (
                    <MenuCard
                      key={item.id}
                      {...item}
                      cartIsOpen={isCartOpen}
                      restaurantId={restaurantId}
                      partnerId={partnerId}
                      onClick={() => {
                        navigate(`/restaurant/${slug}/item/${item.slug}`);
                        setOpenItemSlug(item.slug);
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      {activeMenuItem && (
        <MenuItemModal
          key={activeMenuItem.slug} // 🔑 ensures re-render
          item={activeMenuItem}
          isOpen={!!activeMenuItem}
          onClose={() => {
            navigate(`/restaurant/${slug}`);
            setOpenItemSlug(null);
          }}
          onAddToCart={({ quantity, extras = [] }) => {
            const item = activeMenuItem;

            // addToCart() sets an item's quantity rather than adding to it (that's how
            // the card's +/- buttons use it), so add the modal's quantity to what's
            // already in the cart.
            const inCart = cartItems.find((i) => i.id === item.id);
            const newQty = Math.min(
              (inCart?.quantity ?? 0) + quantity,
              MAX_ITEM_QTY,
            );
            const extrasTotal = extras.reduce(
              (sum, e) => sum + (e.price ?? 0),
              0,
            );

            // Same shape MenuCard sends, so the drawer and checkout treat both alike.
            addToCart(
              {
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price + extrasTotal,
                quantity: newQty,
                restaurantId,
                partnerId,
                ...(extras.length > 0 && { extras }),
              },
              restaurantId,
              partnerId,
            );

            // Only confirm when it really went in: for another restaurant, addToCart()
            // refuses and shows the "one restaurant at a time" pop-up instead.
            const blocked =
              cartItems.length > 0 &&
              cartRestaurantId &&
              cartRestaurantId !== restaurantId;
            if (!blocked) {
              toast.success(t("menuPage.added", { name: item.name }), {
                position: "bottom-center",
              });
            }
          }}
        />
      )}
    </>
  );
}

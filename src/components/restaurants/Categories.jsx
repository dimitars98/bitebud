import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CategoryItem from "./CategoryItem";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { hasCategory } from "../../helpers/hasCategory";

const categories = [
  {
    id: 1,
    name: "Pizza",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    name: "Burger",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=160&q=60",
  },
  {
    id: 3,
    name: "Sushi",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=160&q=60",
  },
  {
    id: 4,
    name: "Salad",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=160&q=60",
  },
  {
    id: 5,
    name: "Dessert",
    image:
      "https://images.unsplash.com/photo-1543255006-d6395b6f1171?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    name: "Drinks",
    image:
      "https://images.unsplash.com/photo-1617108126666-3b4f0251913a?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    name: "BBQ",
    image:
      "https://images.unsplash.com/photo-1616252980327-ec70572e5df9?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    name: "Mexican",
    image:
      "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 9,
    name: "Healthy",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=160&q=60",
  },
  {
    id: 10,
    name: "Pasta",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=160&q=60",
  },
  {
    id: 11,
    name: "Asian",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 12,
    name: "Turkish",
    image:
      "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 13,
    name: "Arabic",
    image:
      "https://images.unsplash.com/photo-1697126248437-db26a30024c5?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 14,
    name: "Vegan",
    image:
      "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 15,
    name: "Vegetarian",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=160&q=60",
  },
  {
    id: 16,
    name: "Chinese",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 17,
    name: "Macedonian",
    image:
      "https://images.unsplash.com/photo-1740591872073-e0e627756b90?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 18,
    name: "Greek",
    image:
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 19,
    name: "Mediterranean",
    image:
      "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=160&q=60",
  },
  {
    id: 20,
    name: "Fish",
    image:
      "https://images.unsplash.com/photo-1600699899970-b1c9fadd8f9e?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 21,
    name: "Bakery",
    image:
      "https://images.unsplash.com/photo-1621939650348-2a4139949c7a?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 22,
    name: "Sandwiches",
    image:
      "https://images.unsplash.com/photo-1655279562015-047c3da9a271?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 23,
    name: "Home Cooking",
    image:
      "https://images.unsplash.com/photo-1603496987674-79600a000f55?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 24,
    name: "Tortilla Wraps",
    image:
      "https://images.unsplash.com/photo-1562059390-a761a084768e?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 25,
    name: "Ice Cream",
    image:
      "https://images.unsplash.com/photo-1588195539297-f0b4efdb5472?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 26,
    name: "Cakes",
    image:
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=60&w=160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Categories({ restaurants = [] }) {
  const scrollRef = useRef(null);
  const { t } = useTranslation();

  // Category filter is stored in the URL (see Home.jsx). Toggling replaces the
  // history entry so flipping between categories doesn't flood the Back button.
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  // Only touches ?category=, so other params (like ?sort=) are kept.
  const selectCategory = (categoryName) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!categoryName || activeCategory === categoryName) {
          next.delete("category");
        } else {
          next.set("category", categoryName);
        }
        return next;
      },
      { replace: true },
    );
  };

  // How many restaurants each category has (same rule as the Explore filter).
  const counts = useMemo(() => {
    const map = {};
    for (const { name } of categories) {
      map[name] = restaurants.filter((r) => hasCategory(r, name)).length;
    }
    return map;
  }, [restaurants]);

  const placesLabel = (count) =>
    count === 0 ? t("categories.noneYet") : t("categories.places", { count });

  const activeLabel = activeCategory
    ? t(`categories.names.${activeCategory}`, { defaultValue: activeCategory })
    : null;

  // Arrows switch off at either end, and hide when nothing overflows.
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateArrows]);

  // When arriving with ?category=… (e.g. from the landing page), bring it into view.
  useEffect(() => {
    if (!activeCategory) return;
    scrollRef.current
      ?.querySelector(`[data-category="${CSS.escape(activeCategory)}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center" });
    // only on mount: don't jump around while the user is clicking
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const hasOverflow = canScroll.left || canScroll.right;

  const arrowClass =
    "flex w-10 h-10 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-(--brand-bg-secondary) text-(--text-primary) dark:text-white cursor-pointer transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-default disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand)";

  return (
    <section className="relative max-w-[1500px] md:mx-auto mx-3 mt-4 rounded-2xl bg-(--bg-secondary) dark:bg-(--brand-bg-primary) pt-5 pb-3 sm:pt-6">
      <div className="flex items-end justify-between gap-4 px-4 sm:px-7">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-(--text-primary) dark:text-white">
            {t("categories.heading")}
          </h2>
          <p className="hidden sm:block text-sm text-(--text-muted) dark:text-gray-300">
            {t("categories.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {activeCategory && (
            <button
              onClick={() => selectCategory(null)}
              aria-label={t("categories.clearFilter", { name: activeLabel })}
              className="flex items-center gap-2 h-9 pl-3.5 pr-3 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200 text-sm font-bold cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-400/25"
            >
              <span>
                {activeLabel}
                <span className="hidden sm:inline">
                  {" · "}
                  {placesLabel(counts[activeCategory] ?? 0)}
                </span>
              </span>
              <X size={14} strokeWidth={2.5} aria-hidden="true" />
            </button>
          )}

          {hasOverflow && (
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScroll.left}
                className={arrowClass}
                aria-label={t("categories.scrollLeft")}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScroll.right}
                className={arrowClass}
                aria-label={t("categories.scrollRight")}
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          role="group"
          aria-label={t("categories.heading")}
          className="flex gap-3.5 sm:gap-5 overflow-x-auto scrollbar-hide snap-x scroll-px-4 sm:scroll-px-7 px-4 sm:px-7 pt-4 pb-2"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          <CategoryItem
            isAll
            name={t("categories.all")}
            countLabel={placesLabel(restaurants.length)}
            isActive={!activeCategory}
            onClick={() => selectCategory(null)}
          />
          {categories.map(({ id, name, image }) => (
            <CategoryItem
              key={id}
              categoryKey={name}
              // `name` stays English for filtering; only the label is translated
              name={t(`categories.names.${name}`, { defaultValue: name })}
              image={image}
              countLabel={placesLabel(counts[name])}
              isActive={activeCategory === name}
              // empty categories stay visible but can't be picked
              // (unless it's the active one, so it can still be turned off)
              disabled={counts[name] === 0 && activeCategory !== name}
              onClick={() => selectCategory(name)}
            />
          ))}
        </div>

        {/* Edge fades hint that the row scrolls */}
        {canScroll.left && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-linear-to-r from-(--bg-secondary) dark:from-(--brand-bg-primary) to-transparent"
          />
        )}
        {canScroll.right && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 bg-linear-to-l from-(--bg-secondary) dark:from-(--brand-bg-primary) to-transparent"
          />
        )}
      </div>
    </section>
  );
}

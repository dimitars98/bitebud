import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useRestaurantsQuery } from "../../hooks/useRestaurantsQuery";
import { useTranslation } from "react-i18next";
import { hasCategory } from "../../helpers/hasCategory";

// `filter` must match a value in a restaurant's comma-separated `categories`
// (the same matching Explore uses for its category filter). `key` is the
// translation key under carousel.titles.
const CATEGORIES = [
  {
    key: "burgers",
    filter: "Burger",
    img: "/assets/categories/burgers.webp",
    plate: "bg-amber-100",
  },
  {
    key: "pizza",
    filter: "Pizza",
    img: "/assets/categories/pizza.webp",
    plate: "bg-orange-100",
  },
  {
    key: "sushi",
    filter: "Sushi",
    img: "/assets/categories/sushi.webp",
    plate: "bg-rose-100",
  },
  {
    key: "salads",
    filter: "Salad",
    img: "/assets/categories/salads.webp",
    plate: "bg-lime-100",
  },
  {
    key: "soups",
    filter: "Soup",
    img: "/assets/categories/soups.webp",
    plate: "bg-yellow-100",
  },
];

function countFor(restaurants, filter) {
  return restaurants.filter((r) => hasCategory(r, filter)).length;
}

export default function CategoriesCarousel() {
  const scrollRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: restaurants = [], isLoading } = useRestaurantsQuery();

  const categories = useMemo(
    () =>
      CATEGORIES.map((c) => ({ ...c, count: countFor(restaurants, c.filter) })),
    [restaurants],
  );

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    const card = el?.querySelector("[data-card]");
    if (!el || !card) return;
    const step = card.offsetWidth + 24; // card + gap-6
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const openCategory = (filter) => {
    navigate(`/explore?category=${encodeURIComponent(filter)}`);
  };

  const arrowClass =
    "hidden md:flex items-center justify-center w-11 h-11 rounded-xl bg-(--bg-secondary) dark:bg-(--brand-bg-secondary) text-(--text-primary) hover:bg-(--bg-secondary-hover) dark:hover:bg-(--brand-bg-secondary-hover) disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-primary)";

  return (
    <section aria-labelledby="categories-heading" className="py-16 md:py-24">
      <div className="max-w-[1500px] mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-8 md:mb-10">
          <div>
            <h2
              id="categories-heading"
              className="text-3xl md:text-4xl font-extrabold text-(--text-primary)"
            >
              {t("carousel.heading")}
            </h2>
            <p className="mt-2 text-(--text-muted) text-base md:text-lg">
              {t("carousel.sub")}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              aria-label={t("carousel.prev")}
              onClick={() => scroll("left")}
              disabled={edges.start}
              className={arrowClass}
            >
              <span className="material-symbols-rounded" aria-hidden="true">
                chevron_left
              </span>
            </button>
            <button
              type="button"
              aria-label={t("carousel.next")}
              onClick={() => scroll("right")}
              disabled={edges.end}
              className={arrowClass}
            >
              <span className="material-symbols-rounded" aria-hidden="true">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        {/* Cards */}
        <ul
          ref={scrollRef}
          onScroll={updateEdges}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pt-10 pb-4"
        >
          {categories.map((c, i) => {
            const empty = !isLoading && c.count === 0;
            return (
              <motion.li
                key={c.key}
                data-card
                className="snap-start shrink-0 w-[72%] sm:w-64 lg:w-[272px]"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.07,
                  ease: "easeOut",
                }}
              >
                <button
                  type="button"
                  disabled={empty}
                  onClick={() => openCategory(c.filter)}
                  className="group relative flex flex-col w-full h-[340px] text-left rounded-2xl bg-white dark:bg-(--brand-bg-secondary) border border-(--border-primary) dark:border-(--border-secondary) shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:cursor-default disabled:hover:translate-y-0 disabled:hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-primary)/60"
                >
                  {/* number tile, same language as the hero board */}
                  <span
                    aria-hidden="true"
                    className="absolute left-4 top-4 z-10 flex items-center justify-center w-9 h-11 rounded-lg bg-(--restaurant-card-bg) text-(--brand-primary) font-black text-lg"
                  >
                    {String(i + 1).padStart(2, "0")}
                    <span className="absolute inset-x-0 top-1/2 h-px bg-black/60" />
                  </span>

                  {/* plate + food breaking out of the card */}
                  <div className="relative flex-1">
                    <span
                      aria-hidden="true"
                      className={`absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full ${c.plate} dark:bg-(--brand-bg-secondary-hover) transition-transform duration-500 ${empty ? "" : "group-hover:scale-110"}`}
                    />
                    <img
                      src={c.img}
                      alt=""
                      loading="lazy"
                      className={`absolute left-1/2 -top-9 -translate-x-1/2 w-40 h-44 object-contain drop-shadow-[0_18px_18px_rgba(0,0,0,0.22)] transition-[translate,rotate,scale] duration-500 ease-out ${empty ? "grayscale opacity-60" : "group-hover:-translate-y-2 group-hover:-rotate-6 group-hover:scale-105"}`}
                    />
                  </div>

                  {/* label */}
                  <div className="flex items-end justify-between gap-3 px-5 pb-5">
                    <div>
                      <h3 className="text-2xl font-extrabold text-(--text-primary)">
                        {t(`carousel.titles.${c.key}`)}
                      </h3>
                      <p className="mt-0.5 text-sm font-semibold text-(--text-muted)">
                        {isLoading ? (
                          <span className="inline-block w-20 h-4 rounded bg-(--bg-secondary) dark:bg-(--brand-bg-secondary-hover) animate-pulse align-middle" />
                        ) : empty ? (
                          t("carousel.comingSoon")
                        ) : (
                          t("carousel.kitchens", { count: c.count })
                        )}
                      </p>
                    </div>
                    {!empty && (
                      <span
                        aria-hidden="true"
                        className="flex items-center justify-center w-11 h-11 rounded-full bg-(--brand-primary) text-(--restaurant-card-bg) transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <span className="material-symbols-rounded">
                          arrow_forward
                        </span>
                      </span>
                    )}
                  </div>
                </button>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

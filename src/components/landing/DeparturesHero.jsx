import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { isRestaurantOpen } from "../../lib/isRestaurantOpen";
import { useTranslation } from "react-i18next";

// Labels come from hero.status.<key> in the locale files.
const STATUS_STYLES = {
  boarding: { color: "text-(--brand-primary)", dot: "bg-(--brand-primary)" },
  ontime: { color: "text-green-400", dot: "bg-green-400" },
  closed: { color: "text-slate-400", dot: "bg-slate-500" },
};

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function FlapRow({ word, rowIndex, reduceMotion, tileClass }) {
  return (
    <span aria-hidden="true" className="flex gap-1 sm:gap-1.5">
      {word.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i} className={tileClass} />
        ) : (
          <motion.span
            key={i}
            initial={reduceMotion ? false : { rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.15 + (rowIndex * 6 + i) * 0.05, ease: "easeOut" }}
            style={{ transformOrigin: "50% 0%" }}
            className={`${tileClass} relative flex items-center justify-center rounded-lg lg:rounded-xl bg-(--brand-bg-secondary,#1e293b) font-black leading-none text-(--brand-primary)`}
          >
            {ch}
            <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-(--restaurant-card-bg)" />
          </motion.span>
        )
      )}
    </span>
  );
}

export default function DeparturesHero({ restaurants = [], loading = false }) {
  const reduceMotion = useReducedMotion();
  const clock = useClock();
  const { t, i18n } = useTranslation();
  // The split-flap words are translated too; each language has its own line breaks.
  const rowsDesktop = t("hero.rowsDesktop", { returnObjects: true });
  const rowsMobile = t("hero.rowsMobile", { returnObjects: true });

  // Open restaurants first, best rated first. The top one is "boarding".
  const departures = useMemo(() => {
    return [...restaurants]
      .map((r) => ({ ...r, open: isRestaurantOpen(r.hours) }))
      .sort((a, b) => Number(b.open) - Number(a.open) || (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 3)
      .map((r, i) => ({
        ...r,
        status: !r.open ? "closed" : i === 0 ? "boarding" : "ontime",
      }));
  }, [restaurants]);

  const tileDesktop = "w-11 h-16 text-5xl md:w-[52px] md:h-[74px] md:text-[52px] lg:w-[62px] lg:h-[86px] lg:text-6xl";
  const tileMobile = "w-10 h-14 text-[44px]";

  return (
    <section
      aria-label="Hero"
      className="relative mx-4 md:mx-6 2xl:mx-auto mt-5 max-w-[1500px] overflow-hidden rounded-2xl bg-(--restaurant-card-bg) dark:ring-1 dark:ring-white/10 lg:h-[680px]"
    >
      {/* warm glow behind the courier */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_80%_62%,rgba(251,191,36,0.14),transparent_70%)]"
      />

      <div className="relative z-10 flex flex-col gap-6 lg:gap-5 px-5 pt-6 sm:px-10 md:px-16 lg:w-[62%] lg:pt-10">
        {/* board header */}
        <div className="flex items-center justify-between border-b border-(--brand-bg-secondary,#1e293b) pb-3.5 text-[11px] font-extrabold tracking-[0.14em] text-slate-400 sm:text-[13px]">
          <span>
            {t("hero.board")}<span className="hidden sm:inline">{t("hero.route")}</span>
          </span>
          <span className="flex items-center gap-1.5 text-(--brand-primary)">
            <span className="material-symbols-rounded text-lg! leading-none" aria-hidden="true">
              schedule
            </span>
            <time>{clock}</time>
          </span>
        </div>

        {/* split-flap headline */}
        <h1 className="m-0 flex flex-col gap-1.5 sm:gap-2" style={{ perspective: 600 }}>
          <span className="sr-only">{t("hero.headline")}</span>
          {/* key on the language replays the flip animation when it changes */}
          <span key={`d-${i18n.resolvedLanguage}`} className="hidden flex-col gap-2 sm:flex">
            {rowsDesktop.map((w, r) => (
              <FlapRow key={w} word={w} rowIndex={r} reduceMotion={reduceMotion} tileClass={tileDesktop} />
            ))}
          </span>
          <span key={`m-${i18n.resolvedLanguage}`} className="flex flex-col gap-1.5 sm:hidden">
            {rowsMobile.map((w, r) => (
              <FlapRow key={w} word={w} rowIndex={r} reduceMotion={reduceMotion} tileClass={tileMobile} />
            ))}
          </span>
        </h1>

        <p className="m-0 max-w-[560px] text-base leading-relaxed text-slate-300 md:text-lg">
          {t("hero.intro")}
        </p>

        {/* departures board, live from Firestore */}
        <div role="table" aria-label={t("hero.departingNow")} className="w-full">
          <div
            role="row"
            className="grid grid-cols-[minmax(0,1fr)_72px_110px] gap-2 px-4 pb-2 text-[10px] font-extrabold tracking-[0.16em] text-slate-500 sm:grid-cols-[minmax(0,1fr)_100px_90px_130px] sm:text-[11px]"
          >
            <span role="columnheader">{t("hero.colRestaurant")}</span>
            <span role="columnheader">{t("hero.colEta")}</span>
            <span role="columnheader" className="hidden sm:block">{t("hero.colRating")}</span>
            <span role="columnheader">{t("hero.colStatus")}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {loading
              ? [0, 1, 2].map((i) => (
                  <div key={i} className="h-11 animate-pulse rounded-xl bg-(--brand-bg-secondary,#1e293b)" />
                ))
              : departures.map((r) => {
                  const s = STATUS_STYLES[r.status];
                  return (
                    <Link
                      key={r.id}
                      role="row"
                      to={`/restaurant/${r.slug}`}
                      className="grid h-11 grid-cols-[minmax(0,1fr)_72px_110px] items-center gap-2 rounded-xl bg-(--brand-bg-secondary,#1e293b) px-4 text-sm font-bold text-slate-100 transition-colors hover:bg-(--brand-bg-secondary-hover,#334155) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-primary) sm:grid-cols-[minmax(0,1fr)_100px_90px_130px] sm:text-[15px]"
                    >
                      <span role="cell" className="truncate">{r.name}</span>
                      <span role="cell" className="text-slate-300">{r.deliveryTime} {t("common.min")}</span>
                      <span role="cell" className="hidden items-center gap-1 text-slate-300 sm:flex">
                        <span className="text-(--brand-primary)">★</span>
                        {r.rating}
                      </span>
                      <span role="cell" className={`flex items-center gap-2 ${s.color}`}>
                        <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                        {t(`hero.status.${r.status}`)}
                      </span>
                    </Link>
                  );
                })}
          </div>
        </div>

        {/* boarding-pass CTA */}
        <div className="flex flex-col items-start gap-4 pb-2 sm:flex-row sm:items-center sm:gap-6">
          <Link
            to="explore"
            className="group flex h-14 items-stretch text-[17px] font-extrabold text-(--restaurant-card-bg) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-primary)/50 rounded-xl"
          >
            <span className="flex items-center rounded-l-xl bg-(--brand-primary) px-7 transition-colors group-hover:bg-(--brand)">
              {t("hero.orderNow")}
            </span>
            <span className="relative flex w-14 items-center justify-center rounded-r-xl border-l-2 border-dashed border-(--restaurant-card-bg) bg-(--brand-primary) transition-colors group-hover:bg-(--brand)">
              <span className="material-symbols-rounded transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                arrow_forward
              </span>
              <span aria-hidden="true" className="absolute -left-2 -top-[7px] h-3.5 w-3.5 rounded-full bg-(--restaurant-card-bg)" />
              <span aria-hidden="true" className="absolute -bottom-[7px] -left-2 h-3.5 w-3.5 rounded-full bg-(--restaurant-card-bg)" />
            </span>
          </Link>
          <Link
            to="explore"
            className="text-[15px] font-bold text-slate-200 underline underline-offset-[5px] hover:text-(--brand-primary)"
          >
            {t("hero.browseAll")}
          </Link>
        </div>
      </div>

      {/* gate sign */}
      <div
        aria-hidden="true"
        className="absolute right-[150px] top-6 z-10 hidden items-center gap-3 rounded-xl bg-(--brand-bg-secondary,#1e293b) py-2 pl-2.5 pr-4 text-[13px] font-extrabold tracking-[0.12em] text-slate-200 lg:flex"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-(--restaurant-card-bg) text-[22px] font-black tracking-normal text-(--brand-primary)">
          07
        </span>
        {t("hero.gate")}
      </div>

      {/* courier */}
      <motion.img
        src="/assets/courier-cutout.webp"
        alt={t("hero.courierAlt")}
        fetchPriority="high"
        initial={reduceMotion ? false : { opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        className="relative mb-3.5 ml-auto mr-4 mt-2 block h-64 w-auto sm:h-80 lg:absolute lg:bottom-3.5 lg:right-[4%] lg:m-0 lg:h-[560px]"
      />

      {/* platform edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3.5 bg-[repeating-linear-gradient(-45deg,var(--brand-primary)_0_16px,var(--restaurant-card-bg)_16px_32px)]"
      />

      <p className="absolute bottom-6 left-5 z-10 m-0 text-[11px] text-slate-500 lg:left-auto lg:right-4">
        {t("hero.imageBy")}{" "}
        <a href="https://www.freepik.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-(--brand-primary)">
          Freepik
        </a>
      </p>
    </section>
  );
}

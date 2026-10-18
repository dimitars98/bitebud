import { useState } from "react";
import { Link } from "react-router-dom";
import { isRestaurantOpen } from "../lib/isRestaurantOpen";
import { CARD_WIDTH, IMAGE_HEIGHT } from "../constants/sizes";
import { formatHour } from "../lib/formatHour";
import { useTranslation } from "react-i18next";

// Free delivery is the only bright tag, so it can never be mistaken for "Closed".
const TAG_STYLES = {
  "Free delivery": {
    icon: "local_shipping",
    className: "bg-(--brand-primary) text-(--restaurant-card-bg)",
  },
  Vegetarian: {
    icon: "eco",
    className: "bg-(--restaurant-card-bg)/85 text-lime-200 backdrop-blur-sm",
  },
  Vegan: {
    icon: "eco",
    className: "bg-(--restaurant-card-bg)/85 text-green-300 backdrop-blur-sm",
  },
};

function formatDistance(distance) {
  if (distance === undefined || distance === null) return null;
  if (distance < 1) return `${Math.round(distance * 1000)} m`;
  return `${distance.toFixed(1)} km`;
}

export default function RestaurantCard({
  slug,
  name,
  rating,
  logo,
  deliveryTime,
  distance,
  cuisine,
  tags = [],
  hours,
  className = "",
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { t } = useTranslation();

  // Same rule as the hero board. Restaurants without hours are treated as open,
  // as the card did before (the helper itself returns false for missing hours).
  const hasHours =
    typeof hours?.open === "number" && typeof hours?.close === "number";
  const open = hasHours ? isRestaurantOpen(hours) : true;

  const distanceLabel = formatDistance(distance);
  const meta = [cuisine, distanceLabel].filter(Boolean).join(" · ");
  const knownTags = (tags ?? []).filter((tag) => TAG_STYLES[tag]);

  return (
    <Link
      to={`/restaurant/${slug}`}
      state={{ name, rating, logo, deliveryTime }}
      aria-label={open ? name : t("card.closedAria", { name })}
      className={`group block rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand) ${CARD_WIDTH} ${className}`}
    >
      <article className="flex flex-col h-full overflow-hidden rounded-2xl bg-(--restaurant-card-bg) shadow-md dark:ring-1 dark:ring-white/5 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
        {/* Photo */}
        <div
          className={`relative overflow-hidden bg-(--brand-bg-secondary,#1e293b) ${IMAGE_HEIGHT}`}
        >
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-(--brand-bg-secondary-hover,#334155)" />
          )}
          <img
            src={logo}
            alt=""
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition duration-500 will-change-transform ${
              !imgLoaded
                ? "opacity-0"
                : open
                  ? "opacity-100 group-hover:scale-105"
                  : "opacity-55 grayscale"
            }`}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-(--restaurant-card-bg)/70 to-transparent"
          />

          {open ? (
            <>
              {deliveryTime != null && (
                <span className="absolute right-2.5 top-2.5 flex min-w-[46px] flex-col items-center rounded-[10px] bg-(--restaurant-card-bg) px-2 pb-1 pt-1.5 shadow-lg">
                  <span className="text-xl font-black leading-none text-(--brand-primary)">
                    {deliveryTime}
                  </span>
                  <span className="mt-0.5 text-[9px] font-extrabold tracking-[0.16em] text-slate-400">
                    {t("card.minShort")}
                  </span>
                </span>
              )}
              {knownTags.length > 0 && (
                <span className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap gap-1.5">
                  {knownTags.map((tag) => (
                    <span
                      key={tag}
                      className={`flex items-center gap-1 rounded-full py-1 pl-1.5 pr-2.5 text-xs font-extrabold ${TAG_STYLES[tag].className}`}
                    >
                      <span
                        className="material-symbols-rounded text-sm! leading-none"
                        aria-hidden="true"
                      >
                        {TAG_STYLES[tag].icon}
                      </span>
                      {t(`tags.${tag}`, { defaultValue: tag })}
                    </span>
                  ))}
                </span>
              )}
            </>
          ) : (
            <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-(--restaurant-card-bg)/90 px-3.5 py-2.5 text-[13px] font-extrabold text-slate-200">
              <span
                className="material-symbols-rounded text-lg! leading-none text-slate-400"
                aria-hidden="true"
              >
                schedule
              </span>
              {formatHour(hours?.open)
                ? t("card.closedOpens", { time: formatHour(hours.open) })
                : t("common.closed")}
            </span>
          )}
        </div>

        {/* Details */}
        <div
          className={`flex flex-col gap-1 px-4 pb-4 pt-3 ${open ? "" : "opacity-60"}`}
        >
          <div className="flex items-center justify-between gap-2.5">
            <h3 className="min-w-0 truncate text-lg font-extrabold text-white">
              {name}
            </h3>
            {rating != null && (
              <span className="flex shrink-0 items-center gap-0.5 rounded-lg bg-(--brand-bg-secondary,#1e293b) px-2 py-0.5 text-[13px] font-extrabold text-slate-100">
                <span
                  className={
                    rating >= 4.5 ? "text-(--brand-primary)" : "text-slate-400"
                  }
                  aria-hidden="true"
                >
                  ★
                </span>
                <span className="sr-only">{t("card.rated")} </span>
                {rating}
              </span>
            )}
          </div>
          {meta && (
            <p className="m-0 text-sm font-semibold text-slate-400">{meta}</p>
          )}
        </div>
      </article>
    </Link>
  );
}

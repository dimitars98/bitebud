import { Link, useOutletContext } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Lock,
  Minus,
  Moon,
  Plus,
  ShoppingBag,
  Trash,
} from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { useCurrency } from "../contexts/CurrencyContext";
import { useCartCheckout } from "../hooks/useCartCheckout";
import { DELIVERY_FEE, MAX_ITEM_QTY } from "../helpers/cartTotals";
import { formatHour } from "../lib/formatHour";

const card =
  "rounded-2xl bg-white dark:bg-(--brand-bg-secondary) border border-(--border-primary) shadow-sm";

export default function Cart() {
  const { t } = useTranslation();
  const { formatCurrency } = useCurrency();
  const { openAuth } = useOutletContext() ?? {};

  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    restaurant,
    hasItems,
    totals,
    isClosed,
    belowMinimum,
    amountToMinimum,
    minOrder,
    canCheckout,
    clearWithUndo,
    startCheckout,
  } = useCartCheckout({ onTriggerLogin: () => openAuth?.("login") });

  if (!hasItems) return <EmptyCart />;

  const { subtotal, deliveryFee, total, itemCount } = totals;
  const minProgress = Math.min(100, (subtotal / minOrder) * 100);

  // Why the checkout button is disabled, shown right under it.
  const blockedReason = isClosed
    ? t("cart.closedNotice")
    : belowMinimum
      ? t("cartPage.belowMinimum", { amount: formatCurrency(amountToMinimum) })
      : null;

  const checkoutButton = (
    <button
      type="button"
      onClick={startCheckout}
      disabled={!canCheckout}
      className="group flex w-full items-center justify-between gap-3 rounded-xl bg-(--brand-primary) px-5 py-3.5 font-extrabold text-(--restaurant-card-bg) transition-colors hover:bg-(--brand) disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-primary)/40"
    >
      <span className="whitespace-nowrap">
        {isClosed ? t("common.closed") : t("cartPage.checkout")}
      </span>
      <span className="flex items-center gap-1 whitespace-nowrap">
        {formatCurrency(total)}
        <ArrowRight
          size={20}
          aria-hidden="true"
          className="transition-transform group-enabled:group-hover:translate-x-0.5"
        />
      </span>
    </button>
  );

  return (
    <div className="mx-auto max-w-[1500px] px-4 pb-32 pt-6 md:px-6 md:pt-10 lg:pb-16">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-(--text-primary) md:text-4xl">
            {t("cart.title")}
          </h1>
          <p className="mt-1 text-(--text-muted)">
            {t("cartPage.itemCount", { count: itemCount })}
          </p>
        </div>
        <button
          type="button"
          onClick={clearWithUndo}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-300 dark:hover:bg-red-500/10 cursor-pointer"
        >
          <Trash size={16} aria-hidden="true" />
          {t("cart.clear")}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        {/* Left: restaurant + items */}
        <div className="flex flex-col gap-4">
          {restaurant && <RestaurantStrip restaurant={restaurant} isClosed={isClosed} />}

          <ul className={`${card} divide-y divide-(--border-primary) dark:divide-white/10 overflow-hidden`}>
            <AnimatePresence initial={false}>
              {cartItems.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 p-4 sm:p-5"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-xl bg-(--bg-secondary) object-cover sm:h-24 sm:w-24"
                  />

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-bold text-(--text-primary) dark:text-white sm:text-lg">
                          {item.name}
                        </p>
                        {item.extras?.length > 0 && (
                          <p className="mt-0.5 text-sm text-(--text-muted)">
                            + {item.extras.map((e) => e.name).join(", ")}
                          </p>
                        )}
                        <p className="mt-0.5 text-sm text-(--text-muted)">
                          {t("cartPage.each", { price: formatCurrency(item.price) })}
                        </p>
                      </div>
                      <p className="shrink-0 text-base font-extrabold text-(--text-primary) dark:text-white sm:text-lg">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center rounded-full bg-(--bg-secondary) p-1 dark:bg-(--brand-bg-primary)">
                        <button
                          type="button"
                          onClick={() => decreaseQty(item.id)}
                          aria-label={t("itemModal.decrease")}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-(--text-primary) transition-colors hover:bg-white dark:text-white dark:hover:bg-(--brand-bg-secondary-hover) cursor-pointer"
                        >
                          <Minus size={16} />
                        </button>
                        <span
                          className="w-8 text-center font-bold text-(--text-primary) dark:text-white"
                          aria-live="polite"
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQty(item.id)}
                          disabled={item.quantity >= MAX_ITEM_QTY}
                          aria-label={t("itemModal.increase")}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-(--text-primary) transition-colors hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent dark:text-white dark:hover:bg-(--brand-bg-secondary-hover) cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash size={15} aria-hidden="true" />
                        {t("cartPage.remove")}
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {restaurant?.slug && (
            <Link
              to={`/restaurant/${restaurant.slug}`}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-(--border-primary) py-4 font-bold text-(--text-muted) transition-colors hover:border-(--brand-primary) hover:text-(--brand)"
            >
              <Plus size={20} aria-hidden="true" />
              {t("cartPage.addMore")}
            </Link>
          )}
        </div>

        {/* Right: summary (sticky on desktop) */}
        <aside className="lg:sticky lg:top-[calc(var(--nav-height,80px)+1.5rem)] lg:self-start">
          <section className={`${card} p-5 sm:p-6`} aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="text-lg font-extrabold text-(--text-primary) dark:text-white">
              {t("cartPage.summary")}
            </h2>

            {belowMinimum && (
              <div className="mt-4 rounded-xl bg-amber-50 p-3 dark:bg-amber-400/10">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  {t("cartPage.belowMinimum", { amount: formatCurrency(amountToMinimum) })}
                </p>
                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-200/60 dark:bg-amber-400/20"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(minProgress)}
                  aria-label={t("cartPage.minOrderLabel", { amount: formatCurrency(minOrder) })}
                >
                  <div
                    className="h-full rounded-full bg-(--brand-primary) transition-[width] duration-300"
                    style={{ width: `${minProgress}%` }}
                  />
                </div>
              </div>
            )}

            <dl className="mt-4 space-y-2.5 text-[15px]">
              <div className="flex justify-between text-(--text-muted)">
                <dt>{t("cart.subtotal", { count: itemCount })}</dt>
                <dd>{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-(--text-muted)">
                <dt>{t("cart.deliveryFee")}</dt>
                <dd>
                  {deliveryFee === 0 ? (
                    <span className="flex items-center gap-2">
                      <span className="text-gray-400 line-through">{formatCurrency(DELIVERY_FEE)}</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{t("common.free")}</span>
                    </span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-dashed border-(--border-primary) pt-3 text-lg font-extrabold text-(--text-primary) dark:text-white">
                <dt>{t("cart.total")}</dt>
                <dd>{formatCurrency(total)}</dd>
              </div>
            </dl>

            <div className="mt-5 hidden lg:block">{checkoutButton}</div>
            {blockedReason && (
              <p className="mt-3 hidden text-center text-sm text-(--text-muted) lg:block">{blockedReason}</p>
            )}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-(--text-muted)">
              <Lock size={14} aria-hidden="true" />
              {t("cartPage.secure")}
            </p>
          </section>
        </aside>
      </div>

      {/* Phones/tablets: checkout stays in reach at the bottom of the screen */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-(--border-primary) bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur dark:bg-(--brand-bg-primary)/95 lg:hidden">
        {blockedReason && (
          <p className="mb-2 text-center text-sm text-(--text-muted)">{blockedReason}</p>
        )}
        {checkoutButton}
      </div>
    </div>
  );
}

function RestaurantStrip({ restaurant, isClosed }) {
  const { t } = useTranslation();
  const opensAt = formatHour(restaurant.hours?.open);

  return (
    <div className="overflow-hidden rounded-2xl bg-(--restaurant-card-bg) text-white shadow-sm dark:ring-1 dark:ring-white/10">
      <div className="flex items-center gap-4 p-4 sm:p-5">
        {restaurant.logo && (
          <img src={restaurant.logo} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
            {t("cartPage.from")}
          </p>
          <Link
            to={`/restaurant/${restaurant.slug}`}
            className="block truncate text-lg font-extrabold hover:text-(--brand-primary)"
          >
            {restaurant.name}
          </Link>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm font-semibold text-slate-300">
            {restaurant.rating != null && (
              <span className="flex items-center gap-1">
                <span className="text-(--brand-primary)" aria-hidden="true">★</span>
                {restaurant.rating}
              </span>
            )}
            {restaurant.deliveryTime != null && (
              <span className="flex items-center gap-1">
                <Clock size={15} aria-hidden="true" className="text-slate-400" />
                {t("cartPage.eta", { min: restaurant.deliveryTime })}
              </span>
            )}
            <span className={`flex items-center gap-1.5 ${isClosed ? "text-slate-400" : "text-green-400"}`}>
              <span className={`h-2 w-2 rounded-full ${isClosed ? "bg-slate-500" : "bg-green-400"}`} />
              {isClosed ? t("common.closed") : t("menuPage.openNow")}
            </span>
          </p>
        </div>
      </div>

      {isClosed && (
        <p className="flex items-center gap-2 border-t border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
          <Moon size={18} aria-hidden="true" className="shrink-0 text-slate-400" />
          <span>
            {t("cart.closedNotice")}{" "}
            {opensAt && (
              <Trans
                i18nKey="cart.opensAt"
                values={{ time: opensAt }}
                components={{ strong: <strong className="text-white" /> }}
              />
            )}
          </span>
        </p>
      )}
    </div>
  );
}

function EmptyCart() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center md:py-28">
      <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-(--brand-primary)/15">
        <ShoppingBag size={56} strokeWidth={1.75} aria-hidden="true" className="text-(--brand)" />
      </div>
      <h1 className="text-3xl font-extrabold text-(--text-primary)">{t("cartPage.emptyTitle")}</h1>
      <p className="mt-2 text-(--text-muted)">{t("cartPage.emptyBody")}</p>
      <Link
        to="/explore"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-(--brand-primary) px-6 py-3.5 font-extrabold text-(--restaurant-card-bg) transition-colors hover:bg-(--brand) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-primary)/40"
      >
        {t("footer.browse")}
        <ArrowRight size={20} aria-hidden="true" />
      </Link>
    </div>
  );
}

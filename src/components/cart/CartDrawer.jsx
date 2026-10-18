import { useCurrency } from "../../contexts/CurrencyContext";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { DELIVERY_FEE } from "../../helpers/cartTotals";
import { motion } from "framer-motion";
import { Moon, ShoppingBag, Trash, X } from "lucide-react";
import { useCartCheckout } from "../../hooks/useCartCheckout";
import { Trans, useTranslation } from "react-i18next";
import { formatHour } from "../../lib/formatHour";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useEscapeKey } from "../../hooks/useEscapeKey";

export default function CartDrawer({ isOpen, onClose, onTriggerLogin }) {
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();
  const drawerRef = useRef(null);

  // Shared with the cart page: totals, open/closed, minimum order, checkout.
  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    restaurant,
    hasItems: cartHasItems,
    totals: { subtotal, deliveryFee, total, itemCount },
    isClosed: isRestaurantClosed,
    belowMinimum,
    amountToMinimum,
    canCheckout,
    clearWithUndo: handleClearCart,
    startCheckout,
  } = useCartCheckout({ onTriggerLogin, onLeave: onClose });

  const orderButtonText = isRestaurantClosed
    ? t("common.closed")
    : t("cart.orderNow");

  // Clicking "Undo" in the toast shouldn't close the drawer.
  useClickOutside(drawerRef, () => onClose?.(), {
    enabled: isOpen,
    ignore: "[data-cart-undo]",
  });

  useEscapeKey(() => onClose?.(), isOpen);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <motion.div
        ref={drawerRef}
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
        className="flex justify-between flex-col fixed right-0 top-0 h-full w-screen md:w-100 bg-white dark:bg-(--brand-bg-secondary) dark:text-white shadow-lg md:rounded-tl-2xl md:rounded-bl-xl z-[1000] overflow-y-auto"
      >
        <div className="flex-1 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag />
              <h2 className="text-xl font-bold">{t("cart.title")}</h2>
            </div>
            <div className="flex items-center gap-1">
              {cartHasItems && (
                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-300 dark:hover:bg-red-500/10 cursor-pointer transition-colors"
                >
                  <Trash size={16} />
                  {t("cart.clear")}
                </button>
              )}
              <button
                onClick={onClose}
                aria-label={t("cart.close")}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all duration-300 flex items-center justify-center"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-center">
                {t("cart.empty")}
                <br />
                {t("cart.emptyHint")}
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-(--border-primary) dark:border-(--border-primary) bg-white dark:bg-(--brand-bg-secondary) p-4"
                >
                  {/* Left block */}
                  <div className="flex gap-4 items-center flex-1">
                    {/* Image */}
                    <div className="h-16 w-16 overflow-hidden rounded-xl bg-(--bg-secondary)">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col">
                      <p className="font-semibold text-(--text-primary) dark:text-(--text-secondary) text-[15px]">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-300 mt-0.5">
                        {formatCurrency(item.price)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="h-6 w-6 rounded-lg bg-(--bg-primary) dark:bg-slate-600 text-(--text-secondary) dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-500"
                        >
                          –
                        </button>

                        <span className="font-medium">{item.quantity}</span>

                        <button
                          onClick={() => increaseQty(item.id)}
                          className="h-6 w-6 rounded-lg bg-gray-100 dark:bg-slate-600 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-500"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right block: total + remove */}
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold text-gray-900 dark:text-gray-300">
                      {formatCurrency(item.price * item.quantity)}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isRestaurantClosed && (
          <div className="flex flex-col text-sm text-gray-500 text-center mb-4">
            <span className="flex justify-center gap-2 items-center">
              <Moon /> {t("cart.closedNotice")}
            </span>
            <br />
            {formatHour(restaurant?.hours?.open) && (
              <span className="text-gray-500 mb-6">
                <Trans
                  i18nKey="cart.opensAt"
                  values={{ time: formatHour(restaurant.hours.open) }}
                  components={{ strong: <strong /> }}
                />
              </span>
            )}
          </div>
        )}
        {cartHasItems && (
          <div className="mx-4 mb-1 border-t border-(--border-primary) pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500 dark:text-gray-300">
              <span>{t("cart.subtotal", { count: itemCount })}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500 dark:text-gray-300">
              <span>{t("cart.deliveryFee")}</span>
              {deliveryFee === 0 ? (
                <span className="flex items-center gap-2">
                  <span className="line-through text-gray-400">
                    {formatCurrency(DELIVERY_FEE)}
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {t("common.free")}
                  </span>
                </span>
              ) : (
                <span>{formatCurrency(deliveryFee)}</span>
              )}
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-(--border-primary) text-base font-bold text-(--text-primary) dark:text-white">
              <span>{t("cart.total")}</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        )}
        <div className="p-3">
          {belowMinimum && (
            <p className="mb-2 text-center text-sm text-amber-700 dark:text-amber-300">
              {t("cartPage.belowMinimum", {
                amount: formatCurrency(amountToMinimum),
              })}
            </p>
          )}
          <button
            onClick={startCheckout}
            disabled={!canCheckout}
            className={`w-full font-semibold py-3 rounded-xl transition-all ${
              !canCheckout
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-300"
            }`}
          >
            {orderButtonText}
          </button>
          {cartHasItems && (
            <Link
              to="/cart"
              onClick={onClose}
              className="mt-2 block text-center text-sm font-semibold text-(--text-muted) hover:text-(--brand) py-1.5"
            >
              {t("cartPage.viewFull")}
            </Link>
          )}
        </div>
      </motion.div>
    </>
  );
}

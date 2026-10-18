import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import { useAuthIntent } from "../contexts/AuthIntentContext";
import { useAuth } from "./useAuth";
import { useRestaurantsQuery } from "./useRestaurantsQuery";
import { isRestaurantOpen } from "../lib/isRestaurantOpen";
import {
  getCartTotals,
  getDeliveryFee,
  MIN_ORDER_PRICE,
} from "../helpers/cartTotals";

/**
 * Everything the cart drawer and the cart page share: the cart's restaurant,
 * totals, whether it can be ordered, "clear with undo" and "go to checkout".
 *
 * - `onTriggerLogin`: opens the login modal (from AppLayout).
 * - `onLeave`: called right before navigating to checkout (e.g. close the drawer).
 */
export function useCartCheckout({ onTriggerLogin, onLeave } = {}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setAuthIntent } = useAuthIntent();
  const cart = useCart();
  const { cartItems, addToCart, clearCart, restaurantId, partnerId } = cart;

  const { data: restaurants = [] } = useRestaurantsQuery();
  const restaurant = restaurants.find((r) => r.id === restaurantId);

  const hasItems = cartItems.length > 0;
  const totals = getCartTotals(cartItems, getDeliveryFee(restaurant));
  const isClosed = !!restaurant && !isRestaurantOpen(restaurant.hours);

  // The minimum is on the food only (delivery fee doesn't count).
  const amountToMinimum = Math.max(0, MIN_ORDER_PRICE - totals.subtotal);
  const belowMinimum = hasItems && amountToMinimum > 0;

  const canCheckout = hasItems && !isClosed && !belowMinimum;

  // Empties the cart, with an Undo toast instead of a confirm dialog.
  const clearWithUndo = () => {
    const snapshot = { items: cartItems, restaurantId, partnerId };
    clearCart();

    toast(
      (toastItem) => (
        <span className="flex items-center gap-3" data-cart-undo>
          {t("cart.cleared")}
          <button
            onClick={() => {
              snapshot.items.forEach((item) =>
                addToCart(item, snapshot.restaurantId, snapshot.partnerId),
              );
              toast.dismiss(toastItem.id);
            }}
            className="font-bold text-amber-500 hover:text-amber-400 cursor-pointer"
          >
            {t("cart.undo")}
          </button>
        </span>
      ),
      { duration: 5000 },
    );
  };

  const startCheckout = () => {
    if (!canCheckout) return;

    if (!user) {
      // Remember why they're logging in, so AuthModal continues to checkout.
      setAuthIntent("checkout");
      onTriggerLogin?.();
      toast.error(t("cart.mustLogin"));
      return;
    }

    if (user.role !== "customer") {
      toast.error(
        t("cart.wrongRole", {
          role: t(`roles.${user.role}`, { defaultValue: user.role }),
        }),
      );
      return;
    }

    onLeave?.();
    navigate("/checkout", { state: { restaurantId, partnerId } });
  };

  return {
    ...cart,
    restaurant,
    hasItems,
    totals,
    isClosed,
    belowMinimum,
    amountToMinimum,
    minOrder: MIN_ORDER_PRICE,
    canCheckout,
    clearWithUndo,
    startCheckout,
  };
}

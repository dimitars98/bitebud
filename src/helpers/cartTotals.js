// Single source of truth for order pricing, used by the cart drawer and checkout
// so the total you see in the cart is the total you pay.
export const DELIVERY_FEE = 3;
export const MAX_ITEM_QTY = 10; // most of one item a cart can hold
export const MIN_ORDER_PRICE = 5; // smallest food subtotal you can check out with
export const FREE_DELIVERY_TAG = "Free delivery";

// Restaurants tagged "Free delivery" don't charge the fee. Unknown restaurant
// (e.g. still loading) -> standard fee, so we never under-quote.
export function getDeliveryFee(restaurant) {
  return restaurant?.tags?.includes(FREE_DELIVERY_TAG) ? 0 : DELIVERY_FEE;
}

const toCents = (amount) => Math.round(amount * 100) / 100;

export function getCartTotals(cartItems = [], deliveryFee = DELIVERY_FEE) {
  const subtotal = toCents(
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const fee = cartItems.length > 0 ? deliveryFee : 0; // no fee on an empty cart

  return { subtotal, deliveryFee: fee, total: toCents(subtotal + fee), itemCount };
}

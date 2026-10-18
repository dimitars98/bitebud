import { describe, expect, test } from "vitest";
import { DELIVERY_FEE, getCartTotals, getDeliveryFee } from "./cartTotals";

const pizza = { id: 5, price: 11, quantity: 3 };
const tiramisu = { id: 6, price: 5, quantity: 1 };

describe("getCartTotals", () => {
  test("adds price x quantity for every item, plus the delivery fee", () => {
    expect(getCartTotals([pizza, tiramisu])).toEqual({
      subtotal: 38,
      deliveryFee: DELIVERY_FEE,
      total: 38 + DELIVERY_FEE,
      itemCount: 4,
    });
  });

  test("an empty cart costs nothing (no delivery fee)", () => {
    expect(getCartTotals([])).toEqual({ subtotal: 0, deliveryFee: 0, total: 0, itemCount: 0 });
  });

  test("rounds to cents (0.1 + 0.2 must not show as 0.30000000000000004)", () => {
    const { subtotal } = getCartTotals([
      { id: 1, price: 0.1, quantity: 1 },
      { id: 2, price: 0.2, quantity: 1 },
    ]);
    expect(subtotal).toBe(0.3);
  });

  test("a custom delivery fee can be passed in", () => {
    expect(getCartTotals([tiramisu], 0).total).toBe(5);
  });
});

describe("getDeliveryFee", () => {
  test("free for restaurants tagged 'Free delivery'", () => {
    expect(getDeliveryFee({ tags: ["Free delivery", "Vegetarian"] })).toBe(0);
  });

  test("standard fee for restaurants without the tag", () => {
    expect(getDeliveryFee({ tags: ["Vegan"] })).toBe(DELIVERY_FEE);
    expect(getDeliveryFee({})).toBe(DELIVERY_FEE);
  });

  test("standard fee while the restaurant is unknown (never under-quote)", () => {
    expect(getDeliveryFee(undefined)).toBe(DELIVERY_FEE);
  });

  test("free-delivery restaurant: total is just the food", () => {
    const fee = getDeliveryFee({ tags: ["Free delivery"] });
    expect(getCartTotals([pizza], fee)).toMatchObject({ deliveryFee: 0, total: 33 });
  });
});

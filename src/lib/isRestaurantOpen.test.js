import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { isRestaurantOpen } from "./isRestaurantOpen";

// Pin "now" to a fixed local time so every case is deterministic.
const at = (hhmm) => vi.setSystemTime(new Date(`2026-10-17T${hhmm}:00`));

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("isRestaurantOpen", () => {
  describe("same-day hours (09:00–22:00)", () => {
    const hours = { open: 9, close: 22 };

    test("open in the middle of the day", () => {
      at("13:00");
      expect(isRestaurantOpen(hours)).toBe(true);
    });

    test("open exactly at opening time", () => {
      at("09:00");
      expect(isRestaurantOpen(hours)).toBe(true);
    });

    test("still open one minute before closing (minutes count)", () => {
      at("21:59");
      expect(isRestaurantOpen(hours)).toBe(true);
    });

    test("closed exactly at closing time", () => {
      at("22:00");
      expect(isRestaurantOpen(hours)).toBe(false);
    });

    test("closed before opening", () => {
      at("08:30");
      expect(isRestaurantOpen(hours)).toBe(false);
    });
  });

  describe("overnight hours (16:00–08:00, like Pizzeria Bella)", () => {
    const hours = { open: 16, close: 8 };

    test("open in the evening (the bug the card and menu page used to have)", () => {
      at("17:30");
      expect(isRestaurantOpen(hours)).toBe(true);
    });

    test("open after midnight", () => {
      at("02:00");
      expect(isRestaurantOpen(hours)).toBe(true);
    });

    test("closed exactly at closing time", () => {
      at("08:00");
      expect(isRestaurantOpen(hours)).toBe(false);
    });

    test("closed in the middle of the day", () => {
      at("12:00");
      expect(isRestaurantOpen(hours)).toBe(false);
    });
  });

  test("half-hour opening times work (open: 9.5 means 09:30)", () => {
    at("09:15");
    expect(isRestaurantOpen({ open: 9.5, close: 17 })).toBe(false);
    at("09:45");
    expect(isRestaurantOpen({ open: 9.5, close: 17 })).toBe(true);
  });

  test("open === close is treated as open around the clock", () => {
    at("03:00");
    expect(isRestaurantOpen({ open: 0, close: 0 })).toBe(true);
  });

  describe("missing or invalid hours count as closed", () => {
    test.each([
      ["undefined", undefined],
      ["null", null],
      ["empty object", {}],
      ["missing close", { open: 9 }],
      ["strings instead of numbers", { open: "9", close: "22" }],
    ])("%s", (_label, hours) => {
      at("13:00");
      expect(isRestaurantOpen(hours)).toBe(false);
    });
  });
});

import { describe, expect, test } from "vitest";
import { hasCategory } from "./hasCategory";

describe("hasCategory", () => {
  const bella = { categories: "Pizza, Pasta ,Dessert" };

  test("matches any listed category, ignoring case and spaces", () => {
    expect(hasCategory(bella, "pizza")).toBe(true);
    expect(hasCategory(bella, "Pasta")).toBe(true);
    expect(hasCategory(bella, " dessert ")).toBe(true);
  });

  test("does not match partial words", () => {
    expect(hasCategory(bella, "Pizz")).toBe(false);
    expect(hasCategory({ categories: "Burgers" }, "Burger")).toBe(false);
  });

  test("handles missing data", () => {
    expect(hasCategory({}, "Pizza")).toBe(false);
    expect(hasCategory(undefined, "Pizza")).toBe(false);
    expect(hasCategory(bella, "")).toBe(false);
  });
});

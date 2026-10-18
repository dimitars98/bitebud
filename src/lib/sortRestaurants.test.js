import { describe, expect, it, vi, afterEach } from "vitest";
import { sortRestaurants, isOpenForListing } from "./sortRestaurants";

const names = (list) => list.map((r) => r.name);

describe("sortRestaurants", () => {
  afterEach(() => vi.useRealTimers());

  const list = [
    { id: "a", name: "Bistro", rating: 4.2, deliveryTime: 30 },
    { id: "b", name: "alpha", rating: 4.8, deliveryTime: "25-35" },
    { id: "c", name: "Corner", rating: null, deliveryTime: 15 },
    { id: "d", name: "Deli", rating: "4.5" },
  ];

  it("keeps the original order for recommended", () => {
    expect(names(sortRestaurants(list, "recommended"))).toEqual([
      "Bistro", "alpha", "Corner", "Deli",
    ]);
  });

  it("sorts by rating, highest first, missing last", () => {
    expect(names(sortRestaurants(list, "rating"))).toEqual([
      "alpha", "Deli", "Bistro", "Corner",
    ]);
  });

  it("sorts by delivery time, parsing ranges, missing last", () => {
    expect(names(sortRestaurants(list, "deliveryTime"))).toEqual([
      "Corner", "alpha", "Bistro", "Deli",
    ]);
  });

  it("sorts by name ignoring case", () => {
    expect(names(sortRestaurants(list, "name"))).toEqual([
      "alpha", "Bistro", "Corner", "Deli",
    ]);
  });

  it("sorts by distance from the map and adds it to the restaurant", () => {
    const distances = new Map([["a", 3], ["b", 0.4], ["d", 12]]);
    const sorted = sortRestaurants(list, "distance", distances);
    expect(names(sorted)).toEqual(["alpha", "Bistro", "Deli", "Corner"]);
    expect(sorted[0].distance).toBe(0.4);
  });

  it("does not mutate the input", () => {
    const copy = [...list];
    sortRestaurants(list, "rating");
    expect(list).toEqual(copy);
  });

  it("puts closed restaurants last, whatever the sort", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5, 12, 0)); // noon
    const withHours = [
      { id: "x", name: "Night owl", rating: 5, hours: { open: 20, close: 4 } },
      { id: "y", name: "Lunch spot", rating: 3, hours: { open: 10, close: 16 } },
    ];
    expect(isOpenForListing(withHours[0])).toBe(false);
    expect(names(sortRestaurants(withHours, "rating"))).toEqual([
      "Lunch spot", "Night owl",
    ]);
  });

  it("falls back to recommended for an unknown sort", () => {
    expect(names(sortRestaurants(list, "nonsense"))).toEqual(names(list));
  });
});

import { describe, expect, test } from "vitest";
import { formatHour } from "./formatHour";

describe("formatHour", () => {
  test.each([
    [9, "09:00"],
    [0, "00:00"],
    [16, "16:00"],
    [21.5, "21:30"],
    [9.25, "09:15"],
  ])("%s -> %s", (input, expected) => {
    expect(formatHour(input)).toBe(expected);
  });

  test("returns null for anything that isn't a number", () => {
    expect(formatHour(undefined)).toBeNull();
    expect(formatHour(null)).toBeNull();
    expect(formatHour("9")).toBeNull();
  });
});

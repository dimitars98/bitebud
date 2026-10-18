import { describe, expect, test } from "vitest";
import { formatDateTime, isSameDay, isSameMonth, minutesBetween, toDate } from "./dates";

const ms = Date.UTC(2026, 9, 18, 10, 0, 0);
const firestoreLike = { seconds: ms / 1000, nanoseconds: 0, toDate: () => new Date(ms) };

describe("toDate", () => {
  test("accepts Timestamps, { seconds }, Dates and numbers", () => {
    expect(toDate(firestoreLike).getTime()).toBe(ms);
    expect(toDate({ seconds: ms / 1000 }).getTime()).toBe(ms);
    expect(toDate(new Date(ms)).getTime()).toBe(ms);
    expect(toDate(ms).getTime()).toBe(ms);
  });
  test("returns null for missing values", () => {
    expect(toDate(null)).toBeNull();
    expect(toDate(undefined)).toBeNull();
    expect(toDate("nope")).toBeNull();
  });
});

test("formatDateTime falls back when there's no date", () => {
  expect(formatDateTime(null, "en", "—")).toBe("—");
  expect(formatDateTime({ seconds: ms / 1000 }, "en")).toBe(new Date(ms).toLocaleString("en"));
});

test("isSameDay / isSameMonth", () => {
  const d = new Date(2026, 9, 18, 9);
  expect(isSameDay({ seconds: d.getTime() / 1000 }, new Date(2026, 9, 18, 23))).toBe(true);
  expect(isSameDay(d, new Date(2026, 9, 19))).toBe(false);
  expect(isSameMonth(d, new Date(2026, 9, 1))).toBe(true);
  expect(isSameMonth(d, new Date(2025, 9, 18))).toBe(false);
  expect(isSameDay(null)).toBe(false);
});

test("minutesBetween", () => {
  expect(minutesBetween({ seconds: 0 }, { seconds: 1800 })).toBe(30);
  expect(minutesBetween(null, { seconds: 1800 })).toBeNull();
});

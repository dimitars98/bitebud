// Firestore returns dates as Timestamp objects ({ seconds, nanoseconds } with a
// toDate() method). These helpers accept a Timestamp, a plain { seconds } object,
// a Date or a millisecond number, so callers don't need to care which they have.

/** Converts any supported date value to a JS Date, or null if missing/invalid. */
export function toDate(value) {
  if (value == null) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  if (typeof value === "number") return new Date(value);
  return null;
}

/** Date + time in the given language (e.g. "9.10.2025, 10:53:20" for "de"). */
export function formatDateTime(value, language, fallback = "") {
  const date = toDate(value);
  return date ? date.toLocaleString(language) : fallback;
}

export function isSameDay(a, b = new Date()) {
  const x = toDate(a);
  const y = toDate(b);
  return !!x && !!y && x.toDateString() === y.toDateString();
}

export function isSameMonth(a, b = new Date()) {
  const x = toDate(a);
  const y = toDate(b);
  return (
    !!x && !!y && x.getMonth() === y.getMonth() && x.getFullYear() === y.getFullYear()
  );
}

/** Minutes from `start` to `end`, or null if either is missing. */
export function minutesBetween(start, end) {
  const s = toDate(start);
  const e = toDate(end);
  return s && e ? (e - s) / 60000 : null;
}

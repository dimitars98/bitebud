// 9 -> "09:00", 21.5 -> "21:30". Returns null for anything that isn't a number.
export function formatHour(hour) {
  if (typeof hour !== "number") return null;
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

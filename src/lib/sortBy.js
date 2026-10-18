export function sortBy(data, key, direction = "asc") {
  const multiplier = direction === "asc" ? 1 : -1;

  return [...data].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];

    // Handle null / undefined
    if (aVal == null) return 1 * multiplier;
    if (bVal == null) return -1 * multiplier;

    // Dates (Firestore timestamps or Date objects)
    if (aVal instanceof Date && bVal instanceof Date) {
      return (aVal - bVal) * multiplier;
    }

    // Numbers
    if (typeof aVal === "number" && typeof bVal === "number") {
      return (aVal - bVal) * multiplier;
    }

    // Everything else → string comparison
    return (
      String(aVal).localeCompare(String(bVal), undefined, { numeric: true }) *
      multiplier
    );
  });
}

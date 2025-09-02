export function isRestaurantOpen(hours) {
  if (
    !hours ||
    typeof hours.open !== "number" ||
    typeof hours.close !== "number"
  )
    return false;

  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  let openTime = hours.open;
  let closeTime = hours.close;

  if (closeTime <= openTime) {
    if (currentHour >= openTime || currentHour < closeTime) {
      return true;
    }
    return false;
  }

  return currentHour >= openTime && currentHour < closeTime;
}

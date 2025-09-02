export async function geocodeAddress(address, apiKey) {
  const encoded = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Geocode response:", data);

    if (data.status === "OK" && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error("Geocoding failed:", data);
      return null;
    }
  } catch (err) {
    console.error("Geocoding error:", err);
    return null;
  }
}

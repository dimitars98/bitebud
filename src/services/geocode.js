export async function geocodeAddressOSM(address) {
  const encoded = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "YourAppName/1.0 (your-email@example.com)", // Required by Nominatim
      },
    });
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null; // No result
  } catch (err) {
    console.error("OSM Geocoding error:", err);
    return null;
  }
}

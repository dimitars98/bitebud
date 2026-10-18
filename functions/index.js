// index.js
const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
// Stripe is loaded inside createPaymentIntent, not here: it's large, and the
// Firebase CLI must load this file within 10s at deploy time to find functions.
const { onDocumentWritten } = require("firebase-functions/firestore");

const stripeSecret = defineSecret("STRIPE_SECRET_KEY");
const orsKey = defineSecret("ORS_API_KEY");

admin.initializeApp();

exports.createPaymentIntent = onCall(
  { region: "us-central1", secrets: [stripeSecret] },
  async (request) => {
    console.log("request.data:", JSON.stringify(request.data));

    const Stripe = require("stripe");
    const stripe = new Stripe(stripeSecret.value(), {
      apiVersion: "2023-08-16",
    });

    const { cartItems, deliveryFee, currency = "usd" } = request.data || {};
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("Cart items are required");
    }

    // Calculate total
    const total =
      cartItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      ) + Number(deliveryFee || 0);

    // Stripe requires smallest currency unit (e.g. cents)
    const amountInMinorUnit = Math.round(total * 100);

    console.log(
      `Calculated amount (${currency} minor units):`,
      amountInMinorUnit
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInMinorUnit,
      currency: currency.toLowerCase(), // e.g. "usd", "eur", "mkd"
      automatic_payment_methods: { enabled: true },
    });

    return { clientSecret: paymentIntent.client_secret };
  }
);

exports.getDistanceMatrix = onCall(
  { region: "us-central1", secrets: [orsKey] },
  async (req) => {
    const { userCoords, restaurants } = req.data || {};
    console.log("Received payload:", req.data);

    const locations = [
      [userCoords.lng, userCoords.lat],
      ...restaurants.map((r) => [r.lng, r.lat]),
    ];

    const body = { locations, metrics: ["distance"], units: "m" };
    console.log("ORS request body:", body);

    const response = await fetch(
      "https://api.openrouteservice.org/v2/matrix/driving-car",
      {
        method: "POST",
        headers: {
          Authorization: orsKey.value(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("ORS error response:", text);
      throw new Error(`ORS error: ${text}`);
    }

    const data = await response.json();
    console.log("ORS response data:", data);

    const distances = data.distances[0].slice(1);
    return { distances };
  }
);

exports.enrichRestaurantDistances = onCall(
  { region: "us-central1", secrets: [orsKey], cors: true },
  async (req) => {
    const { userCoords } = req.data || {};
    if (!userCoords) throw new Error("User coordinates required");

    const snapshot = await admin.firestore().collection("restaurants").get();
    const restaurants = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter out restaurants without valid location
    const validRestaurants = restaurants.filter(
      (r) => r.location && r.location.lat != null && r.location.lng != null
    );

    const locations = [
      [userCoords.lng, userCoords.lat],
      ...validRestaurants.map((r) => [r.location.lng, r.location.lat]),
    ];

    const body = { locations, metrics: ["distance"], units: "m" };

    let distances = [];
    try {
      const response = await fetch(
        "https://api.openrouteservice.org/v2/matrix/driving-car",
        {
          method: "POST",
          headers: {
            Authorization: orsKey.value(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("ORS error:", text);
        throw new Error("ORS failed");
      }

      const data = await response.json();
      distances = data.distances[0].slice(1);
      console.log("ORS distances:", distances);
    } catch (err) {
      console.warn("ORS failed, falling back to Haversine:", err);
      distances = validRestaurants.map(
        (r) =>
          getDistanceKm(
            userCoords.lat,
            userCoords.lng,
            r.location.lat,
            r.location.lng
          ) * 1000
      );
      console.log("Fallback distances (m):", distances);
    }

    // Update Firestore docs with distance
    const batch = admin.firestore().batch();
    validRestaurants.forEach((rest, i) => {
      const km = distances[i] ? distances[i] / 1000 : null;
      console.log("Updating restaurant", rest.id, "with distance", km);
      batch.update(admin.firestore().collection("restaurants").doc(rest.id), {
        distance: km,
      });
    });
    await batch.commit();
    console.log("Batch committed successfully");

    return { updated: validRestaurants.length };
  }
);

// Haversine fallback
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Trigger whenever a restaurant doc is created or updated
exports.updateRestaurantDistance = onDocumentWritten(
  "restaurants/{restaurantId}",
  async (event) => {
    const newData = event.data?.after?.data();
    if (!newData || !newData.location) return;

    const userCoords = { lat: 42.0, lng: 21.4 }; // Example: Skopje center
    const restaurantCoords = newData.location;

    let distanceKm = null;

    try {
      const body = {
        locations: [
          [userCoords.lng, userCoords.lat],
          [restaurantCoords.lng, restaurantCoords.lat],
        ],
        metrics: ["distance"],
        units: "m",
      };

      const response = await fetch(
        "https://api.openrouteservice.org/v2/matrix/driving-car",
        {
          method: "POST",
          headers: {
            Authorization: orsKey.value(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) throw new Error("ORS failed");
      const data = await response.json();
      distanceKm = data.distances[0][1] / 1000;
    } catch (err) {
      console.warn("ORS failed, falling back to Haversine:", err);
      distanceKm = getDistanceKm(
        userCoords.lat,
        userCoords.lng,
        restaurantCoords.lat,
        restaurantCoords.lng
      );
    }

    // Write distance back into Firestore
    await event.data.after.ref.update({ distance: distanceKm });
  }
);

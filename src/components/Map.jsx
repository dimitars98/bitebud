import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { darkMapStyle } from "../utils/googleMapStyles";
import LoadingSpinner from "../ui/LoadingSpinner";

const containerStyle = {
  width: "600px",
  height: "600px",
};

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function MapComponent({ order }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
  });

  if (!isLoaded) return <LoadingSpinner />;

  const center = order?.deliveryLocation || { lat: 41.9981, lng: 21.4254 };

  const mapOptions = {
    styles: darkMapStyle,
    disableDefaultUI: true, // Optional: hides default controls for cleaner look
    zoomControl: true, // Optional: keep zoom controls visible
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      options={mapOptions}
    >
      {order?.restaurantLocation && (
        <Marker
          position={order.restaurantLocation}
          label="R"
          title="Restaurant"
        />
      )}
      {order?.deliveryLocation && (
        <Marker
          position={order.deliveryLocation}
          label="D"
          title="Delivery Address"
        />
      )}
      {order?.courierLocation && (
        <Marker
          position={order.courierLocation}
          label="C"
          title="Courier Location"
        />
      )}
    </GoogleMap>
  );
}

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

L.Marker.prototype.options.icon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});

const courierIcon = new L.DivIcon({
  html: "🚴", // emoji courier
  className: "text-2xl",
});

const customerIcon = new L.DivIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" 
         viewBox="0 0 24 24" 
         width="32" height="32" 
         fill="blue">
      <path d="M12 2c-4.418 0-8 3.582-8 8 0 5.25 8 12 8 12s8-6.75 8-12c0-4.418-3.582-8-8-8z"/>
      <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>
  `,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function DeliveryMap({ courierLocation, customerLocation }) {
  const { t } = useTranslation();
  return (
    <MapContainer
      center={customerLocation}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={courierLocation} icon={courierIcon}>
        <Popup>{t("map.courier")}</Popup>
      </Marker>
      <Marker position={customerLocation} icon={customerIcon}>
        <Popup>{t("map.address")}</Popup>
      </Marker>
    </MapContainer>
  );
}

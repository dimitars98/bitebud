// RestaurantMenuRoute.jsx
import { useLocation } from "react-router-dom";
import RestaurantMenuPage from "../pages/RestaurantMenuPage";

export default function RestaurantMenuRoute() {
  const location = useLocation();

  return <RestaurantMenuPage key={location.pathname} />;
}

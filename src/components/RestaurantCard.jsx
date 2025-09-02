import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CARD_WIDTH, IMAGE_HEIGHT } from "../helpers/sizes";

const TAG_STYLES = {
  Vegan: "bg-green-600 text-white",
  Vegetarian: "bg-amber-500 text-white",
  "Free delivery": "bg-red-500 text-white",
};

function isOpenNow(hours) {
  if (!hours || hours.open == null || hours.close == null) return true;
  const currentHour = new Date().getHours();
  return currentHour >= hours.open && currentHour < hours.close;
}

export default function RestaurantCard({
  id,
  name,
  rating,
  image,
  deliveryTime,
  distance,
  tags = [],
  hours,
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const open = isOpenNow(hours);

  function formatDistance(distance) {
    if (distance === undefined || distance === null) return "Distance unknown";
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  }

  return (
    <Link
      to={`/restaurant/${id}`}
      state={{ name, rating, image, deliveryTime }}
      aria-label={`View details for ${name}`}
      className={`block rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 transition-shadow duration-300`}
    >
      <div
        className={`bg-gray-900 shadow-md rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transform transition cursor-pointer duration-300 ease ${CARD_WIDTH} `}
      >
        <div className="overflow-hidden rounded-t-2xl relative">
          {/* <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full z-30">
            Vegan
          </div>
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-30">
            Free Delivery
          </div> */}
          {open &&
            tags?.map((tag, index) => (
              <div
                key={index}
                className={`absolute left-2 px-2 py-1 text-xs rounded-full font-medium shadow-md z-30 ${TAG_STYLES[tag]}`}
                style={{ top: `${0.5 + index * 1.8}rem` }}
              >
                {tag}
              </div>
            ))}
          {!imgLoaded && (
            <div
              className={`absolute top-0 left-0 w-full ${IMAGE_HEIGHT} bg-gray-700 animate-pulse z-10`}
            />
          )}
          <img
            src={image}
            alt={name}
            onLoad={() => setImgLoaded(true)}
            className={`${IMAGE_HEIGHT} w-full object-cover transform transition-transform duration-300 hover:scale-110 will-change-transform transform-gpu z-20 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            } ${!open ? "opacity-70 grayscale" : ""}`}
            loading="lazy"
          />
          {/* Overlay when closed */}
          {/* {!open && (
            <div className="absolute inset-0 flex items-center justify-center  rounded-2xl pointer-events-none z-50">
              <div className="text-white text-lg font-semibold">
                🕒 Closed now
              </div>
            </div>
          )} */}
        </div>
        <div className="flex flex-col gap-2 px-4 py-3">
          <div className="flex items-center gap-3">
            <h3 className="text-white text-xl font-semibold">{name}</h3>
          </div>
          <div className="text-sm text-gray-400">
            <span
              className={rating > 4.5 ? "text-yellow-400" : "text-gray-400"}
            >
              ★
            </span>
            {rating} · {deliveryTime} mins · {formatDistance(distance)} away{" "}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">
              {open ? "" : `Opens: ${hours.open}:00`}
            </span>
            {!open && (
              <div
                className={`px-2 py-1 text-xs rounded-full font-medium shadow-md z-30 bg-red-500 text-white`}
              >
                Closed
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

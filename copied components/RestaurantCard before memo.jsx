import React from "react";

export default function RestaurantCard({ name, rating, image, deliveryTime }) {
  return (
    <div className="bg-[var(--color-grey-900)] shadow-md rounded-2xl overflow-hidden  hover:shadow-xl hover:-translate-y-1 transform transition cursor-pointer duration-300 ease">
      <div className="overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={name}
          className="w-full h-80 object-cover transform transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="flex flex-col  gap-2 px-4 py-3">
        <h3 className="text-white text-xl font-semibold">{name}</h3>
        <div className="text-sm text-gray-400">
          <span className={rating > 4.5 ? "text-yellow-400" : "text-gray-400"}>
            ★
          </span>{" "}
          {rating} · {deliveryTime} mins
        </div>
      </div>
    </div>
  );
}

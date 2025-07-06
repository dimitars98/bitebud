import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import RestaurantCard from "../components/RestaurantCard";

export default function RestaurantSlider({ restaurants, title }) {
  if (!restaurants || restaurants.length === 0) return null;

  return (
    <section className="my-8 max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          {title}
        </h2>
        <button
          className="text-sm font-medium text-yellow-500 hover:underline hover:text-yellow-600 transition"
          onClick={() => {
            // Optional: use navigation or state to handle full list view
            console.log("Navigate to all restaurants for:", title);
          }}
        >
          See all
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={3}
        slidesPerGroup={3}
        navigation
        loop={false}
        watchOverflow={true}
        className="pb-4"
      >
        {restaurants.map((rest) => (
          <SwiperSlide key={rest.id} className="!w-auto">
            <RestaurantCard {...rest} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import RestaurantCard from "../RestaurantCard";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { useTranslation } from "react-i18next";

export default function RestaurantSlider({
  restaurants,
  title,
  onSeeAll,
  loading,
}) {
  const { t } = useTranslation();
  return (
    <section className="my-8 max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-extrabold text-(--text-primary) dark:text-(--text-primary)">
          {title}
        </h2>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            className="text-sm font-medium focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand) text-(--brand-primary) hover:text-(--brand-hover) transition"
          >
            {t("common.seeAll")}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner className="py-20" />
        </div>
      ) : restaurants.length === 0 ? (
        <p>{t("home.noneToDisplay")}</p>
      ) : (
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={3}
          slidesPerGroup={3}
          navigation
          loop={false}
          watchOverflow={true}
          speed={600}
          className="pb-4"
        >
          {restaurants.map((rest) => (
            <SwiperSlide key={rest.id} className="!w-72 sm:!w-80">
              <RestaurantCard {...rest} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

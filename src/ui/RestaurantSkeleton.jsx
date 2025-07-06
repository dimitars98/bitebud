import { CARD_WIDTH, IMAGE_HEIGHT } from "../helpers/sizes";

export default function RestaurantCardSkeleton() {
  return (
    <div
      className={`w-full sm:w-80 bg-gray-800 rounded-2xl shadow-md overflow-hidden relative shimmer-wrapper ${CARD_WIDTH}`}
    >
      <div
        className={`rounded-t-2xl bg-gray-700 ${IMAGE_HEIGHT} shimmer`}
      ></div>
      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="h-6 bg-gray-700 rounded w-3/4 shimmer"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2 shimmer"></div>
      </div>
    </div>
  );
}

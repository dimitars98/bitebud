export default function CategoriesSkeleton() {
  return (
    <section className="bg-gray-100 dark:bg-gray-900 px-4 py-3 sm:px-6 lg:px-4 rounded-xl max-w-[1500px] mx-auto mt-4">
      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
        Categories
      </h2>
      <div className="relative flex items-center">
        <div className="flex overflow-x-hidden space-x-3 sm:space-x-4 scrollbar-hide scroll-smooth px-2 sm:px-16">
          {[...Array(26)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center min-w-[80px] select-none"
            >
              {/* Circle shimmer */}
              <div className="w-20 h-20 rounded-full bg-gray-700 shimmer animate-pulse border-2 border-white" />
              {/* Text shimmer */}
              <div className="mt-2 w-16 h-4 rounded bg-gray-600 shimmer animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

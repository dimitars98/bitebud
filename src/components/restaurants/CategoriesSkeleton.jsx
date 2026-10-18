import { useTranslation } from "react-i18next";

// Same shape as <Categories /> so nothing jumps when the real row loads.
export default function CategoriesSkeleton() {
  const { t } = useTranslation();

  return (
    <section className="max-w-[1500px] md:mx-auto mx-3 mt-4 rounded-2xl bg-(--bg-secondary) dark:bg-(--brand-bg-primary) pt-5 pb-3 sm:pt-6 overflow-hidden">
      <div className="px-4 sm:px-7">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-(--text-primary) dark:text-white">
          {t("categories.heading")}
        </h2>
        <div className="hidden sm:block mt-1.5 h-4 w-56 rounded bg-(--bg-secondary-hover) dark:bg-(--brand-bg-secondary-hover) animate-pulse" />
      </div>
      <div className="flex gap-3.5 sm:gap-5 px-4 sm:px-7 pt-4 pb-2" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <div key={i} className="shrink-0 w-[72px] sm:w-[88px] flex flex-col items-center gap-1.5">
            <div className="size-[68px] sm:size-20 rounded-full bg-(--bg-secondary-hover) dark:bg-(--brand-bg-secondary-hover) shimmer animate-pulse" />
            <div className="h-3.5 w-14 rounded bg-(--bg-secondary-hover) dark:bg-(--brand-bg-secondary-hover) animate-pulse" />
            <div className="h-3 w-10 rounded bg-(--bg-secondary-hover) dark:bg-(--brand-bg-secondary-hover) animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}

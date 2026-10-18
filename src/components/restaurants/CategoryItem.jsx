import { memo, useState } from "react";
import { Check, LayoutGrid } from "lucide-react";

const CategoryItem = memo(function CategoryItem({
  name,
  image,
  categoryKey,
  countLabel,
  onClick,
  isActive = false,
  isAll = false,
  disabled = false,
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={isActive}
      data-category={categoryKey}
      className="group snap-start shrink-0 w-[72px] sm:w-[88px] flex flex-col items-center gap-0.5 rounded-xl cursor-pointer disabled:cursor-default disabled:opacity-45 focus:outline-none focus-visible:ring-3 focus-visible:ring-(--brand)"
    >
      <span
        className={`relative mb-1.5 block size-[68px] sm:size-20 rounded-full transition-shadow duration-200 ring-offset-3 ring-offset-(--bg-secondary) dark:ring-offset-(--brand-bg-primary) ${
          isActive
            ? "ring-3 ring-yellow-400"
            : isAll
              ? "ring-1 ring-inset ring-black/10 dark:ring-white/15"
              : "shadow-sm group-hover:ring-2 group-hover:ring-yellow-400/60 group-disabled:ring-0"
        }`}
      >
        {isAll ? (
          <span className="flex size-full items-center justify-center rounded-full bg-white dark:bg-(--brand-bg-secondary) text-(--text-primary) dark:text-white">
            <LayoutGrid size={26} strokeWidth={1.8} aria-hidden="true" />
          </span>
        ) : (
          <span className="block size-full overflow-hidden rounded-full bg-(--bg-secondary-hover) dark:bg-gray-700">
            <img
              src={image}
              alt=""
              loading="lazy"
              width={80}
              height={80}
              onLoad={() => setLoaded(true)}
              className={`size-full object-cover transition duration-300 group-hover:scale-110 group-disabled:scale-100 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
            {!loaded && (
              <span className="absolute inset-0 rounded-full bg-(--bg-secondary-hover) dark:bg-gray-700 animate-pulse" />
            )}
          </span>
        )}

        {isActive && (
          <span className="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full bg-yellow-400 border-2 border-(--bg-secondary) dark:border-(--brand-bg-primary)">
            <Check size={12} strokeWidth={3.5} className="text-black" aria-hidden="true" />
          </span>
        )}
      </span>

      <span
        className={`text-[13px] sm:text-sm leading-tight text-center text-(--text-primary) dark:text-white ${
          isActive ? "font-black" : "font-bold"
        }`}
      >
        {name}
      </span>
      {countLabel && (
        <span className="text-[11px] sm:text-xs leading-tight text-(--text-muted) dark:text-gray-400">
          {countLabel}
        </span>
      )}
    </button>
  );
});

export default CategoryItem;

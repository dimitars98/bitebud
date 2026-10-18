import { memo, useState } from "react";

const CategoryItem = memo(({ name, image, onClick, isActive }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center min-w-[80px] focus:outline-none"
    >
      <div
        className={`
          relative w-20 h-20 rounded-full p-[2px]
          cursor-pointer group overflow-hidden transition-transform
          ${
            isActive
              ? "scale-110 ring-4 ring-yellow-400"
              : "bg-gradient-to-tr from-(--brand) via-(--brand-primary) to-(--brand-hover)"
          }
        `}
      >
        <img
          src={image}
          alt={name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`
            w-full h-full object-cover rounded-full border-2 border-white
            transition-all duration-300
            group-hover:scale-110
            ${loaded ? "opacity-100" : "opacity-0"}
          `}
        />

        {!loaded && (
          <div className="absolute inset-0 bg-(--bg-secondary) dark:bg-gray-700 animate-pulse rounded-full" />
        )}
      </div>

      <span
        className={`
          mt-2 text-sm text-center tracking-wide font-semibold transition-colors
          ${
            isActive
              ? "text-yellow-500"
              : "text-(--text-primary) dark:text-(--text-primary)"
          }
        `}
      >
        {name}
      </span>
    </button>
  );
});

export default CategoryItem;

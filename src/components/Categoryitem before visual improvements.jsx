import { memo } from "react";

const CategoryItem = memo(({ name, image }) => (
  <div className="flex flex-col items-center min-w-[80px]">
    <img
      src={image}
      alt={name}
      className="w-20 h-20 rounded-full object-cover border-2 border-white cursor-pointer"
      loading="lazy"
    />
    <span className="mt-2 text-gray-900 dark:text-gray-50 text-sm text-center cursor-pointer">
      {name}
    </span>
  </div>
));

export default CategoryItem;

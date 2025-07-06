import { memo } from "react";

const CategoryItem = memo(({ name, image, onClick }) => (
  <div onClick={onClick} className="flex flex-col items-center min-w-[80px]">
    <div className="relative w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 cursor-pointer group">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover rounded-full border-2 border-white transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      {/* <div className="absolute bottom-0 w-full bg-black bg-opacity-40 backdrop-blur-sm text-white text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-full">
        {name}
      </div> */}
    </div>
    <span className="mt-2 text-gray-900 dark:text-gray-50 text-sm text-center cursor-pointer tracking-wide font-semibold">
      {name}
    </span>
  </div>
));

export default CategoryItem;

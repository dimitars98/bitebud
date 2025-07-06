import React, { useRef } from "react";

const categories = [
  {
    id: 1,
    name: "Pizza",
    image:
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 2,
    name: "Burger",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 3,
    name: "Sushi",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 4,
    name: "Salad",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 5,
    name: "Dessert",
    image:
      "https://images.unsplash.com/photo-1505253210343-c67b68ac1b46?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 6,
    name: "Drinks",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 7,
    name: "Barbecue",
    image:
      "https://images.unsplash.com/photo-1558030006-4305d2e4f099?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 8,
    name: "Mexican",
    image:
      "https://images.unsplash.com/photo-1600891965050-7c9b15b2d1a4?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 9,
    name: "Healthy",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 10,
    name: "Pasta",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 11,
    name: "Asian",
    image:
      "https://images.unsplash.com/photo-1609758124212-45f5e5d7e28b?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 12,
    name: "Turkish",
    image:
      "https://images.unsplash.com/photo-1638536538700-67966c2a5e93?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 13,
    name: "Arabic",
    image:
      "https://images.unsplash.com/photo-1605276374104-de6330128bfc?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 14,
    name: "Vegan",
    image:
      "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 15,
    name: "Vegetarian",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 16,
    name: "Chinese",
    image:
      "https://images.unsplash.com/photo-1580656011801-945f6c8be90c?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 17,
    name: "Macedonian",
    image:
      "https://images.unsplash.com/photo-1576419750645-7b09b159d0c7?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 18,
    name: "Greek",
    image:
      "https://images.unsplash.com/photo-1604917877939-43d81e6503ef?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 19,
    name: "Mediterranean",
    image:
      "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 20,
    name: "Fish",
    image:
      "https://images.unsplash.com/photo-1613142956503-4bd6c0e1c9b3?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 21,
    name: "Bakery",
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e0054842b?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 22,
    name: "Sandwiches",
    image:
      "https://images.unsplash.com/photo-1606755962773-90e6915a30c3?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 23,
    name: "Home Cooking",
    image:
      "https://images.unsplash.com/photo-1606755962858-5f6e1e194b63?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 24,
    name: "Tortilla Wraps",
    image:
      "https://images.unsplash.com/photo-1630340380162-236ae55e84f0?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 25,
    name: "Ice Cream",
    image:
      "https://images.unsplash.com/photo-1505253210343-c67b68ac1b46?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: 26,
    name: "Cakes",
    image:
      "https://images.unsplash.com/photo-1602029225115-0c6c22e0c225?auto=format&fit=crop&w=80&q=80",
  },
];

export default function Hero() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const scrollAmount = 100; // pixels per click
    if (direction === "left") {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[var(--color-grey-900)] p-4">
      <h2 className="text-2xl font-extrabold text-white mb-6">Categories</h2>
      <div className="relative flex items-center">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="w-14 h-14 flex items-center justify-center absolute left-0 z-10 bg-gray-700 bg-opacity-50 rounded-full text-white hover:bg-opacity-80 cursor-pointer"
          aria-label="Scroll left"
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "3rem" }}
          >
            chevron_left
          </span>
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth px-18"
          style={{ scrollBehavior: "smooth" }}
        >
          {categories.map(({ id, name, image }) => (
            <div key={id} className="flex flex-col items-center min-w-[80px]">
              <img
                src={image}
                alt={name}
                className="w-20 h-20 rounded-full object-cover border-2 border-white cursor-pointer"
              />
              <span className="mt-2 text-white text-sm">{name}</span>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="w-14 h-14 flex items-center justify-center absolute right-0 z-10 bg-gray-700 bg-opacity-50 rounded-full text-white hover:bg-opacity-80 cursor-pointer"
          aria-label="Scroll right"
        >
          <span
            className="material-symbols-rounded"
            style={{ fontSize: "3rem" }}
          >
            chevron_right
          </span>
        </button>
      </div>
    </section>
  );
}

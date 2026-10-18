import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../../hooks/useIsMobile";

// Quotes are translated: testimonials.quotes in the locale files (same order).
const testimonials = [
  {
    author: "John Peterson",
    photo:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&q=80&w=600",
  },
  {
    author: "Emily Carter",
    photo:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&q=80&w=600",
  },
  {
    author: "Marcus Lee",
    photo:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&q=80&w=600",
  },
  {
    author: "Sophia Rivera",
    photo:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&q=80&w=600",
  },
  {
    author: "David Kim",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&q=80&w=600",
  },
  {
    author: "Olivia Stone",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&q=80&w=600",
  },
];

export default function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const itemsPerSlide = useIsMobile() ? 1 : 2;
  const { t } = useTranslation();
  const quotes = t("testimonials.quotes", { returnObjects: true });

  const next = () =>
    setIndex((i) =>
      i + itemsPerSlide < testimonials.length ? i + itemsPerSlide : 0
    );

  const prev = () =>
    setIndex((i) =>
      i - itemsPerSlide >= 0
        ? i - itemsPerSlide
        : testimonials.length - itemsPerSlide
    );

  const visibleTestimonials = testimonials
    .map((item, i) => ({ ...item, text: quotes[i] }))
    .slice(index, index + itemsPerSlide);

  return (
    <section className="py-24 h-[500px] bg-white dark:bg-(--brand-bg-primary)">
      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={prev}
            aria-label={t("testimonials.prev")}
            className="absolute left-0 md:-left-16 p-3 rounded-full
             bg-white dark:bg-(--brand-bg-secondary-hover) 
                      shadow-none dark:shadow-lg 
                      border border-(--border-primary) dark:border-slate-600 
                      hover:scale-110 transition z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Animated Slide Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.45 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
            >
              {visibleTestimonials.map((review, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-(--brand-bg-secondary) rounded-3xl 
                           shadow-[0_2px_8px_rgba(120,120,150,0.15)] 
                           dark:shadow-xl 
                           border border-(--border-primary) dark:border-slate-700 
                           p-10 text-center flex flex-col items-center relative"
                >
                  <Quote className="absolute top-8 left-8 text-gray-300 dark:text-gray-600 w-10 h-10 opacity-50" />

                  <img
                    src={review.photo}
                    alt={review.author}
                    className="w-20 h-20 rounded-full object-cover mb-4 
                             shadow-[0_2px_6px_rgba(120,120,150,0.2)] 
                             dark:shadow-md"
                  />

                  <p className="text-lg italic text-gray-700 dark:text-(--text-secondary) leading-relaxed">
                    “{review.text}”
                  </p>

                  <div className="mt-4 text-(--text-secondary) dark:text-(--text-muted) text-md font-medium">
                    — {review.author}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Right Arrow */}
          <button
            onClick={next}
            aria-label={t("testimonials.next")}
            className="absolute right-0 md:-right-16 p-3 rounded-full 
                     bg-white dark:bg-(--brand-bg-secondary-hover)
                     shadow-none dark:shadow-lg 
                     border border-(--border-primary) dark:border-slate-600 
                     hover:scale-110 transition z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

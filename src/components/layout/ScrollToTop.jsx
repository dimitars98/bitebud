import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-4 bg-white dark:bg-(--brand-bg-secondary) rounded-full shadow-lg hover:bg-(--bg-secondary) dark:hover:bg-(--brand-bg-secondary-hover) transition z-50"
      aria-label={t("common.scrollTop")}
    >
      <ChevronUp className="w-6 h-6 text-(--text-secondary) dark:text-(--text-primary)" />
    </button>
  );
}

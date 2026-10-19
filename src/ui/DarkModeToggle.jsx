import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDarkMode } from "../hooks/useDarkMode";

export default function DarkModeToggle() {
  const { t } = useTranslation();
  // shared with the dark-mode row in the mobile menu
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      aria-label={darkMode ? t("theme.toLight") : t("theme.toDark")}
      className="relative w-14 h-8 flex items-center rounded-full p-1 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand) bg-gray-300 dark:bg-(--brand-bg-secondary-hover) cursor-pointer"
    >
      {/* Slider circle */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="absolute w-6 h-6 bg-(--bg-main) dark:bg-(--brand-bg-primary) rounded-full shadow-md flex items-center justify-center"
        style={{
          left: darkMode ? "calc(100% - 1.5rem - 4px)" : "4px",
        }}
      >
        {darkMode ? (
          <Moon className="w-3 h-3 text-(--text-muted)" />
        ) : (
          <Sun className="w-3 h-3 text-gray-500" />
        )}
      </motion.div>
    </button>
  );
}

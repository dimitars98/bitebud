import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { useTranslation } from "react-i18next";

export default function CustomLabelDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  // Saved in English; shown via address.labels.<label>
  const labels = ["Home", "Work", "Other"];
  const { t } = useTranslation();
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setOpen(false), { enabled: open });

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium mb-1">{t("address.labelTitle")}</label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full text-left border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-(--brand) bg-(--bg-main) dark:bg-(--brand-bg-secondary)"
      >
        {t(`address.labels.${value}`, { defaultValue: value })}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-1 w-full bg-(--bg-main) dark:bg-(--brand-bg-secondary) border border-(--border-primary) dark:border-(--border-primary) rounded-lg shadow-lg overflow-hidden"
          >
            {labels.map((label) => (
              <li
                key={label}
                onClick={() => {
                  onChange(label);
                  setOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-(--brand-soft) dark:hover:bg-(--brand-bg-secondary-hover) ${
                  label === value
                    ? "bg-amber-50 dark:bg-(--brand-bg-secondary-hover) font-semibold"
                    : ""
                }`}
              >
                {t(`address.labels.${label}`)}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

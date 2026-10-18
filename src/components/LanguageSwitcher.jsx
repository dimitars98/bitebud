import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";
import { useClickOutside } from "../hooks/useClickOutside";
import { useEscapeKey } from "../hooks/useEscapeKey";

// Compact round button (same size as the currency selector) showing the
// current language code; opens a small list of languages in their own names.
export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = i18n.resolvedLanguage || "en";

  const close = () => setOpen(false);
  useClickOutside(ref, close, { enabled: open });
  useEscapeKey(close, open);

  const choose = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("common.language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-(--bg-secondary) dark:bg-(--brand-bg-secondary) text-(--text-primary) dark:text-(--text-muted) text-[13px] font-extrabold tracking-wide uppercase shadow-sm cursor-pointer hover:text-(--brand-primary) transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand-primary)"
      >
        {current}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t("common.language")}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 py-1.5 z-50 rounded-xl bg-white dark:bg-(--brand-bg-secondary) shadow-lg border border-(--border-primary)"
          >
            {LANGUAGES.map(({ code, label }) => {
              const selected = code === current;
              return (
                <li key={code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    lang={code}
                    onClick={() => choose(code)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2 text-sm text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-(--brand-bg-secondary-hover) ${
                      selected
                        ? "font-bold text-(--text-primary) dark:text-white"
                        : "text-(--text-primary) dark:text-(--text-muted)"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 text-xs font-extrabold uppercase text-slate-400">
                        {code}
                      </span>
                      {label}
                    </span>
                    {selected && (
                      <span
                        className="material-symbols-rounded text-lg! leading-none text-(--brand-primary)"
                        aria-hidden="true"
                      >
                        check
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

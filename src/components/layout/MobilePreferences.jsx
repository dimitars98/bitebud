import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, CircleDollarSign, Globe, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useDarkMode } from "../../hooks/useDarkMode";
import { LANGUAGES } from "../../i18n";
import {
  CURRENCY_SYMBOLS,
  SUPPORTED_CURRENCIES,
} from "../../constants/currencies";

const rowClass =
  "flex h-13 w-full items-center gap-3.5 px-1 text-left text-[15px] text-(--text-primary) dark:text-white cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand)";

// A row that opens a short list of choices right below it.
function ChoiceRow({ id, icon: Icon, label, value, open, onToggle, children }) {
  return (
    <div className="border-t border-(--border-primary) first:border-t-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className={rowClass}
      >
        <Icon size={20} aria-hidden="true" />
        <span className="flex-1">{label}</span>
        <span className="text-(--text-muted) dark:text-gray-400">{value}</span>
        <ChevronRight
          size={18}
          aria-hidden="true"
          className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="radiogroup"
            aria-label={label}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-2 pl-9">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Choice({ selected, onSelect, children, lang }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      lang={lang}
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm cursor-pointer hover:bg-(--bg-secondary) dark:hover:bg-(--brand-bg-secondary) ${
        selected
          ? "font-semibold text-(--text-primary) dark:text-white"
          : "text-(--text-primary) dark:text-(--text-muted)"
      }`}
    >
      {children}
      {selected && (
        <Check size={16} strokeWidth={2.5} className="text-(--brand-primary)" aria-hidden="true" />
      )}
    </button>
  );
}

/** Dark mode, currency and language, as rows in the mobile menu. */
export default function MobilePreferences() {
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();
  const [isDark, setDarkMode] = useDarkMode();
  const [openRow, setOpenRow] = useState(null); // "currency" | "language" | null

  const toggleRow = (row) => setOpenRow((current) => (current === row ? null : row));

  const currentLanguage = i18n.resolvedLanguage || "en";
  const languageLabel =
    LANGUAGES.find((l) => l.code === currentLanguage)?.label ?? currentLanguage;

  return (
    <div className="flex flex-col">
      <span className="px-1 pb-1.5 pt-1 text-xs font-semibold uppercase tracking-[0.08em] text-(--text-muted) dark:text-gray-400">
        {t("nav.preferences")}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={() => setDarkMode(!isDark)}
        className={rowClass}
      >
        <Moon size={20} aria-hidden="true" />
        <span className="flex-1">{t("nav.darkMode")}</span>
        <span
          aria-hidden="true"
          className={`flex h-7 w-[46px] items-center rounded-full p-[3px] transition-colors duration-200 ${
            isDark ? "justify-end bg-(--brand-primary)" : "justify-start bg-gray-300"
          }`}
        >
          <span className="size-[22px] rounded-full bg-white shadow-sm" />
        </span>
      </button>

      <ChoiceRow
        id="mobile-currency-options"
        icon={CircleDollarSign}
        label={t("nav.currency")}
        value={`${currency} ${CURRENCY_SYMBOLS[currency] ?? ""}`.trim()}
        open={openRow === "currency"}
        onToggle={() => toggleRow("currency")}
      >
        {SUPPORTED_CURRENCIES.map((code) => (
          <Choice
            key={code}
            selected={code === currency}
            onSelect={() => {
              setCurrency(code);
              setOpenRow(null);
            }}
          >
            <span>
              {t(`currency.${code}`)}{" "}
              <span className="text-(--text-muted) dark:text-gray-400">
                {CURRENCY_SYMBOLS[code]}
              </span>
            </span>
          </Choice>
        ))}
      </ChoiceRow>

      <ChoiceRow
        id="mobile-language-options"
        icon={Globe}
        label={t("common.language")}
        value={languageLabel}
        open={openRow === "language"}
        onToggle={() => toggleRow("language")}
      >
        {LANGUAGES.map(({ code, label }) => (
          <Choice
            key={code}
            lang={code}
            selected={code === currentLanguage}
            onSelect={() => {
              i18n.changeLanguage(code);
              setOpenRow(null);
            }}
          >
            {label}
          </Choice>
        ))}
      </ChoiceRow>
    </div>
  );
}

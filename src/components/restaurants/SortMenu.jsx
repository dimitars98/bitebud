import { useRef, useState } from "react";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useEscapeKey } from "../../hooks/useEscapeKey";

/**
 * "Sort: Recommended ▾" button with a small menu of sort options.
 *
 *   <SortMenu value={sort} onChange={setSort} options={["recommended", "rating"]} />
 *
 * Labels come from `sort.options.<value>` in the translation files.
 */
export default function SortMenu({ value, onChange, options, className = "" }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const close = () => setOpen(false);
  useClickOutside(wrapperRef, close, { enabled: open });
  useEscapeKey(() => {
    close();
    buttonRef.current?.focus();
  }, open);

  const getItems = () => [
    ...(menuRef.current?.querySelectorAll('[role="menuitemradio"]') ?? []),
  ];

  const focusItem = (index) => {
    const items = getItems();
    if (items.length) items[(index + items.length) % items.length].focus();
  };

  const openMenu = () => {
    setOpen(true);
    // focus the selected option once the menu has rendered
    requestAnimationFrame(() => focusItem(Math.max(0, options.indexOf(value))));
  };

  const handleMenuKeyDown = (e) => {
    const index = getItems().indexOf(document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusItem(index + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusItem(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusItem(getItems().length - 1);
    } else if (e.key === "Tab") {
      close();
    }
  };

  const pick = (option) => {
    onChange(option);
    close();
    buttonRef.current?.focus();
  };

  const currentLabel = t(`sort.options.${value}`);

  return (
    <div ref={wrapperRef} className={`relative shrink-0 ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? close() : openMenu())}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("sort.ariaLabel", { option: currentLabel })}
        className="flex items-center gap-2 h-11 pl-3.5 pr-3 rounded-full text-sm bg-(--bg-secondary) hover:bg-(--bg-secondary-hover) dark:bg-(--brand-bg-secondary) dark:hover:bg-(--brand-bg-secondary-hover) text-(--text-primary) dark:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-(--brand)"
      >
        <ArrowUpDown size={16} aria-hidden="true" />
        <span className="hidden sm:inline font-semibold text-(--text-muted) dark:text-gray-400">
          {t("sort.label")}:
        </span>
        <span className="font-bold">{currentLabel}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={t("sort.label")}
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 top-full z-30 mt-2 min-w-56 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-(--brand-bg-secondary) p-1.5 shadow-xl"
        >
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => pick(option)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm cursor-pointer outline-none hover:bg-(--bg-secondary) focus-visible:bg-(--bg-secondary) dark:hover:bg-(--brand-bg-secondary-hover) dark:focus-visible:bg-(--brand-bg-secondary-hover) ${
                  selected
                    ? "font-bold text-(--text-primary) dark:text-white"
                    : "font-semibold text-(--text-secondary) dark:text-gray-300"
                }`}
              >
                {t(`sort.options.${option}`)}
                {selected && (
                  <Check size={16} strokeWidth={3} className="text-yellow-500" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

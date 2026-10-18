import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "../hooks/useIsMobile";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * Reusable dropdown component.
 *
 * Example usage:
 * <Dropdown
 *   value={selected}
 *   onChange={setSelected}
 *   options={[{ value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }]}
 *   mobileOptions={[{ value: 'en', label: 'EN' }, { value: 'fr', label: 'FR' }]}
 *   placeholder="Select language"
 *   buttonClassName="border bg-white"
 * />
 */
export default function Dropdown({
  value,
  onChange,
  options = [],
  mobileOptions = [],
  className = "",
  buttonClassName = "",
  dropdownClassName = "",
  optionClassName = "",
  icon = null,
  placeholder = "Select...",
  width = "w-[140px]", // default width, can override
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const usedOptions = useMemo(
    () => (isMobile && mobileOptions.length ? mobileOptions : options),
    [isMobile, mobileOptions, options]
  );

  const selectedOption = usedOptions.find((o) => o.value === value);

  return (
    <div className={`relative ${className} w-fit md:min-w-[140px]`}>
      {/* Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex justify-between items-center px-3 py-2 rounded-md text-gray-950 dark:text-gray-50 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-(--dark-input-bg) focus:outline-none cursor-pointer ${buttonClassName}`}
      >
        {icon ? (
          <span className="flex items-center gap-2">
            {icon}
            <span className="text-sm">
              {selectedOption?.label || placeholder}
            </span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>{selectedOption?.label || placeholder}</span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay to close on outside click */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-transparent z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Options */}
            <motion.ul
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className={`absolute left-0 w-full mt-1 py-2 text-gray-950 dark:text-gray-50 rounded-md shadow-md z-100 border text-sm border-zinc-100 dark:border-zinc-800 bg-white dark:bg-(--dark-input-bg) ${dropdownClassName}`}
            >
              {usedOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    if (option.disabled) return; // ignore clicks
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 ${
                    option.disabled
                      ? "text-gray-400 bg-(--bg-secondary) dark:bg-(--brand-bg-secondary) cursor-default"
                      : "bg-(--brand-bg-primary) hover:bg-gray-100 dark:hover:bg-(--brand-bg-secondary) cursor-pointer"
                  } ${
                    option.value === value
                      ? "font-semibold text-(--main-second)"
                      : "text-gray-850 dark:text-gray-50"
                  } ${optionClassName}`}
                >
                  {option.label}
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

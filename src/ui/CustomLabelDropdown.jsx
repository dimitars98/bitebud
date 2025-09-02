import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function CustomLabelDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const labels = ["Home", "Work", "Other"];
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium mb-1">Address label</label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full text-left border border-gray-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-400 bg-white dark:bg-gray-800"
      >
        {value}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            {labels.map((label) => (
              <li
                key={label}
                onClick={() => {
                  onChange(label);
                  setOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-amber-100 dark:hover:bg-gray-700 ${
                  label === value
                    ? "bg-amber-50 dark:bg-gray-700 font-semibold"
                    : ""
                }`}
              >
                {label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

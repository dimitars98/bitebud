// src/components/MobileCurrencySelector.jsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CurrencySelector from "./CurrencySelector";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useClickOutside } from "../../hooks/useClickOutside";

export default function MobileCurrencySelector() {
  const [open, setOpen] = useState(false);
  const { currency } = useCurrency();
  const ref = useRef(null);

  // Map currency codes to symbols
  const symbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    AUD: "A$",
    INR: "₹",
  };

  useClickOutside(ref, () => setOpen(false), { enabled: open });

  return (
    <div className="relative" ref={ref}>
      {/* Compact icon button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-(--bg-secondary) dark:bg-(--brand-bg-secondary) shadow-sm"
      >
        <span className="text-lg font-bold">{symbols[currency] || "$"}</span>
      </button>

      {/* Animated dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0, originY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0, originY: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute left-1/2 -translate-x-1/2 origin-top mt-2 w-40 z-50"
          >
            <CurrencySelector />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

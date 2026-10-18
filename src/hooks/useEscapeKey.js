import { useEffect, useRef } from "react";

/**
 * Calls `onEscape` when the Escape key is pressed, while `enabled` is true.
 *
 *   useEscapeKey(onClose, isOpen);
 */
export function useEscapeKey(onEscape, enabled = true) {
  const handlerRef = useRef(onEscape);
  useEffect(() => {
    handlerRef.current = onEscape;
  });

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handlerRef.current?.(e);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}

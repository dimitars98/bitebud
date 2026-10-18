import { useEffect, useRef } from "react";

/**
 * Calls `onOutside` when the user presses anywhere outside the given element(s).
 *
 *   const menuRef = useRef(null);
 *   useClickOutside([menuRef, buttonRef], () => setOpen(false), { enabled: open });
 *
 * - `refs`: one ref or an array of refs that count as "inside" (pass the button
 *   that opens the menu too, otherwise pressing it closes the menu and its own
 *   onClick reopens it straight away).
 * - `enabled`: only listen while true (e.g. while the menu is open).
 * - `ignore`: a CSS selector for elements outside the refs that should not
 *   close it either, e.g. "[data-cart-undo]" for a toast button.
 *
 * Uses pointerdown, so mouse, touch and pen all behave the same.
 */
export function useClickOutside(refs, onOutside, { enabled = true, ignore } = {}) {
  // Latest values in refs, so callers can pass inline functions/arrays
  // without re-attaching the listener on every render.
  const handlerRef = useRef(onOutside);
  const refsRef = useRef(refs);
  useEffect(() => {
    handlerRef.current = onOutside;
    refsRef.current = refs;
  });

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (e) => {
      if (ignore && e.target.closest?.(ignore)) return;
      const list = Array.isArray(refsRef.current) ? refsRef.current : [refsRef.current];
      if (list.some((ref) => ref?.current?.contains(e.target))) return;
      handlerRef.current?.(e);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [enabled, ignore]);
}

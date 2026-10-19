import { useSyncExternalStore } from "react";

// One shared dark-mode value for the whole app, so every toggle (the desktop
// switch, the row in the mobile menu) shows the same state.
// Stored in localStorage under "theme"; falls back to the system setting.
const STORAGE_KEY = "theme";
const listeners = new Set();

function readInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved === "dark";
  } catch {
    // storage blocked: use the system setting
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

let isDark = typeof window !== "undefined" ? readInitial() : false;
if (typeof document !== "undefined") {
  document.documentElement.classList.toggle("dark", isDark);
}

export function setDarkMode(value) {
  isDark = value;
  document.documentElement.classList.toggle("dark", value);
  try {
    localStorage.setItem(STORAGE_KEY, value ? "dark" : "light");
  } catch {
    // not saved, but still applied for this visit
  }
  listeners.forEach((listener) => listener());
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** const [isDark, setDarkMode] = useDarkMode(); */
export function useDarkMode() {
  const dark = useSyncExternalStore(subscribe, () => isDark, () => false);
  return [dark, setDarkMode];
}

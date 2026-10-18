// i18next setup. Import this once (main.jsx) before the app renders.
// Translations live in ./locales/<code>.json, one file per language.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import de from "./locales/de.json";
import mk from "./locales/mk.json";

// Shown in the language switcher, always in their own language.
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "mk", label: "Македонски" },
];

export const LANGUAGE_STORAGE_KEY = "bitebud_lang";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      mk: { translation: mk },
    },
    supportedLngs: LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true, // "de-AT" -> "de"
    fallbackLng: "en", // any key missing in de/mk falls back to English
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      // A choice made in the switcher wins, then the browser's language.
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

// Keep <html lang> correct for screen readers, hyphenation and fonts.
const syncHtmlLang = (lng) => {
  document.documentElement.lang = (lng || "en").split("-")[0];
};
syncHtmlLang(i18n.resolvedLanguage);
i18n.on("languageChanged", syncHtmlLang);

export default i18n;

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setVisible(true);
  }, []);

  const handleChoice = (value) => {
    localStorage.setItem("cookieConsent", value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-(--bg-main) dark:bg-(--brand-bg-secondary-hover) text-(--bg-main) px-6 py-5 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-(--text-primary) dark:text-(--text-secondary) text-sm md:text-base text-center md:text-left">
          {t("cookies.text")}
        </p>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          <button
            onClick={() => handleChoice("necessary")}
            className="bg-gray-700 dark:bg-(--brand-bg-secondary) hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm transition"
          >
            {t("cookies.necessary")}
          </button>
          <button
            onClick={() => handleChoice("rejected")}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full text-sm transition"
          >
            {t("cookies.reject")}
          </button>
          <button
            onClick={() => handleChoice("accepted")}
            className="bg-(--brand) hover:bg-(--brand-primary) text-black font-semibold px-4 py-2 rounded-full text-sm transition"
          >
            {t("cookies.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AccountCreated() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/explore");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex justify-center bg-(--bg-main) dark:bg-(--brand-bg-secondary) p-4">
      <div className="h-fit bg-(--bg-primary) mt-40 dark:bg-(--brand-bg-secondary-hover) rounded-lg p-8 shadow-md text-center max-w-md">
        <h1 className="text-2xl font-semibold mb-4 text-(--text-primary) dark:text-white">
          {t("accountCreated.title")}
        </h1>
        {/* <p className="text-green-700 dark:text-green-200">
          You will be redirected to the homepage shortly...
        </p> */}
        <span className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" fill="#22c55e" />
            <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="3" />
          </svg>
        </span>
      </div>
    </div>
  );
}

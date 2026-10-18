import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (orderId) {
        navigate(`/order-tracking/${orderId}`);
      } else {
        navigate("/");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, orderId]);

  return (
    <div className="dark:text-(--text-primary) max-w-xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">{t("confirmation.thanks")}</h1>
      <p className="mb-6">{t("confirmation.placed")}</p>
      <p>{t("confirmation.redirecting")}</p>
    </div>
  );
}

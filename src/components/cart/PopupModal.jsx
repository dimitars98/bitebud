import { X } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useTranslation } from "react-i18next";

export default function PopupModal({ isOpen, onClose, message }) {
  const { clearCart } = useCart();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full relative">
        <div
          className="absolute top-3 right-3 cursor-pointer"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </div>

        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {t("cart.notice")}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              clearCart();
              onClose();
            }}
            className="px-4 py-2 bg-(--brand-primary) text-white rounded hover:bg-(--brand-hover)"
          >
            {t("cart.clear")}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

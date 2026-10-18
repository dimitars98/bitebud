import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/cn";
import Modal from "../ui/Modal";
import { useTranslation } from "react-i18next";
import { MAX_ITEM_QTY } from "../helpers/cartTotals";

export default function MenuItemModal({ item, isOpen, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState([]);
  const { t } = useTranslation();

  function toggleExtra(extra) {
    setExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra],
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.CloseButton />
      <div className="mt-8">
        <Modal.Header>
          <div className="flex items-start gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body>
          {/* Extras */}
          {item.extras?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">{t("itemModal.extras")}</h3>

              <div className="flex flex-col gap-2">
                {item.extras.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={extras.includes(extra)}
                        onChange={() => toggleExtra(extra)}
                        className="accent-amber-400"
                      />
                      <span>{extra.name}</span>
                    </div>

                    <span className="text-sm text-gray-500">
                      +{extra.price.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between mt-6">
            <span className="font-semibold">{t("itemModal.quantity")}</span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label={t("itemModal.decrease")}
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              >
                <Minus size={16} />
              </button>

              <span className="font-medium">{quantity}</span>

              <button
                onClick={() => setQuantity((q) => Math.min(MAX_ITEM_QTY, q + 1))}
                aria-label={t("itemModal.increase")}
                className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            onClick={() => {
              onAddToCart({
                ...item,
                quantity,
                extras,
              });
              onClose();
            }}
            className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-black font-semibold py-3 rounded-xl transition"
          >
            {t("itemModal.add")}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
}

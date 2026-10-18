import { useFilterContext } from "../contexts/FilterContext";
import Modal from "../ui/Modal";
import { useTranslation } from "react-i18next";

const TAGS = ["Vegan", "Vegetarian", "Free delivery"];

export default function FilterModal({ isOpen, onClose }) {
  const { filters, setFilters } = useFilterContext();
  const { t } = useTranslation();

  const toggleTag = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((existing) => existing !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.CloseButton />
      <div className="w-full sm:w-[360px] max-h-[80vh] flex flex-col mx-auto mt-8">
        {/* Header */}
        <Modal.Header>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("filtersModal.title")}</h2>
          </div>
        </Modal.Header>

        {/* Body */}
        <Modal.Body className="flex-1 overflow-y-auto space-y-8">
          {/* Distance */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">
                {t("filtersModal.maxDistance")}
              </label>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                {filters.maxDistance} km
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={150}
              step={0.5}
              value={filters.maxDistance}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  maxDistance: parseFloat(e.target.value),
                }))
              }
              className="
                w-full h-2 rounded-full
                accent-yellow-500
                cursor-pointer
              "
            />
          </section>

          {/* Tags */}
          <section>
            <label className="block text-sm font-medium mb-3">
              {t("filtersModal.tags")}
            </label>

            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const active = filters.tags.includes(tag);

                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium
                      transition-all
                      border
                      ${
                        active
                          ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                          : "bg-transparent border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    {t(`tags.${tag}`, { defaultValue: tag })}
                  </button>
                );
              })}
            </div>
          </section>
        </Modal.Body>

        {/* Footer / Actions */}
        <div className="sticky bottom-0 p-4">
          <button
            onClick={onClose}
            className="
              w-full
              bg-yellow-500 hover:bg-yellow-600
              text-white font-medium
              py-3 rounded-xl
              transition
            "
          >
            {t("filtersModal.apply")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

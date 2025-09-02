import Modal from "./Modal"; // your reusable modal

const TAGS = ["Vegan", "Vegetarian", "Free delivery"];

export default function FilterModal({ isOpen, onClose, filters, setFilters }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.CloseButton />
      <div className="w-full sm:w-[320px] overflow-y-auto relative">
        <Modal.Header>Filters</Modal.Header>

        <Modal.Body>
          {/* Distance Slider */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 dark:text-white">
              Max Distance (km)
            </label>
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
              className="w-full"
            />
            <div className="text-sm text-gray-500 dark:text-gray-300">
              {filters.maxDistance} km
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Tags
            </label>
            {TAGS.map((tag) => (
              <label
                key={tag}
                className="flex items-center space-x-2 mb-2 text-sm dark:text-white"
              >
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag)}
                  onChange={(e) => {
                    setFilters((prev) => ({
                      ...prev,
                      tags: e.target.checked
                        ? [...prev.tags, tag]
                        : prev.tags.filter((t) => t !== tag),
                    }));
                  }}
                />
                <span>{tag}</span>
              </label>
            ))}
          </div>
        </Modal.Body>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 ease-in"
        >
          Apply Filters
        </button>
      </div>
    </Modal>
  );
}

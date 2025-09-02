import { useEffect, useRef } from "react";

/**
 * @param {Object[]} menuItems - List of menu options
 * @param {string} menuItems[].label - Text for the option
 * @param {function} menuItems[].onClick - Callback function
 * @param {boolean} [menuItems[].danger] - Optional. If true, render in red
 */
export default function DropdownActionsMenu({
  menuItems = [],
  isOpen,
  onOpen,
  onClose,
}) {
  const dropdownRef = useRef();

  const toggleDropdown = () => {
    if (isOpen) {
      onClose?.();
    } else {
      onOpen?.();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex"
      >
        <span className="material-symbols-rounded">more_vert</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 z-20 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md w-36">
          {menuItems.map(({ label, onClick, danger = false, icon }, index) => (
            <button
              key={index}
              onClick={() => {
                onClick?.();
              }}
              className={`flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                danger ? "text-red-600 dark:text-red-400" : ""
              }`}
            >
              {icon && (
                <span className="material-symbols-rounded text-[20px] leading-none relative top-[1px]">
                  {icon}
                </span>
              )}
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// components/Modal.jsx
import React, { useRef, useEffect } from "react";

export default function Modal({ children, isOpen, onClose, isVisible }) {
  const modalContentRef = useRef(null);

  useEffect(() => {
    // Only attach listener if the modal is actually open
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target)
      ) {
        onClose(); // Call the close handler passed from parent
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]); // Re-run if isOpen or onClose changes

  // Don't render anything if not open, to prevent unnecessary DOM elements
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {/* The backdrop itself doesn't need an onClick now, as the document listener handles it */}
      <div
        className={`fixed inset-0 z-[55] backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Modal content container */}
      <div className="fixed inset-0 z-[60] flex justify-center items-center p-4">
        {/* Actual modal content, with ref for click outside detection */}
        <div
          ref={modalContentRef}
          className={`bg-white dark:bg-[var(--color-grey-800)] rounded-xl shadow-lg px-6 py-12 w-full max-w-md relative transform transition-all duration-300 ease-out ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          // IMPORTANT: Do NOT add onClick={(e) => e.stopPropagation()} here.
          // The document listener handles everything and contains() is enough.
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-3 rounded-full text-gray-500 hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-[var(--color-grey-700)] cursor-pointer  text-2xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>

          {children}
        </div>
      </div>
    </>
  );
}

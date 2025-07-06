import { useRef } from "react";

export default function Modal({ children, onClose }) {
  const modalContentRef = useRef(null);

  const handleBackdropClick = (e) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target)
    ) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop with slight blur */}
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 z-40 bg-transparent backdrop-filter backdrop-blur-sm"
      ></div>

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-white rounded-lg shadow-lg w-full max-w-md relative p-6"
          ref={modalContentRef}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 cursor-pointer"
            aria-label="Close modal"
          >
            <span class="material-symbols-rounded">close</span>
          </button>
          {children}
        </div>
      </div>
    </>
  );
}

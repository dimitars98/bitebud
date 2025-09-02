import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const ModalContext = createContext(null);

export default function Modal({ isOpen, onClose, children }) {
  const contentRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);

  const handleExitComplete = () => {
    if (!isOpen) setHasMounted(false);
  };

  useEffect(() => {
    if (isOpen) {
      setHasMounted(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.classList.add("modal-open");
      document.body.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`
      );
    }

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("--scrollbar-width");
    };
  }, [isOpen]);

  if (!hasMounted) return null;

  return createPortal(
    <ModalContext.Provider value={{ onClose }}>
      <AnimatePresence onExitComplete={handleExitComplete}>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[55] backdrop-blur-sm bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                key="modal"
                ref={contentRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 relative"
              >
                {children}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </ModalContext.Provider>,
    document.body
  );
}

Modal.Header = function ModalHeader({ children }) {
  return (
    <div className="text-xl font-semibold mb-4 dark:text-white">{children}</div>
  );
};

Modal.Body = function ModalBody({ children }) {
  return <div className="h-fit mb-4 dark:text-white">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }) {
  return (
    <div className="flex justify-end gap-2 dark:text-white">{children}</div>
  );
};

Modal.CloseButton = function ModalCloseButton() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("ModalCloseButton must be used inside a Modal provider");
  }

  const onClose = context?.onClose;

  if (!onClose) return null;

  return (
    <button
      onClick={onClose}
      className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400 text-gray-500 hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-[var(--color-grey-700)] cursor-pointer text-2xl leading-none"
      aria-label="Close"
    >
      ✕
    </button>
  );
};

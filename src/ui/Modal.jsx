import { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useClickOutside } from "../hooks/useClickOutside";
import { useEscapeKey } from "../hooks/useEscapeKey";

const ModalContext = createContext(null);

export default function Modal({ isOpen, onClose, authModal, children }) {
  const contentRef = useRef(null);

  useEscapeKey(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose?.();
  }, isOpen);

  useClickOutside(contentRef, () => onClose?.(), { enabled: isOpen });

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.classList.add("modal-open");
      document.body.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`,
      );
    }

    return () => {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("--scrollbar-width");
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalContext.Provider value={{ onClose }}>
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
            <motion.div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ pointerEvents: isOpen ? "auto" : "none" }}
            >
              <motion.div
                key="modal"
                ref={contentRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.95 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className={`bg-white ${
                  authModal ? "dark:bg-neutral-950" : "dark:bg-slate-800"
                } rounded-xl shadow-xl max-w-md w-full p-6 relative`}
                /* 🔥 Accessibility */
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <Modal.CloseButton authModal={authModal} />
                {children}
              </motion.div>
            </motion.div>
          </>
        </ModalContext.Provider>
      )}
    </AnimatePresence>,
    document.body,
  );
}

Modal.Header = function ModalHeader({ children }) {
  return (
    <div
      id="modal-title"
      className="text-xl font-semibold mb-4 dark:text-white"
    >
      {children}
    </div>
  );
};

Modal.Body = function ModalBody({ children }) {
  return (
    <div
      id="modal-description"
      className="max-h-[80vh] dark:text-white overflow-y-auto"
    >
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({ children }) {
  return (
    <div className="flex justify-end gap-2 dark:text-white">{children}</div>
  );
};

Modal.CloseButton = function ModalCloseButton({ authModal }) {
  const context = useContext(ModalContext);
  const { t } = useTranslation();

  // Hot reload / dev-safe check
  // if (!context) {
  //   if (import.meta.env.MODE === "development") {
  //     console.warn(
  //       "ModalCloseButton used outside a Modal provider (this can happen during hot reload).",
  //     );
  //     return null;
  //   } else {
  //     throw new Error("ModalCloseButton must be used inside a Modal provider");
  //   }
  // }

  const onClose = context.onClose;
  if (!onClose) return null;

  return (
    <button
      onClick={onClose}
      className={`absolute z-[70] top-3 right-3 p-2 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-amber-400 text-gray-500 hover:bg-gray-100 dark:hover:bg-(--brand-bg-secondary-hover) ${
        authModal ? "dark:hover:bg-neutral-900" : ""
      } cursor-pointer text-2xl leading-none`}
      aria-label={t("common.close")}
    >
      <X size={24} />
    </button>
  );
};

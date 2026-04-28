import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Modal — base for every popup in the app.
 *
 * Props:
 *   isOpen          {boolean}
 *   onClose         {() => void}
 *   children        {React.ReactNode}
 *   maxWidth        {string}   — Tailwind max-w-* class, default "max-w-md"
 *   className       {string}   — extra classes on the box
 *   closeOnBackdrop {boolean}  — default true
 */
const Modal = ({
    isOpen,
    onClose,
    children,
    maxWidth = "max-w-md",
    className = "",
    closeOnBackdrop = true,
}) => {
    /* Lock body scroll while open */
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    /* Escape key to close */
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape" && isOpen) onClose?.(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={closeOnBackdrop ? onClose : undefined}
                    />

                    {/* Modal box */}
                    <motion.div
                        className={`modal-box ${maxWidth} ${className}`}
                        initial={{ opacity: 0, scale: 0.94, x: "-50%", y: "-46%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0, scale: 0.94, x: "-50%", y: "-46%" }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
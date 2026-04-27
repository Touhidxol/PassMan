import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Modal
 * ─────
 * Base for every popup/dialog in the app. Provides:
 *  • Consistent themed background (uses CSS vars → auto dark/light)
 *  • Backdrop with blur
 *  • Slide-scale entrance animation
 *  • Escape key to close
 *  • Body scroll lock while open
 *
 * Props:
 *   isOpen          {boolean}
 *   onClose         {() => void}
 *   children        {React.ReactNode}
 *   maxWidth        {string}  — Tailwind max-w class, default "max-w-md"
 *   className       {string}  — extra classes on the modal box
 *   closeOnBackdrop {boolean} — default true
 */
const Modal = ({
    isOpen,
    onClose,
    children,
    maxWidth = "max-w-md",
    className = "",
    closeOnBackdrop = true,
}) => {
    /* Lock body scroll */
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    /* Escape key */
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
                        className="fixed inset-0 z-[900] bg-overlay backdrop-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={closeOnBackdrop ? onClose : undefined}
                    />

                    {/* Modal box */}
                    <motion.div
                        className={`
                            fixed z-[901] left-1/2 top-1/2
                            w-[calc(100%-2rem)] ${maxWidth}
                            max-h-[90vh] overflow-y-auto
                            bg-modal border border-modal rounded-modal shadow-modal
                            text-primary
                            ${className}
                        `}
                        initial={{ opacity: 0, scale: 0.93, x: "-50%", y: "-46%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0, scale: 0.93, x: "-50%", y: "-46%" }}
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

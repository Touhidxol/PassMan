import { motion, AnimatePresence } from "framer-motion";

// Wrapper
export const PresenceWrapper = ({ children }) => (
    <AnimatePresence mode="wait">{children}</AnimatePresence>
);

// Fade
export const Fade = ({ children }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
    >
        {children}
    </motion.div>
);

// Slide from left (sidebar)
export const SlideLeft = ({ children }) => (
    <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

// Scale (modals/cards)
export const Scale = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
    >
        {children}
    </motion.div>
);
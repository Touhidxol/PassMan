import { motion } from "framer-motion";

/**
 * TechBadge
 * ─────────
 * Animated pill for the Tech Stack section.
 * The per-badge accent colour cannot be a static class, so it
 * stays as an inline style — everything else uses the class.
 */
const TechBadge = ({ label, color = "#10b981", delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.35, delay, ease: "backOut" }}
        whileHover={{ scale: 1.06, transition: { duration: 0.15 } }}
        className="tech-badge"
        style={{
            background: `${color}14`,
            border: `1px solid ${color}30`,
            color,
        }}
    >
        {label}
    </motion.div>
);

export default TechBadge;
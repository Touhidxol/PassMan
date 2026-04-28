import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * FeatureCard
 * ───────────
 * Scroll-triggered fade-in-up, hover lift.
 * accent colour is the only inline style — it's dynamic per-card
 * and cannot be expressed as a static CSS class.
 */
const FeatureCard = ({ icon, title, description, accent = "#10b981", delay = 0 }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="feature-card"
        >
            {/* Top accent line — colour is dynamic, must stay inline */}
            <div
                className="absolute top-0 left-6 right-6 h-px rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }}
            />

            {/* Icon container — accent colour is dynamic */}
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                    background: `${accent}18`,
                    border: `1px solid ${accent}30`,
                }}
            >
                <img
                    src={icon}
                    alt=""
                    className="w-5 h-5"
                    style={{ filter: `drop-shadow(0 0 6px ${accent}88)` }}
                />
            </div>

            {/* Text */}
            <div>
                <h3 className="feature-card-title">{title}</h3>
                <p className="feature-card-body">{description}</p>
            </div>
        </motion.div>
    );
};

export default FeatureCard;
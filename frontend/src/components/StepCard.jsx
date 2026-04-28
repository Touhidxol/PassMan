import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * StepCard
 * ────────
 * One step in the "How it works" section.
 * Scroll-triggered slide-in from left.
 */
const StepCard = ({ number, title, description, delay = 0 }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            ref={ref}
            className="step-card"
            initial={{ opacity: 0, x: -24 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="step-number z-10">{number}</div>

            <div>
                <h3 className="step-title">{title}</h3>
                <p className="step-body">{description}</p>
            </div>
        </motion.div>
    );
};

export default StepCard;
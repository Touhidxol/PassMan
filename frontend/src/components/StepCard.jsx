import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * StepCard
 * ────────
 * One step in the "How it works" section.
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
            className="flex gap-5 items-start z-10"
            initial={{ opacity: 0, x: -24 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Number badge */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 lp-step-badge">
                {number}
            </div>

            {/* Content */}
            <div>
                <h3 className="text-white font-semibold text-base mb-1.5">{title}</h3>
                <p className="text-sm leading-relaxed text-emerald-100/60">{description}</p>
            </div>
        </motion.div>
    );
};

export default StepCard;

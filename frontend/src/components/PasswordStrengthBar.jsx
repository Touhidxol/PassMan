import React from "react";
import { getPasswordStrength } from "../utils/passworStrength";

/**
 * PasswordStrengthBar
 *
 * Props:
 *   password   {string}   — the password to evaluate (required)
 *   showLabel  {boolean}  — show "Strong" text next to bar (default: true)
 *   showTips   {boolean}  — show actionable suggestions below bar (default: false)
 *   className  {string}   — extra wrapper classes
 *
 * Usage:
 *   <PasswordStrengthBar password={value} showTips />
 */
const PasswordStrengthBar = ({
    password = "",
    showLabel = true,
    showSegment = false,
    showTips = false,
    className = "",
}) => {
    const { score, label, color, width, suggestions } = getPasswordStrength(password);

    if (!password) return null;

    return (
        <div className={`w-full ${className}`}>
            {/* Bar row */}
            <div className="flex items-center gap-2 mt-1 mb-1">
                {/* Track */}
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width, backgroundColor: color }}
                    />
                </div>

                {/* Label */}
                {showLabel && (
                    <span
                        className="text-xs font-medium min-w-[72px] text-right transition-colors duration-300"
                        style={{ color }}
                    >
                        {label}
                    </span>
                )}
            </div>

            {/* Segment indicators (5 dots matching 5 levels) */}
            {showSegment && (
                <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex-1 h-0.5 rounded-full transition-all duration-300"
                            style={{
                                backgroundColor: i <= score ? color : "rgba(255,255,255,0.12)",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Tips */}
            {showTips && suggestions.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                    {suggestions.map((tip, i) => (
                        <li
                            key={i}
                            className="text-xs text-gray-400 flex items-start gap-1"
                        >
                            <span style={{ color }} className="mt-0.5 shrink-0">›</span>
                            {tip}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PasswordStrengthBar;
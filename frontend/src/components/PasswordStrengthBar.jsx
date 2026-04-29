import { getPasswordStrength } from "../utils/passworStrength";

/**
 * PasswordStrengthBar
 *
 * Props:
 *   password   {string}
 *   showLabel  {boolean}  default true
 *   showTips   {boolean}  default false
 *   className  {string}
 */
const PasswordStrengthBar = ({
    password = "",
    showLabel = true,
    showTips = false,
    className = "",
}) => {
    const { score, label, color, width, suggestions } = getPasswordStrength(password);

    if (!password) return null;

    return (
        <div className={`w-full ${className}`}>

            {/* Bar row */}
            <div className="flex items-center gap-2 mt-1 mb-1">
                <div className="strength-track">
                    {/* Fill — width + colour are dynamic per-score, must stay inline */}
                    <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width, backgroundColor: color }}
                    />
                </div>

                {showLabel && (
                    <span
                        className="strength-label transition-colors duration-300"
                        style={{ color }}
                    >
                        {label}
                    </span>
                )}
            </div>

            {/* Tips */}
            {showTips && suggestions.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                    {suggestions.map((tip, i) => (
                        <li key={i} className="strength-tip-item">
                            {/* Accent arrow — colour is dynamic */}
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
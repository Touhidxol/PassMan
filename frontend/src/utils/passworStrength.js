/**
 * passwordStrength.js
 * Pure utility — no React or UI dependencies.
 * Import this anywhere: components, hooks, stats pages, tests.
 *
 * Usage:
 *   import { getPasswordStrength } from "../utils/passwordStrength";
 *   const result = getPasswordStrength("MyP@ssw0rd!");
 *   // result.score    → 0–4
 *   // result.label    → "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong"
 *   // result.color    → Tailwind-compatible CSS color string (use in inline styles)
 *   // result.width    → "0%" – "100%" (for progress bar)
 *   // result.suggestions → string[] of actionable hints
 */

const LEVELS = [
    {
        label: "Very weak",
        color: "#ef4444",   // red-500
        bg: "#fef2f2",      // red-50 
        width: "20%",
    },
    {
        label: "Weak",
        color: "#f97316",   // orange-500
        bg: "#fff7ed",
        width: "40%",
    },
    {
        label: "Fair",
        color: "#eab308",   // yellow-500
        bg: "#fefce8",
        width: "60%",
    },
    {
        label: "Strong",
        color: "#22c55e",   // green-500
        bg: "#f0fdf4",
        width: "80%",
    },
    {
        label: "Very strong",
        color: "#10b981",   // emerald-500
        bg: "#ecfdf5",
        width: "100%",
    },
];

/**
 * Analyse a password and return its strength metadata.
 * @param {string} password
 * @returns {{
 *   score: number,         // 0–4
 *   label: string,
 *   color: string,         // hex — safe for inline style
 *   bg: string,            // light background hint
 *   width: string,         // CSS percentage for progress bar
 *   suggestions: string[]  // actionable improvement tips
 * }}
 */
export function getPasswordStrength(password) {
    if (!password || password.length === 0) {
        return {
            score: 0,
            ...LEVELS[0],
            suggestions: ["Enter a password to see its strength."],
        };
    }

    let score = 0;
    const suggestions = [];

    // ── Length ──────────────────────────────────────────────────────────
    if (password.length >= 8) score += 1;
    else suggestions.push("Use at least 8 characters.");

    if (password.length >= 12) score += 1;
    else if (password.length >= 8) suggestions.push("Use 12+ characters for a stronger password.");

    // ── Character variety ────────────────────────────────────────────────
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const varietyCount = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;

    if (varietyCount >= 3) score += 1;
    else {
        if (!hasUpper) suggestions.push("Add uppercase letters (A–Z).");
        if (!hasLower) suggestions.push("Add lowercase letters (a–z).");
        if (!hasDigit) suggestions.push("Include numbers (0–9).");
        if (!hasSymbol) suggestions.push("Use symbols like !, @, #, $.");
    }

    // ── Common patterns (penalty) ────────────────────────────────────────
    const commonPatterns = [
        /^(password|passw0rd|p@ssword|p@ssw0rd)/i,
        /^(123456|1234567|12345678|123456789)/,
        /^(qwerty|qwertyuiop|asdfghjkl|zxcvbnm)/i,
        /^(.)\1{4,}/,              // 5+ repeated chars: "aaaaa", "11111"
        /^(abc|abcd|abcde)/i,
        /^(letmein|welcome|admin|login|master)/i,
    ];

    const isCommon = commonPatterns.some((re) => re.test(password));
    if (isCommon) {
        score = Math.max(0, score - 2);
        suggestions.unshift("Avoid common passwords and predictable patterns.");
    }

    // ── Sequential characters (mild penalty) ────────────────────────────
    const hasSequential = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def)/i.test(password);
    if (hasSequential) {
        score = Math.max(0, score - 1);
        if (!suggestions.some((s) => s.includes("predictable"))) {
            suggestions.push("Avoid sequential characters like '123' or 'abc'.");
        }
    }

    // ── Clamp and return ─────────────────────────────────────────────────
    const clampedScore = Math.min(4, Math.max(0, score));

    return {
        score: clampedScore,
        ...LEVELS[clampedScore],
        suggestions: suggestions.length > 0 ? suggestions : ["Looking good! Keep it up."],
    };
}

/**
 * Categorise a list of passwords by strength.
 * Useful for the Stats page.
 *
 * @param {Array<{password: string}>} passwordItems  — array of password objects
 * @returns {Record<string, number>}  e.g. { "Very weak": 2, "Weak": 5, "Strong": 10, … }
 */
export function categoriseByStrength(passwordItems) {
    const counts = {
        "Very weak": 0,
        "Weak": 0,
        "Fair": 0,
        "Strong": 0,
        "Very strong": 0,
    };

    for (const item of passwordItems) {
        const { label } = getPasswordStrength(item.password || "");
        counts[label] = (counts[label] ?? 0) + 1;
    }

    return counts;
}

/**
 * All strength levels in order — handy for rendering legend/charts.
 */
export const STRENGTH_LEVELS = LEVELS.map((l, i) => ({ ...l, score: i }));
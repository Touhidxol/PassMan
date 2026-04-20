const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

/**
 * Generate a cryptographically random password.
 * @param {object} opts
 * @param {number}  opts.length      — total length (default 16)
 * @param {boolean} opts.uppercase   — include A-Z (default true)
 * @param {boolean} opts.lowercase   — include a-z (default true)
 * @param {boolean} opts.digits      — include 0-9 (default true)
 * @param {boolean} opts.symbols     — include special chars (default true)
 * @returns {string}
 */
export function generatePassword({
    length = 16,
    uppercase = true,
    lowercase = true,
    digits = true,
    symbols = true,
} = {}) {
    let pool = "";
    const required = [];

    if (uppercase) { pool += UPPERCASE; required.push(pick(UPPERCASE)); }
    if (lowercase) { pool += LOWERCASE; required.push(pick(LOWERCASE)); }
    if (digits) { pool += DIGITS; required.push(pick(DIGITS)); }
    if (symbols) { pool += SYMBOLS; required.push(pick(SYMBOLS)); }

    if (!pool) return ""; // nothing selected

    // Fill remaining characters
    const remaining = Array.from(
        { length: Math.max(0, length - required.length) },
        () => pick(pool)
    );

    // Shuffle required + remaining together using crypto random
    return shuffle([...required, ...remaining]).join("");
}

function pick(str) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return str[arr[0] % str.length];
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        const j = buf[0] % (i + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
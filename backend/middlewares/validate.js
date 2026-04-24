import validator from "validator";

// ─── tiny helper ────────────────────────────────────────────────────────────
const err = (res, msg, status = 400) =>
    res.status(status).json({ success: false, message: msg });

// ─── sanitise a plain string: trim + strip HTML-dangerous chars ──────────────
const sanitise = (str = "") =>
    validator.escape(validator.trim(String(str)));

// ── Field length caps ────────────────────────────────────────────────────────
const LIMITS = {
    name: 80,
    email: 254,        // RFC 5321 max
    password: 128,     // master password
    site: 253,         // max domain length
    username: 254,
    storedPassword: 512,
    note: 1000,
};

// ════════════════════════════════════════════════════════════════════════════
//  AUTH VALIDATORS
// ════════════════════════════════════════════════════════════════════════════

export const validateRegister = (req, res, next) => {
    let { name, email, password } = req.body;

    if (!name || !email || !password)
        return err(res, "name, email and password are required.");

    name = validator.trim(String(name));
    email = validator.trim(String(email)).toLowerCase();
    password = String(password);

    if (name.length < 2 || name.length > LIMITS.name)
        return err(res, `Name must be 2–${LIMITS.name} characters.`);

    if (!validator.isEmail(email))
        return err(res, "Invalid email address.");

    if (email.length > LIMITS.email)
        return err(res, "Email address is too long.");

    if (password.length < 8 || password.length > LIMITS.password)
        return err(res, `Password must be 8–${LIMITS.password} characters.`);

    // Sanitise name (email and password must NOT be escaped)
    req.body.name = validator.escape(name);
    req.body.email = email;
    req.body.password = password;
    next();
};

export const validateLogin = (req, res, next) => {
    let { email, password } = req.body;

    if (!email || !password)
        return err(res, "email and password are required.");

    email = validator.trim(String(email)).toLowerCase();
    password = String(password);

    if (!validator.isEmail(email))
        return err(res, "Invalid email address.");

    if (password.length > LIMITS.password)
        return err(res, "Password too long.");

    req.body.email = email;
    req.body.password = password;
    next();
};

export const validateUpdateName = (req, res, next) => {
    let { name } = req.body;

    if (!name) return err(res, "name is required.");

    name = validator.trim(String(name));

    if (name.length < 2 || name.length > LIMITS.name)
        return err(res, `Name must be 2–${LIMITS.name} characters.`);

    req.body.name = validator.escape(name);
    next();
};

export const validateChangePassword = (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
        return err(res, "currentPassword and newPassword are required.");

    if (String(currentPassword).length > LIMITS.password)
        return err(res, "currentPassword too long.");

    if (String(newPassword).length < 8 || String(newPassword).length > LIMITS.password)
        return err(res, `newPassword must be 8–${LIMITS.password} characters.`);

    next();
};

// ════════════════════════════════════════════════════════════════════════════
//  PASSWORD VAULT VALIDATORS
// ════════════════════════════════════════════════════════════════════════════

// Very permissive domain regex — also allow IP-like strings and localhost for dev
const DOMAIN_RE = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$|^localhost$/;

export const validateCreatePassword = (req, res, next) => {
    let { site, username = "", password, note = "" } = req.body;

    if (!site) return err(res, "site is required.");
    if (!password) return err(res, "password is required.");

    site = validator.trim(String(site)).toLowerCase();
    username = validator.trim(String(username));
    password = String(password);
    note = validator.trim(String(note));

    if (!DOMAIN_RE.test(site))
        return err(res, "site must be a valid domain (e.g. example.com).");

    if (site.length > LIMITS.site)
        return err(res, `site must be ≤ ${LIMITS.site} characters.`);

    if (username.length > LIMITS.username)
        return err(res, `username must be ≤ ${LIMITS.username} characters.`);

    if (password.length < 1 || password.length > LIMITS.storedPassword)
        return err(res, `password must be 1–${LIMITS.storedPassword} characters.`);

    if (note.length > LIMITS.note)
        return err(res, `note must be ≤ ${LIMITS.note} characters.`);

    // Sanitise free-text fields; site/username stored as-is (lowercased/trimmed)
    req.body.site = site;
    req.body.username = username;
    req.body.password = password;          // stored encrypted — do NOT escape
    req.body.note = validator.escape(note);
    next();
};

export const validateUpdatePassword = (req, res, next) => {
    const payload = req.body;

    if (payload.site !== undefined) {
        payload.site = validator.trim(String(payload.site)).toLowerCase();
        if (!DOMAIN_RE.test(payload.site))
            return err(res, "site must be a valid domain (e.g. example.com).");
        if (payload.site.length > LIMITS.site)
            return err(res, `site must be ≤ ${LIMITS.site} characters.`);
    }

    if (payload.username !== undefined) {
        payload.username = validator.trim(String(payload.username));
        if (payload.username.length > LIMITS.username)
            return err(res, `username must be ≤ ${LIMITS.username} characters.`);
    }

    if (payload.password !== undefined) {
        payload.password = String(payload.password);
        if (payload.password.length < 1 || payload.password.length > LIMITS.storedPassword)
            return err(res, `password must be 1–${LIMITS.storedPassword} characters.`);
    }

    if (payload.note !== undefined) {
        payload.note = validator.trim(String(payload.note));
        if (payload.note.length > LIMITS.note)
            return err(res, `note must be ≤ ${LIMITS.note} characters.`);
        payload.note = validator.escape(payload.note);
    }

    if (payload.favorite !== undefined) {
        if (typeof payload.favorite !== "boolean")
            return err(res, "favorite must be a boolean.");
    }

    next();
};

// ════════════════════════════════════════════════════════════════════════════
//  OTP VALIDATORS
// ════════════════════════════════════════════════════════════════════════════

export const validateForgotPassword = (req, res, next) => {
    let { email } = req.body;

    if (!email) return err(res, "email is required.");

    email = validator.trim(String(email)).toLowerCase();

    if (!validator.isEmail(email))
        return err(res, "Invalid email address.");

    req.body.email = email;
    next();
};

export const validateResetPassword = (req, res, next) => {
    let { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
        return err(res, "email, otp and newPassword are required.");

    email = validator.trim(String(email)).toLowerCase();
    otp = validator.trim(String(otp));
    newPassword = String(newPassword);

    if (!validator.isEmail(email))
        return err(res, "Invalid email address.");

    if (!/^\d{6}$/.test(otp))
        return err(res, "OTP must be exactly 6 digits.");

    if (newPassword.length < 8 || newPassword.length > 128)
        return err(res, "newPassword must be 8–128 characters.");

    req.body.email = email;
    req.body.otp = otp;
    req.body.newPassword = newPassword;
    next();
};
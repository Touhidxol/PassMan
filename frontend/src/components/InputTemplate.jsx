/**
 * InputTemplate
 * ─────────────
 * Floating-label wrapper used on all auth pages.
 * The label rises above the input when focused or filled.
 *
 * Props:
 *   id       {string}  — matches the <input id> and <label htmlFor>
 *   title    {string}  — label text
 *   children           — the <input> element (must include className="input-template peer")
 */
const InputTemplate = ({ id, title, children }) => (
    <div className="auth-field-wrap">
        {children}
        <label htmlFor={id} className="auth-label">
            {title}
        </label>
    </div>
);

export default InputTemplate;
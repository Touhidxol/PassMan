import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { generatePassword } from "../utils/passwordGenerator";
import PasswordStrengthBar from "./PasswordStrengthBar";
import toast from "react-hot-toast";

/**
 * PasswordGeneratorModal
 *
 * Props:
 *   isOpen   {boolean}
 *   onClose  {() => void}
 */
const PasswordGeneratorModal = ({ isOpen, onClose }) => {
    const [length, setLength] = useState(16);
    const [uppercase, setUppercase] = useState(true);
    const [lowercase, setLowercase] = useState(true);
    const [digits, setDigits] = useState(true);
    const [symbols, setSymbols] = useState(true);
    const [generated, setGenerated] = useState("");
    const [copied, setCopied] = useState(false);

    const generate = useCallback(() => {
        const pw = generatePassword({ length, uppercase, lowercase, digits, symbols });
        setGenerated(pw || "");
        setCopied(false);
    }, [length, uppercase, lowercase, digits, symbols]);

    /* Regenerate whenever options change or modal opens */
    useEffect(() => { if (isOpen) generate(); }, [isOpen, generate]);

    /* Escape key */
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose(); };
        if (isOpen) window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, onClose]);

    const handleCopy = async () => {
        if (!generated) return;
        await navigator.clipboard.writeText(generated);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    /* Toggle switch component */
    const Toggle = ({ label, checked, onChange }) => (
        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <div
                onClick={() => onChange(!checked)}
                className={`generator-toggle-track ${checked ? "generator-toggle-track-on" : "generator-toggle-track-off"}`}
            >
                <span
                    className="generator-toggle-thumb"
                    style={{ left: checked ? "calc(100% - 18px)" : "2px" }}
                />
            </div>
            <span className="generator-toggle-label group-hover:text-theme-primary">
                {label}
            </span>
        </label>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="modal-box max-w-md"
                        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-48%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-48%" }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                        <div className="generator-modal-wrap">

                            {/* Header */}
                            <div className="generator-header">
                                <div className="flex items-center gap-2.5">
                                    <div className="generator-header-icon">
                                        {/* Shuffle icon */}
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                            stroke="#60a5fa" strokeWidth="1.8"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="16 3 21 3 21 8" />
                                            <line x1="4" y1="20" x2="21" y2="3" />
                                            <polyline points="21 16 21 21 16 21" />
                                            <line x1="15" y1="15" x2="21" y2="21" />
                                            <line x1="4" y1="4" x2="9" y2="9" />
                                        </svg>
                                    </div>
                                    <span className="font-medium text-sm text-theme-primary">
                                        Password generator
                                    </span>
                                </div>

                                <button onClick={onClose} className="generator-icon-btn">
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                        <path d="M2 2l12 12M14 2L2 14" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-5 space-y-5">

                                {/* Generated password display */}
                                <div>
                                    <div className="generator-password-display">
                                        <p className="generator-password-text">
                                            {generated || "Select options below"}
                                        </p>

                                        <div className="flex items-center gap-1 shrink-0">
                                            {/* Regenerate */}
                                            <button
                                                onClick={generate}
                                                title="Regenerate"
                                                className="generator-icon-btn"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24"
                                                    fill="none" stroke="currentColor"
                                                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                                    <path d="M3 3v5h5" />
                                                </svg>
                                            </button>

                                            {/* Copy */}
                                            <button
                                                onClick={handleCopy}
                                                title="Copy"
                                                className={copied ? "generator-icon-btn-copied" : "generator-icon-btn"}
                                            >
                                                {copied ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor"
                                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 24 24"
                                                        fill="none" stroke="currentColor"
                                                        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" />
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <PasswordStrengthBar password={generated} className="mt-2 px-1" />
                                </div>

                                {/* Length slider */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-theme-muted">Length</span>
                                        <span className="text-sm font-medium tabular-nums text-theme-primary">
                                            {length}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={8} max={64} step={1}
                                        value={length}
                                        onChange={(e) => setLength(Number(e.target.value))}
                                        onMouseUp={generate}
                                        onTouchEnd={generate}
                                        className="w-full accent-blue-500 cursor-pointer"
                                    />
                                    <div className="flex justify-between text-[10px] text-theme-muted">
                                        <span>8</span>
                                        <span>64</span>
                                    </div>
                                </div>

                                {/* Toggles */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Toggle label="Uppercase A–Z" checked={uppercase} onChange={setUppercase} />
                                    <Toggle label="Lowercase a–z" checked={lowercase} onChange={setLowercase} />
                                    <Toggle label="Numbers 0–9" checked={digits} onChange={setDigits} />
                                    <Toggle label="Symbols !@#…" checked={symbols} onChange={setSymbols} />
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2 pt-1">
                                    <button onClick={generate} className="generator-action-outline">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth="1.8"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                            <path d="M3 3v5h5" />
                                        </svg>
                                        New password
                                    </button>

                                    <button onClick={handleCopy} className="generator-action-primary">
                                        {copied ? (
                                            <>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="2"
                                                    strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" strokeWidth="1.8"
                                                    strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </svg>
                                                Copy password
                                            </>
                                        )}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PasswordGeneratorModal;
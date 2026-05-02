import { useState, useCallback, useEffect } from "react";
import { generatePassword } from "../utils/passwordGenerator";
import Modal from "./layout/Modal";
import PasswordStrengthBar from "./PasswordStrengthBar";
import toast from "react-hot-toast";

import bolt from "../assets/icons/bolt.svg";


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

    useEffect(() => { if (isOpen) generate(); }, [isOpen, generate]);

    const handleCopy = async () => {
        if (!generated) return;
        await navigator.clipboard.writeText(generated);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const Toggle = ({ label, checked, onChange }) => (
        <label className="gen-toggle-row">
            <span className="gen-toggle-label">{label}</span>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`gen-toggle-track ${checked ? "gen-toggle-on" : "gen-toggle-off"}`}
            >
                <span className={`gen-toggle-thumb ${checked ? "translate-x-0" : "-translate-x-4"}`} />
            </button>
        </label>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">

            {/* ── Header ─────────────────────────────────── */}
            <div className="modal-header">
                <div className="flex items-center gap-2.5">
                    <div className="gen-header-icon">
                        <img src={bolt} alt="" className="w-4 theme-icon"/>
                    </div>
                    <p className="modal-header-title">Password generator</p>
                </div>

                <button onClick={onClose} className="modal-close-btn">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M2 2l12 12M14 2L2 14" />
                    </svg>
                </button>
            </div>

            {/* ── Body ────────────────────────────────────── */}
            <div className="modal-body space-y-5">

                {/* Generated password display */}
                <div>
                    <p className="card-field-label">Generated password</p>
                    <div className="gen-display">
                        <p className="gen-display-text">
                            {generated || <span style={{ color: "var(--text-muted)" }}>Select options below…</span>}
                        </p>
                        <div className="flex items-center gap-0.5 shrink-0">
                            {/* Regenerate */}
                            <button
                                onClick={generate}
                                title="Regenerate"
                                className="gen-icon-btn"
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
                                className={`gen-icon-btn ${copied ? "gen-icon-btn-copied" : ""}`}
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
                    <PasswordStrengthBar password={generated} className="mt-2" />
                </div>

                {/* Length slider */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="card-field-label mb-0">Length</p>
                        <span className="gen-length-badge">{length}</span>
                    </div>
                    <div className="gen-slider-wrap">
                        <input
                            type="range"
                            min={8} max={64} step={1}
                            value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            onMouseUp={generate}
                            onTouchEnd={generate}
                            className="gen-slider"
                            style={{ "--pct": `${((length - 8) / (64 - 8)) * 100}%` }}
                        />
                        <div className="flex justify-between mt-1">
                            <span className="gen-slider-tick">8</span>
                            <span className="gen-slider-tick">64</span>
                        </div>
                    </div>
                </div>

                {/* Toggles */}
                <div>
                    <p className="card-field-label">Character types</p>
                    <div className="gen-toggles-grid">
                        <Toggle label="Uppercase A–Z" checked={uppercase} onChange={setUppercase} />
                        <Toggle label="Lowercase a–z" checked={lowercase} onChange={setLowercase} />
                        <Toggle label="Numbers 0–9" checked={digits} onChange={setDigits} />
                        <Toggle label="Symbols !@#…" checked={symbols} onChange={setSymbols} />
                    </div>
                </div>

            </div>

            {/* ── Footer ──────────────────────────────────── */}
            <div className="modal-footer">
                <button onClick={generate} className="btn-ghost flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                    </svg>
                    Regenerate
                </button>

                <button onClick={handleCopy} className="btn-primary flex items-center gap-1.5">
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

        </Modal>
    );
};

export default PasswordGeneratorModal;
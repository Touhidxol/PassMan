import { useRef } from "react";

const SearchBar = ({ value, onChange, placeholder = "Search passwords…", className = "" }) => {
    const inputRef = useRef();

    return (
        <div
            className={`flex items-center gap-2 px-3 h-10 rounded-full cursor-text transition-colors ${className}`}
            style={{
                background: "var(--bg-surface-3)",
                border: "1px solid var(--border-default)",
            }}
            onClick={() => inputRef.current?.focus()}
            onFocus={(e) => e.currentTarget.style.borderColor = "var(--border-focus)"}
            onBlur={(e) => e.currentTarget.style.borderColor = "var(--border-default)"}
        >
            {/* Search icon */}
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none"
                style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{
                    color: "var(--text-primary)",
                    caretColor: "var(--brand-lime)",
                }}
            />

            {/* Clear button */}
            {value && (
                <button
                    onClick={(e) => { e.stopPropagation(); onChange(""); }}
                    className="shrink-0 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                    aria-label="Clear search"
                >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;
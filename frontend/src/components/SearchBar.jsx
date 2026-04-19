import { useRef } from "react";

const SearchBar = ({ value, onChange, placeholder = "Search passwords…", className = "" }) => {
    const inputRef = useRef();

    return (
        <div
            className={`flex items-center gap-2 px-3 h-10 rounded-full border border-white/15 bg-white/5 hover:border-white/25 focus-within:border-blue-400/60 transition-colors ${className}`}
            onClick={() => inputRef.current?.focus()}
        >
            {/* Search icon */}
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" className="shrink-0 text-white/40">
                <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
            />

            {/* Clear button */}
            {value && (
                <button
                    onClick={(e) => { e.stopPropagation(); onChange(""); }}
                    className="shrink-0 text-white/30 hover:text-white/60 transition-colors"
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

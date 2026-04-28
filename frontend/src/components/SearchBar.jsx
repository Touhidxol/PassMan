import { useRef } from "react";

const SearchBar = ({
    value,
    onChange,
    placeholder = "Search passwords…",
    className = "",
}) => {
    const inputRef = useRef();

    return (
        <div
            className={`search-bar ${className}`}
            onClick={() => inputRef.current?.focus()}
        >
            {/* Search icon */}
            <svg
                width="15" height="15" viewBox="0 0 20 20"
                fill="none" className="search-bar-icon shrink-0"
            >
                <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="1.5" />
                <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="search-bar-input"
            />

            {/* Clear button */}
            {value && (
                <button
                    onClick={(e) => { e.stopPropagation(); onChange(""); }}
                    className="search-bar-clear"
                    aria-label="Clear search"
                >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M3 3l10 10M13 3L3 13"
                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;
import { useState, useMemo } from "react";

export const SORT_OPTIONS = [
    { value: "updated", label: "Recently updated" },
    { value: "az", label: "A → Z" },
    { value: "za", label: "Z → A" },
    { value: "strength_asc", label: "Weakest first" },
    { value: "strength_desc", label: "Strongest first" },
];

// Lazy-import strength util to avoid circular deps
let _getStrength = null;
const getStrength = (pw) => {
    if (!_getStrength) {
        // synchronous dynamic require-style trick for utils
        _getStrength = (p) => {
            let s = 0;
            if (p.length >= 8) s++;
            if (p.length >= 12) s++;
            if ([/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length >= 3) s++;
            return s;
        };
    }
    return _getStrength(pw);
};

export const useSearch = (items = []) => {
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState("updated");

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

        // Filter
        let filtered = q
            ? items.filter(
                (item) =>
                    item.site?.toLowerCase().includes(q) ||
                    item.username?.toLowerCase().includes(q) ||
                    item.note?.toLowerCase().includes(q)
            )
            : [...items];

        // Sort
        switch (sortBy) {
            case "az":
                filtered.sort((a, b) => a.site.localeCompare(b.site));
                break;
            case "za":
                filtered.sort((a, b) => b.site.localeCompare(a.site));
                break;
            case "strength_asc":
                filtered.sort((a, b) => getStrength(a.password || "") - getStrength(b.password || ""));
                break;
            case "strength_desc":
                filtered.sort((a, b) => getStrength(b.password || "") - getStrength(a.password || ""));
                break;
            case "updated":
            default:
                filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                break;
        }

        return filtered;
    }, [items, query, sortBy]);

    return { query, setQuery, sortBy, setSortBy, results };
};

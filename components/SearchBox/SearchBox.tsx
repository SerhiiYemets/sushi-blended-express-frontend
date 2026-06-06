"use client";

import { memo } from "react";

import css from "./SearchBox.module.css";

type SearchBoxProps = {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    placeholder?: string;
    /** Optional result count, announced for screen readers while searching. */
    resultCount?: number | null;
};

function SearchIcon() {
    return (
        <svg
            className={css.icon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

const SearchBox = memo(function SearchBox({
    value,
    onChange,
    onClear,
    placeholder = "Hledat v menu…",
    resultCount = null,
}: SearchBoxProps) {
    const hasValue = value.length > 0;

    return (
        <div className={css.wrapper}>
            <div className={css.field}>
                <span className={css.iconSlot} aria-hidden="true">
                    <SearchIcon />
                </span>

                <input
                    type="search"
                    inputMode="search"
                    enterKeyHint="search"
                    className={css.input}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    aria-label="Hledat v menu"
                    autoComplete="off"
                />

                {hasValue && (
                    <button
                        type="button"
                        className={css.clearBtn}
                        onClick={onClear}
                        aria-label="Vymazat hledání"
                    >
                        ×
                    </button>
                )}
            </div>

            <p className={css.status} role="status" aria-live="polite">
                {hasValue && resultCount !== null
                    ? `${resultCount} ${pluralizeResults(resultCount)}`
                    : ""}
            </p>
        </div>
    );
});

function pluralizeResults(count: number): string {
    if (count === 1) return "výsledek";
    if (count >= 2 && count <= 4) return "výsledky";
    return "výsledků";
}

export default SearchBox;

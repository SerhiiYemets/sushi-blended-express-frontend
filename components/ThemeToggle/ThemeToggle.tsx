"use client";

import { useThemeStore } from "@/lib/store/themeStore";
import { useHydrated } from "@/hooks/useHydrated";

import css from "./ThemeToggle.module.css";

export default function ThemeToggle() {
    const theme = useThemeStore((s) => s.theme);
    const toggleTheme = useThemeStore((s) => s.toggleTheme);
    const mounted = useHydrated();

    const dark = theme === "dark";

    return (
        <button
            type="button"
            className={css.btn}
            onClick={toggleTheme}
            aria-label={dark ? "Zapnout světlý režim" : "Zapnout tmavý režim"}
            aria-pressed={dark}
            suppressHydrationWarning
        >
            <span className={`${css.icon} ${mounted && dark ? css.iconActive : ""}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                    />
                </svg>
            </span>
            <span className={`${css.icon} ${mounted && !dark ? css.iconActive : ""}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                    <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    />
                </svg>
            </span>
        </button>
    );
}

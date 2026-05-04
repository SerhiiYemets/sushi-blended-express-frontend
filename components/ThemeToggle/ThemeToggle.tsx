"use client";

import { useEffect, useState } from "react";
import css from "./ThemeToggle.module.css";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        // data-theme is set by the inline init script in layout.tsx before React hydrates,
        // so this read is always accurate and never causes a hydration mismatch.
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        if (isDark) setDark(true);
    }, []);

    const toggle = () => {
        const next = dark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        setDark(!dark);
    };

    return (
        <button
            type="button"
            className={css.btn}
            onClick={toggle}
            aria-label={dark ? "Zapnout světlý režim" : "Zapnout tmavý režim"}
        >
            {dark ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path fill="currentColor"
                        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                </svg>
            )}
        </button>
    );
}

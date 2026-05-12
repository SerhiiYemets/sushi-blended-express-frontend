"use client";

import { useSyncExternalStore } from "react";
import css from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

function getTheme(): Theme {
    const t = document.documentElement.getAttribute("data-theme");
    return t === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
}

const getServerSnapshot = (): Theme => "light";

export default function ThemeToggle() {
    const theme = useSyncExternalStore(subscribe, getTheme, getServerSnapshot);
    const dark = theme === "dark";

    const toggle = () => {
        const next: Theme = dark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        try {
            localStorage.setItem("theme", next);
        } catch {}
    };

    return (
        <button
            type="button"
            className={css.btn}
            onClick={toggle}
            aria-label={dark ? "Zapnout světlý režim" : "Zapnout tmavý režim"}
            suppressHydrationWarning
        >
            {dark ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                    <path
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                    />
                </svg>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
                    />
                </svg>
            )}
        </button>
    );
}

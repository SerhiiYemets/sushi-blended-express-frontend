"use client";

import { useEffect, useState } from "react";

import css from "./BackToCategories.module.css";

/** Show the button once the user has scrolled roughly one viewport-ish down. */
const SCROLL_THRESHOLD = 400;

/**
 * Floating "back to categories" button for the Menu page.
 *
 * Stays hidden near the top of the page and fades/slides in after the user
 * scrolls past {@link SCROLL_THRESHOLD}px. Clicking smooth-scrolls back to the
 * top, which brings the category navigation (rendered right under the title)
 * into view. Theme-aware styling lives in the CSS module.
 */
export default function BackToCategories() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > SCROLL_THRESHOLD);
        };

        // Run once in case the page is restored already scrolled.
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`${css.button} ${visible ? css.visible : ""}`}
            aria-label="Zpět na kategorie"
            aria-hidden={!visible}
            tabIndex={visible ? 0 : -1}
        >
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M12 19V5M5 12l7-7 7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}

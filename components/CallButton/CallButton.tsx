"use client";

import { useEffect, useId, useRef, useState } from "react";

import css from "./CallButton.module.css";

const RESTAURANT_PHONES = [
    { name: "Restaurace Kolín", phone: "+420 721 479 332", href: "tel:+420721479332" },
    { name: "Restaurace Jihlava", phone: "+420 777 499 970", href: "tel:+420777499970" },
] as const;

export default function CallButton() {
    const [open, setOpen] = useState(false);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const menuId = useId();

    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
                buttonRef.current?.focus();
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    return (
        <div ref={rootRef} className={css.root}>
            <div
                id={menuId}
                className={css.menu}
                role="group"
                aria-label="Vyberte restauraci"
                hidden={!open}
            >
                <ul className={css.list}>
                    {RESTAURANT_PHONES.map((restaurant) => (
                        <li key={restaurant.href}>
                            <a
                                href={restaurant.href}
                                className={css.item}
                                onClick={() => setOpen(false)}
                            >
                                <span className={css.name}>
                                    {restaurant.name}
                                </span>
                                <span className={css.phone}>
                                    {restaurant.phone}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                ref={buttonRef}
                type="button"
                className={css.button}
                aria-label="Zavolat do restaurace"
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => setOpen((current) => !current)}
            >
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
}

"use client";

import {
    useCallback,
    useEffect,
    useId,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import css from "./Modal.module.css";

const FOCUSABLE_SELECTOR = [
    "a[href]",
    "area[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "button:not([disabled])",
    "iframe",
    "object",
    "embed",
    '[tabindex]:not([tabindex="-1"])',
    "[contenteditable]",
].join(",");

const ANIMATION_MS = 220;

type Props = {
    children: React.ReactNode;
    labelledBy?: string;
    closeAriaLabel?: string;
};

export default function Modal({
    children,
    labelledBy,
    closeAriaLabel = "Zavřít",
}: Props) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [closing, setClosing] = useState(false);
    const closingRef = useRef(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const pointerDownOnBackdropRef = useRef(false);
    const titleFallbackId = useId();

    const close = useCallback(() => {
        if (closingRef.current) return;
        closingRef.current = true;
        setClosing(true);
        window.setTimeout(() => router.back(), ANIMATION_MS);
    }, [router]);

    useEffect(() => {
        setMounted(true);

        const previouslyFocused =
            (document.activeElement as HTMLElement | null) ?? null;

        const { body, documentElement } = document;
        const originalOverflow = body.style.overflow;
        const originalPaddingRight = body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
        body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${scrollbarWidth}px`;
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                close();
            }
        };
        document.addEventListener("keydown", onKeyDown);

        const focusTimer = window.setTimeout(() => {
            const dialog = dialogRef.current;
            if (!dialog) return;
            const items =
                dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
            const target = items[0] ?? dialog;
            target.focus({ preventScroll: true });
        }, 0);

        return () => {
            window.clearTimeout(focusTimer);
            document.removeEventListener("keydown", onKeyDown);
            body.style.overflow = originalOverflow;
            body.style.paddingRight = originalPaddingRight;
            previouslyFocused?.focus?.({ preventScroll: true });
        };
    }, [close]);

    const onKeyDownInDialog = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== "Tab") return;
        const dialog = dialogRef.current;
        if (!dialog) return;
        const items = Array.from(
            dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => !el.hasAttribute("disabled"));
        if (items.length === 0) {
            e.preventDefault();
            return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
        }
    };

    const onBackdropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        pointerDownOnBackdropRef.current = e.target === e.currentTarget;
    };

    const onBackdropPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (
            pointerDownOnBackdropRef.current &&
            e.target === e.currentTarget
        ) {
            close();
        }
        pointerDownOnBackdropRef.current = false;
    };

    if (!mounted) return null;

    const labelId = labelledBy ?? titleFallbackId;

    return createPortal(
        <div
            className={`${css.backdrop} ${closing ? css.closing : ""}`}
            onPointerDown={onBackdropPointerDown}
            onPointerUp={onBackdropPointerUp}
            data-state={closing ? "closing" : "open"}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelId}
                tabIndex={-1}
                className={`${css.dialog} ${closing ? css.dialogClosing : ""}`}
                onKeyDown={onKeyDownInDialog}
            >
                <button
                    type="button"
                    onClick={close}
                    className={css.close}
                    aria-label={closeAriaLabel}
                >
                    <span aria-hidden>×</span>
                </button>
                <div className={css.content}>{children}</div>
            </div>
        </div>,
        document.body
    );
}

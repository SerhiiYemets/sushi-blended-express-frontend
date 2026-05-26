"use client";

import { useEffect } from "react";

import {
    cancelPendingAction,
    confirmPendingAction,
    useCartRestaurantId,
    usePendingAction,
} from "@/lib/store/cartStore";
import { RESTAURANT_LABELS } from "@/lib/store/restaurantStore";

import css from "./CartGuardModal.module.css";

export default function CartGuardModal() {
    const action = usePendingAction();
    const cartRestaurantId = useCartRestaurantId();

    useEffect(() => {
        if (!action) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") cancelPendingAction();
        };

        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKey);

        return () => {
            document.body.style.overflow = original;
            document.removeEventListener("keydown", onKey);
        };
    }, [action]);

    if (!action) return null;

    const targetLabel = RESTAURANT_LABELS[action.restaurantId];
    const cartLabel = cartRestaurantId
        ? RESTAURANT_LABELS[cartRestaurantId]
        : null;

    const headline =
        action.kind === "switch"
            ? "Přepnout restauraci?"
            : action.kind === "reorder"
                ? "Objednat znovu?"
                : "Přidat z jiné restaurace?";

    const body =
        action.kind === "switch"
            ? cartLabel
                ? `Košík obsahuje položky z restaurace ${cartLabel}. Přepnutím na ${targetLabel} bude košík vyprázdněn.`
                : `Přepnout na restauraci ${targetLabel}? Košík bude vyprázdněn.`
            : action.kind === "reorder"
                ? cartLabel
                    ? `Tato objednávka pochází z restaurace ${targetLabel}, ale košík obsahuje položky z ${cartLabel}. Pokračováním bude košík vyprázdněn a položky z této objednávky budou přidány.`
                    : `Pokračováním přepneme restauraci na ${targetLabel} a přidáme položky objednávky do košíku.`
                : cartLabel
                    ? `Košík obsahuje položky z restaurace ${cartLabel}. Přidáním tohoto produktu se přepne restaurace na ${targetLabel} a stávající košík bude vyprázdněn.`
                    : `Přidat produkt a přepnout restauraci na ${targetLabel}?`;

    const confirmLabel =
        action.kind === "switch"
            ? "Vyprázdnit a přepnout"
            : action.kind === "reorder"
                ? "Vyprázdnit a objednat znovu"
                : "Vyprázdnit a přidat";

    return (
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-guard-title"
            onClick={cancelPendingAction}
        >
            <div
                className={css.dialog}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="cart-guard-title" className={css.title}>
                    {headline}
                </h2>

                <p className={css.text}>{body}</p>

                <div className={css.actions}>
                    <button
                        type="button"
                        onClick={cancelPendingAction}
                        className={css.cancel}
                    >
                        Zrušit
                    </button>

                    <button
                        type="button"
                        onClick={confirmPendingAction}
                        className={css.accept}
                        autoFocus
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

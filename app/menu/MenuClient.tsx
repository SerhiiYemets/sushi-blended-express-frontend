"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard/ProductCard";
import { getMenu } from "@/lib/api/clientApi";
import {
    RESTAURANT_LABELS,
    useSelectedRestaurant,
    useSetRestaurant,
    type RestaurantId,
} from "@/lib/store/restaurantStore";
import {
    useCartCount,
    useCartRestaurantId,
    useCartStore,
} from "@/lib/store/cartStore";
import type { MenuCategory } from "@/types/menu";

import css from "./Menu.module.css";

const RESTAURANT_OPTIONS: RestaurantId[] = ["kolin", "jihlava"];

export default function MenuClient() {
    const [data, setData] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const [pendingSwitch, setPendingSwitch] = useState<RestaurantId | null>(
        null
    );

    const selectedRestaurant = useSelectedRestaurant();
    const setRestaurant = useSetRestaurant();

    const cartCount = useCartCount();
    const cartRestaurantId = useCartRestaurantId();
    const clearCart = useCartStore((s) => s.clearCart);

    useEffect(() => {
        let cancelled = false;

        setLoading(true);

        getMenu(selectedRestaurant)
            .then((res) => {
                if (cancelled) return;

                setData(res);

                if (res.length > 0) {
                    setActiveCategory(res[0].name);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [selectedRestaurant]);

    const current = data.find(
        (category) => category.name === activeCategory
    );

    const cartHasOtherRestaurant =
        cartCount > 0 &&
        cartRestaurantId !== null &&
        cartRestaurantId !== selectedRestaurant;

    const handleSelectRestaurant = (next: RestaurantId) => {
        if (next === selectedRestaurant) return;

        if (
            cartCount > 0 &&
            cartRestaurantId !== null &&
            cartRestaurantId !== next
        ) {
            setPendingSwitch(next);
            return;
        }

        setRestaurant(next);
    };

    const confirmSwitch = () => {
        if (!pendingSwitch) return;
        clearCart();
        setRestaurant(pendingSwitch);
        setPendingSwitch(null);
    };

    const cancelSwitch = () => setPendingSwitch(null);

    return (
        <main className={css.page}>
            <div className={css.container}>
                <h1 className={css.title}>Menu</h1>

                <div
                    className={css.restaurantSwitcher}
                    role="tablist"
                    aria-label="Vyberte restauraci"
                >
                    {RESTAURANT_OPTIONS.map((restaurant) => {
                        const isActive = selectedRestaurant === restaurant;
                        return (
                            <button
                                key={restaurant}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() =>
                                    handleSelectRestaurant(restaurant)
                                }
                                className={`${css.restaurantBtn} ${
                                    isActive ? css.restaurantBtnActive : ""
                                }`}
                            >
                                <span
                                    className={css.restaurantPin}
                                    aria-hidden
                                >
                                    📍
                                </span>
                                <span className={css.restaurantLabel}>
                                    {RESTAURANT_LABELS[restaurant]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {cartHasOtherRestaurant && !pendingSwitch && (
                    <p
                        className={css.cartHint}
                        role="status"
                        aria-live="polite"
                    >
                        Košík obsahuje položky z restaurace{" "}
                        <strong>
                            {cartRestaurantId
                                ? RESTAURANT_LABELS[cartRestaurantId]
                                : ""}
                        </strong>
                        .
                    </p>
                )}

                {loading ? (
                    <div className={css.loading}>Načítání…</div>
                ) : (
                    <>
                        <div className={css.categories}>
                            {data.map((cat) => (
                                <button
                                    key={cat._id}
                                    type="button"
                                    onClick={() =>
                                        setActiveCategory(cat.name)
                                    }
                                    className={`${css.categoryBtn} ${
                                        activeCategory === cat.name
                                            ? css.active
                                            : ""
                                    }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {current && current.products.length > 0 ? (
                            <div className={css.products}>
                                {current.products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        item={product}
                                        restaurantId={selectedRestaurant}
                                        categorySlug={current.name}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className={css.empty}>
                                V této kategorii zatím nejsou žádné produkty.
                            </p>
                        )}
                    </>
                )}
            </div>

            {pendingSwitch && (
                <div
                    className={css.confirmBackdrop}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="restaurant-switch-title"
                    onClick={cancelSwitch}
                >
                    <div
                        className={css.confirmDialog}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2
                            id="restaurant-switch-title"
                            className={css.confirmTitle}
                        >
                            Přepnout restauraci?
                        </h2>

                        <p className={css.confirmText}>
                            Košík obsahuje položky z restaurace{" "}
                            <strong>
                                {cartRestaurantId
                                    ? RESTAURANT_LABELS[cartRestaurantId]
                                    : ""}
                            </strong>
                            . Přepnutím na{" "}
                            <strong>
                                {RESTAURANT_LABELS[pendingSwitch]}
                            </strong>{" "}
                            bude košík vyprázdněn.
                        </p>

                        <div className={css.confirmActions}>
                            <button
                                type="button"
                                onClick={cancelSwitch}
                                className={css.confirmCancel}
                            >
                                Zrušit
                            </button>

                            <button
                                type="button"
                                onClick={confirmSwitch}
                                className={css.confirmAccept}
                                autoFocus
                            >
                                Vyprázdnit a přepnout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

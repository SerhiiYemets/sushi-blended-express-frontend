"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ProductCard from "@/components/ProductCard/ProductCard";
import { getMenu } from "@/lib/api/clientApi";
import { useSelectedRestaurant } from "@/lib/store/restaurantStore";
import {
    RESTAURANT_LABELS,
    type RestaurantId,
} from "@/lib/restaurants";
import {
    requestRestaurantSwitch,
    useCartCount,
    useCartRestaurantId,
} from "@/lib/store/cartStore";

import css from "./Menu.module.css";

const RESTAURANT_OPTIONS: RestaurantId[] = ["kolin", "jihlava"];

export default function MenuClient() {
    const selectedRestaurant = useSelectedRestaurant();

    const cartCount = useCartCount();
    const cartRestaurantId = useCartRestaurantId();

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["menu", selectedRestaurant],
        queryFn: () => getMenu(selectedRestaurant),
        staleTime: 60_000,
    });

    const menu = useMemo(() => data ?? [], [data]);

    const [requestedCategory, setRequestedCategory] = useState<string | null>(
        null
    );

    const activeCategory = useMemo(() => {
        if (menu.length === 0) return null;
        if (
            requestedCategory &&
            menu.some((c) => c.name === requestedCategory)
        ) {
            return requestedCategory;
        }
        return menu[0].name;
    }, [menu, requestedCategory]);

    const current = menu.find((category) => category.name === activeCategory);

    const cartHasOtherRestaurant =
        cartCount > 0 &&
        cartRestaurantId !== null &&
        cartRestaurantId !== selectedRestaurant;

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
                                    requestRestaurantSwitch(restaurant)
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

                {cartHasOtherRestaurant && (
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

                {isLoading ? (
                    <div className={css.loading}>Načítání…</div>
                ) : isError ? (
                    <div className={css.loading}>
                        Nepodařilo se načíst menu.{" "}
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className={css.categoryBtn}
                        >
                            Zkusit znovu
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={css.categories}>
                            {menu.map((cat) => (
                                <button
                                    key={cat._id}
                                    type="button"
                                    onClick={() =>
                                        setRequestedCategory(cat.name)
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
        </main>
    );
}

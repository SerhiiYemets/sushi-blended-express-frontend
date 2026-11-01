"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useQuery } from "@tanstack/react-query";

import CategoryOrderInfo from "@/components/CategoryOrderInfo/CategoryOrderInfo";
import ProductCard from "@/components/ProductCard/ProductCard";
import SearchBox from "@/components/SearchBox/SearchBox";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getMenu } from "@/lib/api/clientApi";
import {
    getRestaurantCategories,
    getSushiCategories,
} from "@/lib/menuFilters";
import { createProductFuse, searchProducts } from "@/lib/search";

import type { RestaurantId } from "@/lib/restaurants";

import css from "./RestaurantPage.module.css";

type MenuMode = "sushi" | "restaurant";

type Props = {
    restaurantId: RestaurantId;
};

const SEARCH_DEBOUNCE_MS = 300;

function NavigationIcon({ children }: { children: React.ReactNode }) {
    return (
        <svg
            className={css.navigationIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {children}
        </svg>
    );
}

function DeliveryIcon() {
    return (
        <NavigationIcon>
            <circle cx="6" cy="17" r="2.5" />
            <circle cx="18" cy="17" r="2.5" />
            <path d="M8.5 17h7" />
            <path d="M3.5 17V13h7l2 4" />
            <path d="M15 8h2.5l2.5 9" />
            <path d="M12 6h5v5h-5z" />
            <path d="M2 9h4" />
            <path d="M1 11.5h3" />
        </NavigationIcon>
    );
}

function RestaurantMenuIcon() {
    return (
        <NavigationIcon>
            <circle cx="12" cy="13" r="6" />
            <circle cx="12" cy="13" r="3" />
            <path d="M3 4v5a1.5 1.5 0 0 0 3 0V4" />
            <path d="M4.5 9v11" />
            <path d="M21 4c-1.7 1-2.5 3-2.5 5.5H21" />
            <path d="M21 4v16" />
        </NavigationIcon>
    );
}

function StoreIcon() {
    return (
        <NavigationIcon>
            <path d="M4 10v10h16V10" />
            <path d="M3 5l1.5-2h15L21 5v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" />
            <path d="M10 20v-5h4v5" />
        </NavigationIcon>
    );
}

function GalleryIcon() {
    return (
        <NavigationIcon>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="2" />
            <path d="M3 17l5-4.5 4 3.5 3-2.5 6 5" />
        </NavigationIcon>
    );
}

export default function RestaurantPageClient({ restaurantId }: Props) {
    const [mode, setMode] = useState<MenuMode>("sushi");
    const [searchInput, setSearchInput] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
        null
    );

    const menuRef = useRef<HTMLElement | null>(null);
    const categoryTitleRef = useRef<HTMLHeadingElement | null>(null);

    const debouncedSearch = useDebouncedValue(
        searchInput,
        SEARCH_DEBOUNCE_MS
    );

    const { data, isLoading, isError } = useQuery({
        queryKey: ["menu", restaurantId],
        queryFn: () => getMenu(restaurantId),
        staleTime: 60_000,
    });

    const menu = useMemo(() => data ?? [], [data]);

    const sushiCategories = useMemo(
        () => getSushiCategories(menu),
        [menu]
    );

    const restaurantCategories = useMemo(
        () => getRestaurantCategories(menu),
        [menu]
    );

    const categories =
        mode === "sushi"
            ? sushiCategories
            : restaurantCategories;

    const currentCategory =
        categories.find(
            (category) => category._id === selectedCategoryId
        ) ??
        categories[0] ??
        null;

    const products = useMemo(
        () =>
            categories.flatMap((category) =>
                Array.isArray(category.products)
                    ? category.products
                    : []
            ),
        [categories]
    );

    const fuse = useMemo(
        () => createProductFuse(products),
        [products]
    );

    const searchResults = useMemo(() => {
        if (!debouncedSearch.trim()) {
            return null;
        }

        return searchProducts(
            fuse,
            products,
            debouncedSearch
        );
    }, [fuse, products, debouncedSearch]);

    const scrollToElement = (element: Element | null) => {
        element?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleModeChange = (nextMode: MenuMode) => {
        flushSync(() => {
            setMode(nextMode);
            setSearchInput("");
            setSelectedCategoryId(null);
        });

        scrollToElement(menuRef.current);
    };

    const handleCategoryChange = (categoryId: string) => {
        flushSync(() => setSelectedCategoryId(categoryId));

        scrollToElement(categoryTitleRef.current);
    };

    const getProductHref = (
        categoryName: string,
        productId: string
    ) =>
        `/restaurace/${restaurantId}/menu/${encodeURIComponent(
            categoryName
        )}/${productId}`;

    useEffect(() => {
        const handleAnchorClick = (event: MouseEvent) => {
            const target = event.target;

            if (!(target instanceof Element)) return;

            const link = target.closest<HTMLAnchorElement>(
                'a[href="#o-nas"], a[href="#galerie"]'
            );

            if (!link) return;

            const href = link.getAttribute("href");
            if (!href) return;

            const section = document.querySelector(href);
            if (!section) return;

            event.preventDefault();

            scrollToElement(section);
        };

        document.addEventListener("click", handleAnchorClick);

        return () => {
            document.removeEventListener(
                "click",
                handleAnchorClick
            );
        };
    }, []);

    return (
        <div className={css.wrapper}>
            <div className={css.decor} aria-hidden="true">
                <span className={css.decorSakura} />
                <span className={css.decorBrush} />
                <span className={css.decorSushi} />
            </div>

            <section className={css.navigation}>
                <button
                    type="button"
                    aria-pressed={mode === "sushi"}
                    onClick={() => handleModeChange("sushi")}
                    className={`${css.navigationButton} ${
                        mode === "sushi"
                            ? css.navigationButtonActive
                            : ""
                    }`}
                >
                    <DeliveryIcon />
                    {restaurantId === "jihlava" ? (
                        <span className={css.navigationLabel}>
                            <span className={css.navigationTitle}>
                                Rozvoz sushi & Menu restaurace
                            </span>{" "}
                            <span className={css.navigationSubtitle}>
                                Jihlava
                            </span>
                        </span>
                    ) : (
                        <span className={css.navigationLabel}>
                            Rozvoz sushi Kolín
                        </span>
                    )}
                </button>

                {restaurantId !== "jihlava" && (
                    <button
                        type="button"
                        aria-pressed={mode === "restaurant"}
                        onClick={() => handleModeChange("restaurant")}
                        className={`${css.navigationButton} ${
                            mode === "restaurant"
                                ? css.navigationButtonActive
                                : ""
                        }`}
                    >
                        <RestaurantMenuIcon />
                        <span className={css.navigationLabel}>
                            Menu restaurace
                        </span>
                    </button>
                )}

                <a
                    href="#o-nas"
                    className={css.navigationButton}
                >
                    <StoreIcon />
                    <span className={css.navigationLabel}>O nás</span>
                </a>

                <a
                    href="#galerie"
                    className={css.navigationButton}
                >
                    <GalleryIcon />
                    <span className={css.navigationLabel}>Galerie</span>
                </a>
            </section>

            <div className={css.search}>
                <SearchBox
                    value={searchInput}
                    onChange={setSearchInput}
                    onClear={() => setSearchInput("")}
                    resultCount={searchResults?.length ?? null}
                />
            </div>

            <section
                ref={menuRef}
                className={`${css.menu} ${css.scrollTarget}`}
            >
                {isLoading ? (
                    <p className={css.loading}>
                        Načítání menu…
                    </p>
                ) : isError ? (
                    <p className={css.empty}>
                        Menu se nepodařilo načíst.
                    </p>
                ) : searchResults ? (
                    <>
                        <h2 className={css.menuTitle}>
                            Výsledky hledání
                        </h2>

                        {searchResults.length > 0 ? (
                            <div className={css.products}>
                                {searchResults.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        item={product}
                                        restaurantId={restaurantId}
                                        categorySlug={
                                            product.categoryName
                                        }
                                        href={getProductHref(
                                            product.categoryName,
                                            product._id
                                        )}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className={css.empty}>
                                Nic jsme nenašli.
                            </p>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className={css.menuTitle}>
                            {mode === "sushi"
                                ? "Sushi"
                                : "Menu restaurace"}
                        </h2>

                        <div className={css.categories}>
                            {categories.map((category) => (
                                <button
                                    key={category._id}
                                    type="button"
                                    onClick={() =>
                                        handleCategoryChange(
                                            category._id
                                        )
                                    }
                                    className={`${css.categoryButton} ${
                                        currentCategory?._id ===
                                        category._id
                                            ? css.categoryButtonActive
                                            : ""
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {currentCategory ? (
                            <>
                                <h3
                                    ref={categoryTitleRef}
                                    className={`${css.categoryTitle} ${css.scrollTarget}`}
                                >
                                    {currentCategory.name}
                                </h3>

                                <div className={css.products}>
                                    {currentCategory.products.map(
                                        (product) => (
                                            <ProductCard
                                                key={product._id}
                                                item={product}
                                                restaurantId={
                                                    restaurantId
                                                }
                                                categorySlug={
                                                    currentCategory.name
                                                }
                                                href={getProductHref(
                                                    currentCategory.name,
                                                    product._id
                                                )}
                                            />
                                        )
                                    )}
                                </div>

                                {currentCategory.orderInfo && (
                                    <CategoryOrderInfo
                                        info={
                                            currentCategory.orderInfo
                                        }
                                    />
                                )}
                            </>
                        ) : (
                            <p className={css.empty}>
                                V této části zatím nejsou žádné kategorie.
                            </p>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

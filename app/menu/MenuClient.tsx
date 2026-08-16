"use client";

import {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import BackToCategories from "@/components/BackToCategories/BackToCategories";
import CategoryOrderInfo from "@/components/CategoryOrderInfo/CategoryOrderInfo";
import ProductCard from "@/components/ProductCard/ProductCard";
import SearchBox from "@/components/SearchBox/SearchBox";
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
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { createProductFuse, searchProducts } from "@/lib/search";
import type { Product } from "@/types/product";

import css from "./Menu.module.css";

const RESTAURANT_OPTIONS: RestaurantId[] = ["kolin", "jihlava"];
const SEARCH_PARAM = "search";
const SEARCH_DEBOUNCE_MS = 300;

const PAGE_SIZE = 9;

/**
 * Memoized product grid with incremental (lazy) rendering. Re-renders only when
 * the `products` array reference or `restaurantId` actually change — so typing
 * (which only changes the input buffer) never re-renders the cards between
 * debounce ticks.
 *
 * Only the first {@link PAGE_SIZE} cards render initially; an IntersectionObserver
 * watching a sentinel below the grid reveals the next batch as the user scrolls,
 * until the whole list is shown. This keeps large categories cheap to mount
 * without paginating away from search / category filtering (the full `products`
 * array is still the source of truth — we only limit how many we paint).
 */
const MenuProducts = memo(function MenuProducts({
    products,
    restaurantId,
}: {
    products: Product[];
    restaurantId: RestaurantId;
}) {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const [trackedProducts, setTrackedProducts] = useState(products);
    if (products !== trackedProducts) {
        setTrackedProducts(products);
        setVisibleCount(PAGE_SIZE);
    }

    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const hasMore = visibleCount < products.length;

    useEffect(() => {
        if (!hasMore) return;

        const node = sentinelRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisibleCount((count) =>
                        Math.min(count + PAGE_SIZE, products.length)
                    );
                }
            },
            { rootMargin: "200px 0px" }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [hasMore, visibleCount, products.length]);

    return (
        <>
            <div className={css.products}>
                {products.slice(0, visibleCount).map((product) => (
                    <ProductCard
                        key={product._id}
                        item={product}
                        restaurantId={restaurantId}
                        categorySlug={product.categoryName}
                    />
                ))}
            </div>

            {hasMore && (
                <div
                    ref={sentinelRef}
                    className={css.loadMore}
                    role="status"
                    aria-live="polite"
                >
                    <span className={css.loadMoreSpinner} aria-hidden="true" />
                    Načítání dalších produktů…
                </div>
            )}
        </>
    );
});

export default function MenuClient() {
    const selectedRestaurant = useSelectedRestaurant();

    const cartCount = useCartCount();
    const cartRestaurantId = useCartRestaurantId();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["menu", selectedRestaurant],
        queryFn: () => getMenu(selectedRestaurant),
        staleTime: 60_000,
    });

    const menu = useMemo(() => data ?? [], [data]);

    const urlSearch = searchParams.get(SEARCH_PARAM) ?? "";
    const [searchInput, setSearchInput] = useState(urlSearch);
    const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

    const [syncedUrlSearch, setSyncedUrlSearch] = useState(urlSearch);
    if (urlSearch !== syncedUrlSearch) {
        setSyncedUrlSearch(urlSearch);
        setSearchInput(urlSearch);
    }

    useEffect(() => {
        const next = debouncedSearch.trim();
        if (next === urlSearch) return;

        const params = new URLSearchParams(searchParams.toString());
        if (next) params.set(SEARCH_PARAM, next);
        else params.delete(SEARCH_PARAM);

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
            scroll: false,
        });
    }, [debouncedSearch, urlSearch, pathname, router, searchParams]);

    const handleClearSearch = useCallback(() => setSearchInput(""), []);

    const allProducts = useMemo(
        () =>
            menu
                .flatMap((category) =>
                    Array.isArray(category?.products) ? category.products : []
                )
                .filter((product): product is Product => Boolean(product)),
        [menu]
    );

    const fuse = useMemo(() => createProductFuse(allProducts), [allProducts]);

    const searchResults = useMemo(() => {
        if (!debouncedSearch.trim()) return null;
        return searchProducts(fuse, allProducts, debouncedSearch);
    }, [fuse, allProducts, debouncedSearch]);

    const isSearching = searchResults !== null;

    const [requestedCategory, setRequestedCategory] = useState<string | null>(
        null
    );

    const activeCategory = useMemo(() => {
        if (menu.length === 0) return null;
        if (requestedCategory && menu.some((c) => c.name === requestedCategory)) {
            return requestedCategory;
        }
        return menu[0].name;
    }, [menu, requestedCategory]);

    const current = menu.find((category) => category.name === activeCategory);

    // ── Scroll-to-category ────────────────────────────────────────
    // Smooth-scroll to the first product card after the user picks a category.
    // `shouldScrollRef` gates the scroll so it only fires on an explicit click —
    // never on first load, a restaurant switch, or a search-driven change.
    const productsRef = useRef<HTMLDivElement | null>(null);
    const shouldScrollRef = useRef(false);

    const handleSelectCategory = useCallback((name: string) => {
        shouldScrollRef.current = true;
        setRequestedCategory(name);
    }, []);

    useEffect(() => {
        if (!shouldScrollRef.current) return;
        shouldScrollRef.current = false;
        productsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, [activeCategory]);

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
                                <span className={css.restaurantPin} aria-hidden>
                                    📍
                                </span>
                                <span className={css.restaurantLabel}>
                                    {RESTAURANT_LABELS[restaurant]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <SearchBox
                    value={searchInput}
                    onChange={setSearchInput}
                    onClear={handleClearSearch}
                    resultCount={searchResults?.length ?? null}
                />

                {cartHasOtherRestaurant && (
                    <p className={css.cartHint} role="status" aria-live="polite">
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
                ) : isSearching ? (
                    searchResults.length > 0 ? (
                        <MenuProducts
                            products={searchResults}
                            restaurantId={selectedRestaurant}
                        />
                    ) : (
                        <p className={css.empty}>
                            Pro „{debouncedSearch.trim()}“ jsme nic nenašli.
                        </p>
                    )
                ) : (
                    <>
                        <div className={css.categories}>
                            {menu.map((cat) => (
                                <button
                                    key={cat._id}
                                    type="button"
                                    onClick={() =>
                                        handleSelectCategory(cat.name)
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

                        <div
                            ref={productsRef}
                            className={css.productsAnchor}
                        >
                            {current && current.products.length > 0 ? (
                                <>
                                    <MenuProducts
                                        products={current.products}
                                        restaurantId={selectedRestaurant}
                                    />

                                    {current.orderInfo && (
                                        <CategoryOrderInfo
                                            info={current.orderInfo}
                                        />
                                    )}
                                </>
                            ) : (
                                <p className={css.empty}>
                                    V této kategorii zatím nejsou žádné
                                    produkty.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>

            <BackToCategories />
        </main>
    );
}

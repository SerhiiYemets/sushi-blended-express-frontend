import Fuse, { type IFuseOptions } from "fuse.js";

import type { Product } from "@/types/product";

/**
 * Lower-cases and strips diacritics so Czech queries match accent-insensitively
 * ("rizek" matches "řízek", "losos" matches "Losos").
 *
 * Null-safe: any non-string input (undefined, null, number, object…) yields an
 * empty string, so malformed product data can never crash the index.
 */
export function normalizeText(value: unknown): string {
    if (typeof value !== "string" || value.length === 0) return "";
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

/**
 * Extracts searchable text from a single ingredient. Tolerates both the schema
 * shape (a plain string) and a defensive `{ name }` object, plus null/undefined.
 */
function ingredientText(ingredient: unknown): string {
    if (typeof ingredient === "string") return normalizeText(ingredient);
    if (ingredient && typeof ingredient === "object" && "name" in ingredient) {
        return normalizeText((ingredient as { name?: unknown }).name);
    }
    return "";
}

/** Normalized names of every composition group, skipping malformed entries. */
function compositionNames(product: Product): string[] {
    if (!Array.isArray(product.composition)) return [];
    return product.composition
        .map((group) => normalizeText(group?.name))
        .filter(Boolean);
}

/** Normalized ingredient text across every composition group, null-safe. */
function ingredientNames(product: Product): string[] {
    if (!Array.isArray(product.composition)) return [];
    return product.composition
        .flatMap((group) =>
            Array.isArray(group?.ingredients) ? group.ingredients : []
        )
        .map(ingredientText)
        .filter(Boolean);
}

/**
 * Fuse.js configuration for product search.
 *
 * - `threshold: 0.35` → typo tolerant (lasos→losos, philadelfia→philadelphia).
 * - `ignoreLocation: true` → a match anywhere in the field counts.
 * - `includeScore: false` → we only need the matched items.
 *
 * Every key reads its value through a null-safe `getFn`, so missing
 * name/categoryName/description/ingredients never throw.
 */
export const PRODUCT_SEARCH_OPTIONS: IFuseOptions<Product> = {
    threshold: 0.35,
    ignoreLocation: true,
    includeScore: false,
    keys: [
        { name: "name", getFn: (p) => normalizeText(p.name) },
        { name: "categoryName", getFn: (p) => normalizeText(p.categoryName) },
        { name: "description", getFn: (p) => normalizeText(p.description) },
        { name: "compositionName", getFn: compositionNames },
        { name: "ingredients", getFn: ingredientNames },
    ],
};

/** Builds a Fuse index for the given products (expensive → memoize on `menu`). */
export function createProductFuse(products: Product[]): Fuse<Product> {
    return new Fuse(products, PRODUCT_SEARCH_OPTIONS);
}

/**
 * Fuzzy-searches products. An empty/blank query returns all products
 * (fallback), otherwise the typo-tolerant Fuse matches, in relevance order.
 */
export function searchProducts(
    fuse: Fuse<Product>,
    products: Product[],
    query: string
): Product[] {
    const normalized = normalizeText(query.trim());
    if (!normalized) return products;
    return fuse.search(normalized).map((result) => result.item);
}

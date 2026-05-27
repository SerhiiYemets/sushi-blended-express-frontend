import "server-only";

import type { MenuCategory } from "@/types/menu";
import type { Product, ProductDetails } from "@/types/product";
import {
    isRestaurantId,
    resolveRestaurantId,
    VALID_RESTAURANTS,
    type RestaurantId,
} from "@/lib/restaurants";

export { isRestaurantId, resolveRestaurantId, VALID_RESTAURANTS };

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export class NotFoundError extends Error {
    constructor(message = "Not found") {
        super(message);
        this.name = "NotFoundError";
    }
}

async function fetchMenu(restaurantId: RestaurantId): Promise<MenuCategory[]> {
    const res = await fetch(
        `${API_URL}/api/restaurants/${restaurantId}/menu`,
        {
            next: {
                revalidate: 60,
                tags: [`menu:${restaurantId}`],
            },
        }
    );

    if (res.status === 404) {
        throw new NotFoundError(
            `Menu for restaurant "${restaurantId}" not found`
        );
    }

    if (!res.ok) {
        throw new Error(
            `Failed to fetch menu for "${restaurantId}" (status ${res.status})`
        );
    }

    return res.json();
}

function findProductInMenu(
    menu: MenuCategory[],
    productId: string
): { product: Product; category: MenuCategory } | null {
    for (const category of menu) {
        const product = category.products.find((p) => p._id === productId);
        if (product) return { product, category };
    }
    return null;
}

export async function getProductFromMenu(
    restaurantId: RestaurantId,
    productId: string
): Promise<ProductDetails> {
    const menu = await fetchMenu(restaurantId);
    const match = findProductInMenu(menu, productId);

    if (!match) {
        throw new NotFoundError(
            `Product ${productId} not found in ${restaurantId}`
        );
    }

    const { product, category } = match;

    return {
        ...product,
        categoryId: product.categoryId ?? category._id,
        description: product.description ?? "",
    };
}

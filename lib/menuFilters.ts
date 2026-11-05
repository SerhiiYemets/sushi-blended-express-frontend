import type { Category } from "@/types/menu";

export function getSushiCategories(menu: Category[]): Category[] {
    return menu.filter((category) => category.purchasable !== false);
}

export function getRestaurantCategories(menu: Category[]): Category[] {
    return menu.filter((category) => category.purchasable === false);
}
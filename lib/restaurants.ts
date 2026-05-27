export type RestaurantId = "kolin" | "jihlava";

export const VALID_RESTAURANTS: readonly RestaurantId[] = ["kolin", "jihlava"];

export const RESTAURANT_LABELS: Record<RestaurantId, string> = {
    kolin: "Kolín",
    jihlava: "Jihlava",
};

export function isRestaurantId(value: unknown): value is RestaurantId {
    return (
        typeof value === "string" &&
        (VALID_RESTAURANTS as readonly string[]).includes(value)
    );
}

export function resolveRestaurantId(value: unknown): RestaurantId {
    return isRestaurantId(value) ? value : "kolin";
}

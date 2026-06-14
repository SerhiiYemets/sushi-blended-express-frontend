export type RestaurantId = "kolin" | "jihlava";

export const VALID_RESTAURANTS: readonly RestaurantId[] = ["kolin", "jihlava"];

export const RESTAURANT_LABELS: Record<RestaurantId, string> = {
    kolin: "Kolín",
    jihlava: "Jihlava",
};

/**
 * Default map centre for each restaurant (city centre). Used purely to position
 * the delivery map before the customer picks a point — the backend remains the
 * source of truth for whether a coordinate is actually deliverable.
 */
export const RESTAURANT_COORDS: Record<
    RestaurantId,
    { lat: number; lng: number }
> = {
    kolin: { lat: 50.0283, lng: 15.2003 },
    jihlava: { lat: 49.3984, lng: 15.5905 },
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

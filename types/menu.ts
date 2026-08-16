import type { Product } from "./product";

/**
 * Informational block shown instead of the cart controls for display-only
 * categories. Comes from the backend category override config
 * (src/config/categoryOverrides.js), not from Poster.
 */
export type CategoryOrderInfo = {
    text: string;
    /** Dial-ready number for the `tel:` href, e.g. "+420721479332". */
    phone: string;
    /** Human-readable number, e.g. "+420 721 479 332". */
    phoneLabel: string;
};

export type Category = {
    _id: string;
    name: string;
    /** `false` for display-only categories (phone orders only). */
    purchasable?: boolean;
    orderInfo?: CategoryOrderInfo;
    products: Product[];
};

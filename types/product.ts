export type Composition = {
    name: string;
    ingredients: string[];
};

export type Product = {
    _id: string;
    posterProductId: number;
    name: string;
    description: string;
    price: number;
    image: string;
    categoryId: string;
    categoryName: string;
    /**
     * Stamped by the backend menu endpoint from the category override config.
     * `false` means the product is display-only — no cart controls, and the
     * order endpoint rejects it. Absent for normal products.
     */
    purchasable?: boolean;
    weight: string;
    pieces: number | null;
    composition: Composition[];
};

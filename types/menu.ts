import type { Product } from "./product";

export type MenuCategory = {
    _id: string;
    posterCategoryId: number;
    name: string;
    image: string | null;
    products: Product[];
};

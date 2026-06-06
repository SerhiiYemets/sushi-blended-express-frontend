import type { Product } from "./product";

export type Category = {
    _id: string;
    name: string;
    products: Product[];
};

export type Product = {
    _id: string;
    posterProductId: number;

    name: string;
    price: number;

    weight?: string;
    image?: string | null;
    description?: string;

    categoryId?: string;

    available: boolean;
    hidden: boolean;
};

export type ProductDetails = Product & {
    description: string;
    ingredients?: string[];
};
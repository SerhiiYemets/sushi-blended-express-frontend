export type Product = {
    _id: string;
    name: string;
    price: number;
    weight?: string;
    image?: string | null;
    description?: string;
    categoryId?: string;
};

export type ProductDetails = Product & {
    description: string;
    ingredients?: string[];
};

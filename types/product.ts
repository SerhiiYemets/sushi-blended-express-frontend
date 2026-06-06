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
    weight: string;
    pieces: number | null;
    composition: Composition[];
};

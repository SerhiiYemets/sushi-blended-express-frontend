import type { RestaurantId } from "@/lib/store/restaurantStore";

export type CartItem = {
    _id: string;
    name: string;
    price: number;
    image?: string | null;
    weight?: string;
    quantity: number;
    restaurantId?: RestaurantId;
};

export type CartState = {
    items: CartItem[];
};

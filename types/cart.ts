import type { RestaurantId } from "@/lib/restaurants";

export type CartItem = {
    _id: string;
    posterProductId: number;
    name: string;
    price: number;
    image?: string | null;
    weight?: string;
    quantity: number;
    restaurantId: RestaurantId;
};

export type CartState = {
    items: CartItem[];
};

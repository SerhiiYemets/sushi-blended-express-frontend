import type { RestaurantId } from "@/lib/restaurants";

export type RestaurantAdmin = {
    _id: string;
    name: string;
    email: string;
    role: "restaurantAdmin";
    restaurantId: RestaurantId;
};

export type AdminLoginPayload = {
    email: string;
    password: string;
};
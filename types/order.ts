import type { RestaurantId } from "@/lib/restaurants";

export type OrderItemInput = {
    productId: string;
    quantity: number;
};

export type OrderItem = {
    productId: string;
    quantity: number;
    name?: string;
    price?: number;
    image?: string | null;
    weight?: string;
};

export type OrderStatus =
    | "new"
    | "confirmed"
    | "cooking"
    | "delivery"
    | "completed";

export type OrderCustomer = {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;

    address?: string;
    deliveryNotes?: string;
    peopleCount: number;
};

export type OrderPayload = {
    restaurantId: RestaurantId;

    customer: OrderCustomer;

    deliveryType: "delivery" | "pickup";
    paymentMethod: "cash" | "card";

    items: OrderItemInput[];
};

export type Order = {
    _id: string;
    userId?: string | null;

    restaurantId?: RestaurantId;

    customer: OrderCustomer;

    deliveryType: OrderPayload["deliveryType"];
    paymentMethod: OrderPayload["paymentMethod"];

    items: OrderItem[];

    subtotal?: number;
    deliveryFee?: number;
    totalPrice?: number;

    status: OrderStatus;

    createdAt: string;
    updatedAt?: string;
};

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

    /** Whether the customer wants ASAP delivery or a scheduled slot. */
    deliveryMode: "asap" | "scheduled";

    /** Scheduled calendar date ("YYYY-MM-DD"); omitted/empty for ASAP. */
    deliveryDate?: string;

    /** Scheduled "HH:MM" slot within business hours; omitted/empty for ASAP. */
    deliveryTime?: string;

    items: OrderItemInput[];
};

export type Order = {
    _id: string;
    userId?: string | null;

    restaurantId?: RestaurantId;

    customer: OrderCustomer;

    deliveryType: OrderPayload["deliveryType"];
    paymentMethod: OrderPayload["paymentMethod"];
    deliveryMode?: OrderPayload["deliveryMode"];
    deliveryDate?: string;
    deliveryTime?: string;

    items: OrderItem[];

    subtotal?: number;
    deliveryFee?: number;
    totalPrice?: number;

    status: OrderStatus;

    createdAt: string;
    updatedAt?: string;
};

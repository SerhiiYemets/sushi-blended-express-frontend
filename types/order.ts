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

    /**
     * Map-selected delivery coordinates. Sent for delivery orders so the
     * backend can compute the delivery fee itself; omitted for pickup.
     */
    deliveryLocation?: {
        lat: number;
        lng: number;
    };

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

/**
 * Payload broadcast by the backend on the Socket.IO `"new-order"` event.
 *
 * The realtime channel is intentionally typed loosely: the backend may send a
 * full {@link Order}, a trimmed projection, or extra fields we don't model yet.
 * Fields are optional so the notification handler can read them defensively and
 * fall back gracefully. The index signature keeps unknown fields type-safe.
 */
export type NewOrderEvent = Partial<Order> & {
    /** Human-facing short order number shown in the toast (e.g. 12345). */
    orderNumber?: string | number;
    /** Pre-resolved restaurant label, if the backend already sends one. */
    restaurant?: string;
    [key: string]: unknown;
};

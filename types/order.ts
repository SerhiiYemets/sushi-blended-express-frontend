export type OrderItem = {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?: string | null;
    weight?: string;
};

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "preparing"
    | "delivering"
    | "completed"
    | "cancelled";

export type OrderPayload = {
    customer: {
        firstName: string;
        lastName: string;
        phone: string;
        email?: string;
    };

    deliveryType: "delivery" | "pickup";
    address?: string;
    peopleCount: number;
    notes?: string;
    paymentMethod: "cash" | "card";
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    totalPrice: number;
};

export type Order = {
    _id: string;
    userId?: string;
    customer: OrderPayload["customer"];
    deliveryType: OrderPayload["deliveryType"];
    address?: string;
    peopleCount: number;
    notes?: string;
    paymentMethod: OrderPayload["paymentMethod"];
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    totalPrice: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt?: string;
};

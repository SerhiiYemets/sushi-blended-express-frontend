export type OrderItem = {
    productId: string;
    name: string;
    quantity: number;
    price: number;
};

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


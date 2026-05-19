export type DeliveryType = "delivery" | "pickup";
export type PaymentMethod = "cash" | "card";

export type User = {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
    phone: string;
    address: string;
    apartment: string;
    deliveryNotes: string;
    defaultDeliveryType: DeliveryType;
    preferredPaymentMethod: PaymentMethod;
    peopleCount: number;
};

export type ProfileUpdatePayload = Partial<
    Pick<
        User,
        | "name"
        | "lastName"
        | "phone"
        | "address"
        | "apartment"
        | "deliveryNotes"
        | "defaultDeliveryType"
        | "preferredPaymentMethod"
        | "peopleCount"
    >
>;

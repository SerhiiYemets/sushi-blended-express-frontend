import type { RestaurantId } from "@/lib/restaurants";

export type Event = {
    _id: string;
    restaurantId: RestaurantId;
    title: string;
    description: string;
    imageUrl: string;
    startAt: string | null;
    endAt: string | null;
    active: boolean;
    buttonText: string;
    buttonUrl: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateEventPayload = {
    title: string;
    description?: string;
    imageUrl?: string;
    startAt?: string | null;
    endAt?: string | null;
    active?: boolean;
    buttonText?: string;
    buttonUrl?: string;
};

export type UpdateEventPayload = Partial<CreateEventPayload>;
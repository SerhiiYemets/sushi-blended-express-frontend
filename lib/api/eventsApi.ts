import axios from "axios";

import type { RestaurantId } from "@/lib/restaurants";
import type { Event } from "@/types/event";

const eventsClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getPublicEvents = async (
    restaurantId: RestaurantId
): Promise<Event[]> => {
    const { data } = await eventsClient.get<Event[]>(
        `/api/restaurants/${restaurantId}/events`
    );

    return data;
};
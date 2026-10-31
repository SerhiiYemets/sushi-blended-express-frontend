
import axios from "axios";

import type { RestaurantId } from "@/lib/restaurants";

export type RestaurantAbout = {
    _id: string;
    restaurantId: RestaurantId;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
};

const restaurantAboutClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getRestaurantAbout = async (
    restaurantId: RestaurantId
): Promise<RestaurantAbout | null> => {
    const { data } = await restaurantAboutClient.get<RestaurantAbout | null>(
        `/api/restaurants/${restaurantId}/about`
    );

    return data;
};


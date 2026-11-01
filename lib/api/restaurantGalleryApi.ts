import axios from "axios";

import type { RestaurantId } from "@/lib/restaurants";

export type GalleryImage = {
    _id: string;
    url: string;
};

export type RestaurantGallery = {
    _id: string;
    restaurantId: RestaurantId;
    title: string;
    images: GalleryImage[];
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
};

export const getRestaurantGalleries = async (
    restaurantId: RestaurantId
): Promise<RestaurantGallery[]> => {
    const { data } = await axios.get<RestaurantGallery[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}/gallery`
    );

    return data;
};

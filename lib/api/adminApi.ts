import axios from "axios";

import type {
    AdminLoginPayload,
    RestaurantAdmin,
} from "@/types/admin";

import type {
    CreateEventPayload,
    Event,
    UpdateEventPayload,
} from "@/types/event";

import { isRestaurantId } from "@/lib/restaurants";

import type { RestaurantAbout } from "@/lib/api/restaurantAboutApi";

const adminClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

adminClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            originalRequest.url !== "/api/auth/login" &&
            originalRequest.url !== "/api/auth/refresh"
        ) {
            originalRequest._retry = true;

            try {
                await adminClient.post("/api/auth/refresh");
                return adminClient(originalRequest);
            } catch {
                if (typeof window !== "undefined") {
                    window.location.href = "/admin/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

const normalizeAdmin = (data: unknown): RestaurantAdmin => {
    if (
        typeof data !== "object" ||
        data === null ||
        !("_id" in data) ||
        !("name" in data) ||
        !("email" in data) ||
        !("role" in data) ||
        !("restaurantId" in data)
    ) {
        throw new Error("Invalid admin account");
    }

    const user = data as Record<string, unknown>;

    if (
        user.role !== "restaurantAdmin" ||
        !isRestaurantId(user.restaurantId)
    ) {
        throw new Error("This account is not a restaurant administrator");
    }

    return {
        _id: String(user._id),
        name: String(user.name),
        email: String(user.email),
        role: "restaurantAdmin",
        restaurantId: user.restaurantId,
    };
};

export const adminLogin = async (
    payload: AdminLoginPayload
): Promise<RestaurantAdmin> => {
    await adminClient.post("/api/auth/login", payload);

    try {
        return await getAdminMe();
    } catch (error) {
        await adminClient.post("/api/auth/logout").catch(() => undefined);
        throw error;
    }
};

export const getAdminMe = async (): Promise<RestaurantAdmin> => {
    const { data } = await adminClient.get("/api/users/me");
    return normalizeAdmin(data);
};

export const adminLogout = async (): Promise<void> => {
    await adminClient.post("/api/auth/logout");
};

export const getAdminEvents = async (): Promise<Event[]> => {
    const { data } = await adminClient.get<Event[]>("/api/admin/events");
    return data;
};

export const createAdminEvent = async (
    payload: CreateEventPayload
): Promise<Event> => {
    const { data } = await adminClient.post<Event>(
        "/api/admin/events",
        payload
    );

    return data;
};

export const updateAdminEvent = async (
    eventId: string,
    payload: UpdateEventPayload
): Promise<Event> => {
    const { data } = await adminClient.patch<Event>(
        `/api/admin/events/${eventId}`,
        payload
    );

    return data;
};

export const deleteAdminEvent = async (
    eventId: string
): Promise<void> => {
    await adminClient.delete(`/api/admin/events/${eventId}`);
};

export type UpdateAdminAboutPayload = {
    title: string;
    description: string;
    imageUrl: string;
};

export const getAdminAbout = async (): Promise<RestaurantAbout | null> => {
    const { data } = await adminClient.get<RestaurantAbout | null>(
        "/api/admin/about"
    );

    return data;
};

export const updateAdminAbout = async (
    payload: UpdateAdminAboutPayload
): Promise<RestaurantAbout> => {
    const { data } = await adminClient.patch<RestaurantAbout>(
        "/api/admin/about",
        payload
    );

    return data;
};

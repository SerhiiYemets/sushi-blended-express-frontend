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
import type { RestaurantGallery } from "@/lib/api/restaurantGalleryApi";

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
        throw new Error("Недействительная учётная запись администратора");
    }

    const user = data as Record<string, unknown>;

    if (
        user.role !== "restaurantAdmin" ||
        !isRestaurantId(user.restaurantId)
    ) {
        throw new Error("Эта учётная запись не является администратором ресторана");
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


export type CreateAdminGalleryPayload = {
    title: string;
    images: { url: string }[];
    isActive: boolean;
    sortOrder: number;
};

export type UpdateAdminGalleryPayload = Partial<CreateAdminGalleryPayload>;

export const getAdminGalleries = async (): Promise<RestaurantGallery[]> => {
    const { data } = await adminClient.get<RestaurantGallery[]>(
        "/api/admin/gallery"
    );

    return data;
};

export const createAdminGallery = async (
    payload: CreateAdminGalleryPayload
): Promise<RestaurantGallery> => {
    const { data } = await adminClient.post<RestaurantGallery>(
        "/api/admin/gallery",
        payload
    );

    return data;
};

export const updateAdminGallery = async (
    galleryId: string,
    payload: UpdateAdminGalleryPayload
): Promise<RestaurantGallery> => {
    const { data } = await adminClient.patch<RestaurantGallery>(
        `/api/admin/gallery/${encodeURIComponent(galleryId)}`,
        payload
    );

    return data;
};

export const deleteAdminGallery = async (
    galleryId: string
): Promise<void> => {
    await adminClient.delete(
        `/api/admin/gallery/${encodeURIComponent(galleryId)}`
    );
};

export type AdminUploadPurpose = "gallery" | "events" | "about";

export type AdminUploadResult = {
    url: string;
    key: string;
    contentType: string;
    size: number;
};

export const ADMIN_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;

const ADMIN_UPLOAD_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
]);

const ADMIN_UPLOAD_EXTENSIONS = /\.(jpe?g|png|webp|avif)$/i;

export const ADMIN_UPLOAD_ACCEPT =
    "image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif";

export const validateAdminImageFile = (file: File): string | null => {
    const typeAllowed = file.type
        ? ADMIN_UPLOAD_TYPES.has(file.type.toLowerCase())
        : ADMIN_UPLOAD_EXTENSIONS.test(file.name);

    if (!typeAllowed) {
        return "Неподдерживаемый формат. Разрешены JPEG, PNG, WebP и AVIF.";
    }

    if (file.size === 0) {
        return "Файл пустой.";
    }

    if (file.size > ADMIN_UPLOAD_MAX_BYTES) {
        return "Файл слишком большой (максимум 5 МБ).";
    }

    return null;
};

export const uploadAdminImage = async (
    file: File,
    purpose: AdminUploadPurpose
): Promise<AdminUploadResult> => {
    const formData = new FormData();
    formData.append("purpose", purpose);
    formData.append("image", file);

    const { data } = await adminClient.post<AdminUploadResult>(
        "/api/admin/uploads",
        formData
    );

    if (!data || typeof data.url !== "string" || !data.url) {
        throw new Error("Сервер не вернул адрес изображения.");
    }

    return data;
};

const UPLOAD_ERROR_MESSAGES: Record<number, string> = {
    400: "Некорректный файл изображения.",
    401: "Сессия истекла. Войдите в админ-панель снова.",
    403: "Нет прав на загрузку изображений для этого ресторана.",
    413: "Файл слишком большой (максимум 5 МБ).",
    415: "Неподдерживаемый формат. Разрешены JPEG, PNG, WebP и AVIF.",
    429: "Слишком много загрузок. Попробуйте немного позже.",
    502: "Не удалось сохранить изображение в хранилище. Попробуйте ещё раз.",
    503: "Хранилище изображений сейчас недоступно. Попробуйте позже.",
};

export const getUploadErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status && UPLOAD_ERROR_MESSAGES[status]) {
            return UPLOAD_ERROR_MESSAGES[status];
        }

        if (!error.response) {
            return "Нет соединения с сервером. Проверьте интернет и попробуйте ещё раз.";
        }

        return "Не удалось загрузить изображение.";
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return "Не удалось загрузить изображение.";
};


import axios from "axios";
import type {
    AuthResult,
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    RegisterResponse,
} from "@/types/auth";
import type { MenuCategory } from "@/types/menu";
import type { Order } from "@/types/order";
import type { ProfileUpdatePayload, User } from "@/types/user";
import type { RestaurantId } from "@/lib/store/restaurantStore";

const clientApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

clientApi.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/api/auth/login" &&
            originalRequest.url !== "/api/auth/refresh"
        ) {
            originalRequest._retry = true;

            try {
                await clientApi.post("/api/auth/refresh");
                return clientApi(originalRequest);
            } catch {
                if (typeof window !== "undefined") {
                    localStorage.removeItem("auth-storage");
                    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                }
            }
        }

        return Promise.reject(error);
    }
);

export default clientApi;

export const login = async (
    payload: LoginPayload
): Promise<AuthResult> => {
    await clientApi.post<LoginResponse>("/api/auth/login", payload);
    const user = await getMe();
    return { user };
};

export const register = async (
    payload: RegisterPayload
): Promise<AuthResult> => {
    const { data } = await clientApi.post<RegisterResponse>(
        "/api/auth/register",
        payload
    );

    try {
        await clientApi.post<LoginResponse>("/api/auth/login", {
            email: payload.email,
            password: payload.password,
        });

        const user = await getMe();
        return { user };
    } catch {
        return {
            user: {
                _id: data.id,
                name: data.name,
                email: data.email,
                avatarUrl: "",
                lastName: "",
                phone: "",
                address: "",
                apartment: "",
                deliveryNotes: "",
                defaultDeliveryType: "delivery",
                preferredPaymentMethod: "cash",
                peopleCount: 1,
            },
        };
    }
};

export const logout = async (): Promise<void> => {
    await clientApi.post("/api/auth/logout");
};

export const getMenu = async (
    restaurantId: RestaurantId
): Promise<MenuCategory[]> => {
    const res = await clientApi.get<MenuCategory[]>(
        `/api/restaurants/${restaurantId}/menu`
    );

    return res.data;
};

export const getMe = async (): Promise<User> => {
    const res = await clientApi.get<User>("/api/users/me");
    return res.data;
};

export const updateMe = async (
    payload: ProfileUpdatePayload
): Promise<User> => {
    const res = await clientApi.patch<User>("/api/users/me", payload);
    return res.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
    const res = await clientApi.get<Order[]>("/api/users/me/orders");
    return res.data;
};

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};

export const changePassword = async (
    payload: ChangePasswordPayload
): Promise<{ message: string }> => {
    const res = await clientApi.patch<{ message: string }>(
        "/api/users/me/password",
        payload
    );
    return res.data;
};

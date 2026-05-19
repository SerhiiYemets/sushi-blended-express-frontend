import axios from "axios";
import type {
    AuthResult,
    LoginPayload,
    LoginResponse,
    RegisterPayload,
    RegisterResponse,
} from "@/types/auth";
import type { MenuCategory } from "@/types/menu";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";
import type { ProfileUpdatePayload, User } from "@/types/user";

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
    await clientApi.post<RegisterResponse>("/api/auth/register", payload);

    await clientApi.post<LoginResponse>("/api/auth/login", {
        email: payload.email,
        password: payload.password,
    });

    const user = await getMe();
    return { user };
};

export const logout = async (): Promise<void> => {
    await clientApi.post("/api/auth/logout");
};

export const getMenu = async (): Promise<MenuCategory[]> => {
    const res = await clientApi.get<MenuCategory[]>("/api/menu");
    return res.data;
};

export const getProducts = async (): Promise<Product[]> => {
    const res = await clientApi.get<Product[]>("/api/products");
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

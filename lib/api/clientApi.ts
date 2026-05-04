import axios from "axios";
import type {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
} from "@/types/auth";
import type { MenuCategory } from "@/types/menu";
import type { Product } from "@/types/product";

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
            originalRequest.url !== "/api/auth/login"
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

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await clientApi.post<AuthResponse>("/api/auth/login", data);
    return res.data;
};

export const register = async (
    data: RegisterPayload
): Promise<AuthResponse> => {
    const res = await clientApi.post<AuthResponse>("/api/auth/register", data);
    return res.data;
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


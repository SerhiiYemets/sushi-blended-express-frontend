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
        originalRequest.url !== "/auth/login"
        ) {
        originalRequest._retry = true;

        try {
            await clientApi.post("/auth/session");
            return clientApi(originalRequest);
        } catch {
            localStorage.removeItem("auth-storage");
        }
        }

        return Promise.reject(error);
    }
);

export default clientApi;

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await clientApi.post<AuthResponse>("/auth/login", data);
    return res.data;
};

export const register = async (
    data: RegisterPayload
): Promise<AuthResponse> => {
    const res = await clientApi.post<AuthResponse>("/auth/register", data);
    return res.data;
};

export const logout = async (): Promise<void> => {
    await clientApi.post("/auth/logout");
};

export const getMe = async (): Promise<AuthResponse> => {
    const res = await clientApi.get<AuthResponse>("/users/me");
    return res.data;
};

export const getMenu = async (): Promise<MenuCategory[]> => {
    const res = await clientApi.get<MenuCategory[]>("/menu");
    return res.data;
};

export const getProducts = async (): Promise<Product[]> => {
    const res = await clientApi.get<Product[]>("/products");
    return res.data;
};


"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/lib/store/authStore";
import { login, register } from "@/lib/api/clientApi";

type LoginValues = {
    email: string;
    password: string;
};

type RegisterValues = {
    name: string;
    email: string;
    password: string;
};

type FieldName = "name" | "email" | "password";

type AuthHelpers = {
    setFieldError: (field: FieldName, message: string) => void;
    resetForm?: () => void;
};

const ERROR_MAP: Record<string, string> = {
    "Invalid credentials": "Neplatný email nebo heslo",
    "User already exists": "Uživatel již existuje",
    "User not found": "Uživatel nebyl nalezen",
};

function mapErrorMessage(message: string): string {
    return ERROR_MAP[message] || "Něco se pokazilo";
}

function safeRedirect(url: string): string {
    if (!url.startsWith("/") || url.startsWith("//")) return "/";
    return url;
}

type AuthErrorBody = {
    message?: string;
    error?: string;
    response?: { message?: string; error?: string };
};

function readErrorMessage(e: unknown): string {
    if (isAxiosError(e)) {
        const data = e.response?.data as AuthErrorBody | undefined;
        return (
            data?.message ??
            data?.error ??
            data?.response?.message ??
            data?.response?.error ??
            e.message
        );
    }
    if (e instanceof Error) return e.message;
    return "Unknown error";
}

export function useAuth(redirectTo: string = "/") {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    async function submitAuth<T extends LoginValues | RegisterValues>(
        isLogin: boolean,
        values: T,
        helpers: AuthHelpers
    ) {
        const { setFieldError, resetForm } = helpers;

        const loading = toast.loading(
            isLogin ? "Přihlašování..." : "Registrace..."
        );

        try {
            const data = isLogin
                ? await login(values as LoginValues)
                : await register(values as RegisterValues);

            setUser(data.user);
            resetForm?.();

            toast.success(
                isLogin
                    ? "Přihlášení proběhlo úspěšně"
                    : "Registrace proběhla úspěšně"
            );

            router.push(safeRedirect(redirectTo));
            router.refresh();
        } catch (e: unknown) {
            const rawMessage = readErrorMessage(e);
            const message = mapErrorMessage(rawMessage);
            const lower = rawMessage.toLowerCase();

            if (lower.includes("email")) {
                setFieldError("email", message);
            } else if (lower.includes("password") || lower.includes("heslo")) {
                setFieldError("password", message);
            } else {
                toast.error(message);
            }
        } finally {
            toast.dismiss(loading);
        }
    }

    return { submitAuth };
}

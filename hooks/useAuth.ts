"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import type { FormikHelpers } from "formik";
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

const ERROR_MAP: Record<string, string> = {
    "Invalid credentials": "Neplatný email nebo heslo",
    "User already exists": "Uživatel již existuje",
    "User not found": "Uživatel nebyl nalezen",
};

function mapErrorMessage(message: string): string {
    return ERROR_MAP[message] || "Něco se pokazilo";
}

export function useAuth(redirectTo: string = "/") {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);

    async function submitAuth<T extends LoginValues | RegisterValues>(
        isLogin: boolean,
        values: T,
        helpers: FormikHelpers<T>
    ) {
        const { setSubmitting, setFieldError, resetForm } = helpers;

        const loading = toast.loading(
        isLogin ? "Přihlašování..." : "Registrace..."
        );

        try {
        const data = isLogin
            ? await login(values as LoginValues)
            : await register(values as RegisterValues);

        if (!data) throw new Error("User not returned");

        setUser(data);

        resetForm();

        toast.success(
            isLogin ? "Přihlášení proběhlo úspěšně" : "Registrace proběhla úspěšně"
        );

        router.push(redirectTo);
        router.refresh();
        } catch (e: unknown) {
        const rawMessage = isAxiosError(e)
            ? e.response?.data?.response?.message ||
            e.response?.data?.response?.error ||
            e.response?.data?.error ||
            e.message
            : e instanceof Error
            ? e.message
            : "Unknown error";

        const message = mapErrorMessage(rawMessage);

        if (rawMessage.toLowerCase().includes("email")) {
            setFieldError("email", message);
        } else if (rawMessage.toLowerCase().includes("password")) {
            setFieldError("password", message);
        } else {
            toast.error(message);
        }
        } finally {
        toast.dismiss(loading);
        setSubmitting(false);
        }
    }

    return { submitAuth };
}
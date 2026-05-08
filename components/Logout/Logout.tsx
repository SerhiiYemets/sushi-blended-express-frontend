"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Icon from "@/components/Icon/Icon";
import { logout as logoutRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./Logout.module.css";

export default function Logout() {
    const router = useRouter();
    const clearUser = useAuthStore((s) => s.logout);

    const [pending, setPending] = useState(false);

    const handleLogout = async () => {
        if (pending) return;

        setPending(true);

        try {
            await logoutRequest();
        } catch {
        } finally {
            clearUser();

            toast.success("Odhlášení proběhlo úspěšně");

            router.replace("/");
            router.refresh();

            setPending(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={pending}
            aria-label="Odhlásit se"
            title="Odhlásit se"
            className={css.button}
        >
            <Icon name="logout" width={20} height={20} aria-hidden="true" />
        </button>
    );
}
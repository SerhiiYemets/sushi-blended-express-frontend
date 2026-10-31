
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import AdminLayout from "@/components/Admin/AdminLayout/AdminLayout";
import {
    getAdminAbout,
    getAdminMe,
    updateAdminAbout,
} from "@/lib/api/adminApi";

import type { UpdateAdminAboutPayload } from "@/lib/api/adminApi";

import type { RestaurantAdmin } from "@/types/admin";
import type { RestaurantAbout } from "@/lib/api/restaurantAboutApi";

import css from "@/components/Admin/AdminEvents.module.css";

import AdminAboutForm from "@/components/Admin/AdminAboutForm";

const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (typeof message === "string") {
            return message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Nepodařilo se načíst informace o restauraci.";
};

export default function AdminAboutPage() {
    const router = useRouter();

    const [admin, setAdmin] = useState<RestaurantAdmin | null>(null);
    const [about, setAbout] = useState<RestaurantAbout | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const currentAdmin = await getAdminMe();

                if (cancelled) return;
                setAdmin(currentAdmin);

                const restaurantAbout = await getAdminAbout();

                if (cancelled) return;
                setAbout(restaurantAbout);
            } catch (error) {
                if (cancelled) return;

                if (
                    axios.isAxiosError(error) &&
                    (error.response?.status === 401 ||
                        error.response?.status === 403)
                ) {
                    router.replace("/admin/login");
                    return;
                }

                setError(getErrorMessage(error));
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [router]);

    const handleSave = async (
        payload: UpdateAdminAboutPayload
    ): Promise<void> => {
        setError("");
        setSuccess("");

        try {
            const updatedAbout = await updateAdminAbout(payload);

            setAbout(updatedAbout);
            setSuccess("Změny byly úspěšně uloženy.");
        } catch (error) {
            setError(getErrorMessage(error));
            throw error;
        }
    };

    if (isLoading) {
        return (
            <main className={css.page}>
                <div className={css.container}>
                    Načítání administrace...
                </div>
            </main>
        );
    }

    if (!admin) {
        return (
            <main className={css.page}>
                <div className={css.container}>
                    <p className={css.error}>
                        {error || "Administrace není dostupná."}
                    </p>
                </div>
            </main>
        );
    }

    return (
        <AdminLayout admin={admin}>
            <main className={css.page}>
                <div className={css.container}>
                    <header className={css.header}>
                        <h1 className={css.title}>O nás</h1>
                        <p className={css.restaurant}>
                            Informace o restauraci
                        </p>
                    </header>

                    {error && (
                        <p className={css.error} role="alert">
                            {error}
                        </p>
                    )}

                    <section className={css.card}>
                        <h2 className={css.sectionTitle}>
                            Upravit informace o restauraci
                        </h2>

                        {success && (
                            <p role="status">{success}</p>
                        )}

                        <AdminAboutForm
                            initialAbout={about}
                            onSubmit={handleSave}
                        />
                    </section>
                </div>
            </main>
        </AdminLayout>
    );
}

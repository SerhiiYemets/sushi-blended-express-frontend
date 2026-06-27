"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { getMe, getMyOrders } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useHydrated } from "@/hooks/useHydrated";

import ProfileInfoForm from "@/components/Profile/ProfileInfoForm/ProfileInfoForm";
import DeliveryPreferencesForm from "@/components/Profile/DeliveryPreferencesForm/DeliveryPreferencesForm";
import ChangePasswordForm from "@/components/Profile/ChangePasswordForm/ChangePasswordForm";
import OrderHistory from "@/components/Profile/OrderHistory/OrderHistory";

import css from "./ProfilePage.module.css";

const selectUser = (s: ReturnType<typeof useAuthStore.getState>) => s.user;
const selectAuthHydrated = (s: ReturnType<typeof useAuthStore.getState>) =>
    s.isHydrated;
const selectSetUser = (s: ReturnType<typeof useAuthStore.getState>) =>
    s.setUser;
const selectLogout = (s: ReturnType<typeof useAuthStore.getState>) => s.logout;

export default function ProfilePage() {
    const router = useRouter();
    const hydrated = useHydrated();

    const storedUser = useAuthStore(selectUser);
    const authHydrated = useAuthStore(selectAuthHydrated);
    const setUser = useAuthStore(selectSetUser);
    const clearUser = useAuthStore(selectLogout);

    const noStoredSession = authHydrated && !storedUser;

    useEffect(() => {
        if (noStoredSession) {
            router.replace("/login?redirect=/profile");
        }
    }, [noStoredSession, router]);

    const meQuery = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        enabled: authHydrated && !!storedUser,
        retry: false,
    });

    const ordersQuery = useQuery({
        queryKey: ["my-orders"],
        queryFn: getMyOrders,
        enabled: authHydrated && !!storedUser,
        retry: false,
    });

    useEffect(() => {
        if (meQuery.data) {
            setUser(meQuery.data);
        }
    }, [meQuery.data, setUser]);

    useEffect(() => {
        if (
            meQuery.isError &&
            isAxiosError(meQuery.error) &&
            meQuery.error.response?.status === 401
        ) {
            clearUser();
            router.replace("/login?redirect=/profile");
        }
    }, [meQuery.isError, meQuery.error, clearUser, router]);

    if (!hydrated || !authHydrated || noStoredSession) {
        return (
            <main className={css.page}>
                <section className={css.container}>
                    <div className={css.skeleton} aria-busy="true" />
                </section>
            </main>
        );
    }

    if (meQuery.isLoading) {
        return (
            <main className={css.page}>
                <section className={css.container}>
                    <div className={css.skeleton} aria-busy="true" />
                </section>
            </main>
        );
    }

    if (meQuery.isError && !meQuery.data) {
        return (
            <main className={css.page}>
                <section className={css.container}>
                    <div className={css.errorBox}>
                        <h1 className={css.title}>Nepodařilo se načíst profil</h1>
                        <p className={css.errorText}>
                            Zkuste stránku obnovit. Pokud problém přetrvává,
                            přihlaste se prosím znovu.
                        </p>
                        <button
                            type="button"
                            className={css.retryBtn}
                            onClick={() => meQuery.refetch()}
                        >
                            Zkusit znovu
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    const user = meQuery.data;
    if (!user) return null;

    const orders = ordersQuery.data ?? [];
    const initials = (user.name?.[0] ?? "U").toUpperCase();

    return (
        <main className={css.page}>
            <section className={css.container}>
                <header className={css.top}>
                    <div className={css.identity}>
                        <div className={css.avatar} aria-hidden="true">
                            {initials}
                        </div>
                        <div>
                            <h1 className={css.title}>
                                {user.name || "Můj profil"}{" "}
                                {user.lastName ?? ""}
                            </h1>
                            <p className={css.subtitle}>{user.email}</p>
                        </div>
                    </div>
                </header>


                <OrderHistory
                    orders={orders}
                    isLoading={ordersQuery.isLoading}
                    isError={ordersQuery.isError}
                    onRetry={() => ordersQuery.refetch()}
                />
                <div className={css.grid}>
                    <ProfileInfoForm user={user} />
                    <DeliveryPreferencesForm user={user} />
                    <ChangePasswordForm />
                </div>
            </section>
        </main>
    );
}

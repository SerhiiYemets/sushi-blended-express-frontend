"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { RESTAURANT_LABELS } from "@/lib/restaurants";
import type { RestaurantAdmin } from "@/types/admin";

import css from "./AdminLayout.module.css";

import { adminLogout } from "@/lib/api/adminApi";

type Props = {
    admin: RestaurantAdmin;
    children: ReactNode;
};

const navigation = [
    { href: "/admin/events", label: "Události" },
    { href: "/admin/gallery", label: "Galerie" },
    { href: "/admin/about", label: "O nás" },
];

export default function AdminLayout({ admin, children }: Props) {
    const pathname = usePathname();

    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setLogoutError("");

        try {
            await adminLogout();
            router.replace("/admin/login");
        } catch {
            setLogoutError("Odhlášení se nezdařilo. Zkuste to znovu.");
            setIsLoggingOut(false);
        }
    };

    return (
        <div className={css.layout}>
            <header className={css.header}>
                <Link href="/admin/events" className={css.brand}>
                    <span className={css.brandName}>SushiMax</span>
                    <span className={css.brandAccent}>Admin</span>
                </Link>

                <div className={css.headerActions}>
                    <div className={css.restaurant}>
                        Restaurace:{" "}
                        <strong>
                            {RESTAURANT_LABELS[admin.restaurantId]}
                        </strong>
                    </div>

                    <button
                        type="button"
                        className={css.logoutButton}
                        onClick={() => void handleLogout()}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? "Odhlašování..." : "Odhlásit se"}
                    </button>

                    {logoutError && (
                        <span className={css.logoutError} role="alert">
                            {logoutError}
                        </span>
                    )}
                </div>
            </header>

            <div className={css.body}>
                <aside className={css.sidebar}>
                    <nav className={css.navigation} aria-label="Administrace">
                        {navigation.map((item) => {
                            const active = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${css.navLink} ${
                                        active ? css.navLinkActive : ""
                                    }`}
                                    aria-current={active ? "page" : undefined}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <div className={css.main}>{children}</div>
            </div>
        </div>
    );
}



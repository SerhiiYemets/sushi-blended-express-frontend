"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "@/components/AuthComponent/Auth.module.css";

export default function AuthNav() {
    const pathname = usePathname();

    return (
        <nav className={css.tabs} aria-label="Auth navigation">
            <Link
                href="/login"
                className={`${css.tab} ${pathname.startsWith("/login") ? css.tabActive : ""}`}
                aria-current={pathname.startsWith("/login") ? "page" : undefined}
            >
                Přihlášení
            </Link>

            <Link
                href="/register"
                className={`${css.tab} ${pathname.startsWith("/register") ? css.tabActive : ""}`}
                aria-current={pathname.startsWith("/register") ? "page" : undefined}
            >
                Registrace
            </Link>
        </nav>
    );
}

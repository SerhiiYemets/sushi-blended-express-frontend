"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./Auth.module.css";

export default function AuthNav() {
    const pathname = usePathname();

    return (
        <div className={css.buttonsBlock}>
            <Link
                href="/register"
                className={`${css.authBtn} ${
                pathname.startsWith("/register") ? css.active : ""
                }`}
                aria-current={pathname.startsWith("/register") ? "page" : undefined}
            >
                Registrace
            </Link>

            <Link
                href="/login"
                className={`${css.authBtn} ${
                pathname.startsWith("/login") ? css.active : ""
                }`}
                aria-current={pathname.startsWith("/login") ? "page" : undefined}
            >
                Přihlášení
            </Link>
        </div>
    );
}
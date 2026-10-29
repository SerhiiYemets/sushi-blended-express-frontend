import type { Metadata } from "next";
import Link from "next/link";

import AdminLoginForm from "@/components/Admin/AdminLoginForm";
import Logo from "@/components/Logo/Logo";
import css from "@/components/AuthComponent/Auth.module.css";

export const metadata: Metadata = {
    title: "Administrace | SushiMax",
    description: "Přihlášení do administrace restaurace SushiMax",
};

export default function AdminLoginPage() {
    return (
        <div className={css.wrapper}>
            <header className={css.header}>
                <Link href="/" className={css.logoLink}>
                    <Logo />
                </Link>
            </header>

            <main className={css.content}>
                <div className={css.card}>
                    <AdminLoginForm />
                </div>
            </main>

            <footer className={css.footer}>
                <p>© {new Date().getFullYear()} SushiMax</p>
            </footer>
        </div>
    );
}
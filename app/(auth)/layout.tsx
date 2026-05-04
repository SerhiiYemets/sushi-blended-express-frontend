import type { ReactNode } from "react";
import Link from "next/link";
import css from "@/components/AuthComponent/Auth.module.css";
import Logo from "@/components/Logo/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className={css.wrapper}>
            <header className={css.header}>
                <Link href="/" className={css.logoLink}>
                    <Logo />
                </Link>
            </header>

            <main className={css.content}>
                <div className={css.card}>
                    {children}
                </div>
            </main>

            <footer className={css.footer}>
                <p>© {new Date().getFullYear()} SushiMax</p>
            </footer>
        </div>
    );
}

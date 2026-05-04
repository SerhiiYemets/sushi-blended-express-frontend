import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
    title: "Stránka nenalezena",
    description: "Požadovaná stránka neexistuje",
    robots: { index: false },
};

export default function NotFound() {
    return (
        <main className={styles.wrapper}>
        <div className={styles.card}>
            <h1 className={styles.title}>404</h1>

            <p className={styles.text}>
            Omlouváme se, ale tato stránka neexistuje.
            </p>

            <Link href="/" className={styles.button}>
            Zpět na hlavní stránku
            </Link>
        </div>
        </main>
    );
}
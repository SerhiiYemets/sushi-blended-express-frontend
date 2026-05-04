"use client";

import styles from "./error.module.css";

export default function Error({
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.title}>Něco se pokazilo</h1>

                <p className={styles.text}>
                    Došlo k neočekávané chybě. Zkuste to prosím znovu.
                </p>

                <button onClick={reset} className={styles.button}>
                    Zkusit znovu
                </button>
            </div>
        </main>
    );
}


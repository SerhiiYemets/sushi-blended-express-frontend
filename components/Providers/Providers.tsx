"use client";

import { Toaster } from "react-hot-toast";
import styles from "./Providers.module.css";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                gutter={10}
                toastOptions={{
                    duration: 3500,
                    className: styles.toast,
                    success: {
                        className: `${styles.toast} ${styles.toastSuccess}`,
                        iconTheme: {
                            primary: "#16a34a",
                            secondary: "#ffffff",
                        },
                    },
                    error: {
                        className: `${styles.toast} ${styles.toastError}`,
                        iconTheme: {
                            primary: "var(--color-error, #c0392b)",
                            secondary: "#ffffff",
                        },
                    },
                }}
            />
        </>
    );
}

"use client";

import { Toaster } from "react-hot-toast";
import styles from "./Providers.module.css";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3500,
                    className: styles.toast,
                    success: {
                        iconTheme: {
                            primary: "var(--color-primary-dark)",
                            secondary: "#fff",
                        },
                    },
                }}
            />
        </>
    );
}


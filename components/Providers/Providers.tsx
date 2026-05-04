"use client";

import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3500,
                    style: {
                        background: "var(--color-bg-white)",
                        color: "var(--color-text-dark)",
                        border: "1px solid var(--color-border-warm)",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontFamily: "var(--font-montserrat)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    },
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

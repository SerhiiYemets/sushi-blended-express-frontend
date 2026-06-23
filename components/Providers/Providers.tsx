"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import CartGuardModal from "@/components/CartGuardModal/CartGuardModal";
import SocketProvider from "@/providers/SocketProvider";

import styles from "./Providers.module.css";

const Toaster = dynamic(
    () => import("react-hot-toast").then((m) => m.Toaster),
    { ssr: false }
);

const toastOptions = {
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
};

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30_000,
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <SocketProvider>
                {children}
            </SocketProvider>
            <CartGuardModal />
            <Toaster
                position="bottom-center"
                gutter={10}
                toastOptions={toastOptions}
            />
        </QueryClientProvider>
    );
}

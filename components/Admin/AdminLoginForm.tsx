"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { adminLogin } from "@/lib/api/adminApi";
import css from "@/components/AuthComponent/Auth.module.css";

export default function AdminLoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            await adminLogin({
                email: email.trim(),
                password,
            });

            router.replace("/admin/events");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setError("Nesprávný email nebo heslo.");
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Přihlášení se nezdařilo.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className={css.form} onSubmit={handleSubmit}>
            <h1 className={css.title}>Administrace restaurace</h1>

            <div className={css.formGroup}>
                <label htmlFor="admin-email">Email</label>
                <input
                    id="admin-email"
                    className={css.input}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="admin-password">Heslo</label>
                <input
                    id="admin-password"
                    className={css.input}
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                />
            </div>

            <p className={css.error}>{error}</p>

            <button
                className={css.submitBtn}
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Přihlašuji..." : "Přihlásit se"}
            </button>
        </form>
    );
}



"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScaleLoader } from "react-spinners";
import { signInSchema, type SignInValues } from "@/utils/validationSchemas";
import { useAuth } from "@/hooks/useAuth";
import css from "@/components/AuthComponent/Auth.module.css";

function LoginFormInner() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";
    const { submitAuth } = useAuth(redirectTo);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, touchedFields },
    } = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        mode: "onTouched",
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = useCallback(
        (values: SignInValues) =>
            submitAuth(true, values, {
                setFieldError: (field, message) =>
                    setError(field as "email" | "password", { message }),
                resetForm: () => reset(),
            }),
        [submitAuth, setError, reset]
    );

    return (
        <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className={css.title}>Přihlášení</h2>

            <div className={css.formGroup}>
                <label htmlFor="email">Email*</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="example@email.cz"
                    className={`${css.input} ${
                        errors.email && touchedFields.email ? css.inputError : ""
                    }`}
                    aria-invalid={!!errors.email}
                    {...register("email")}
                />
                <p className={css.error}>{errors.email?.message ?? ""}</p>
            </div>

            <div className={css.formGroup}>
                <label htmlFor="password">Heslo*</label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`${css.input} ${
                        errors.password && touchedFields.password ? css.inputError : ""
                    }`}
                    aria-invalid={!!errors.password}
                    {...register("password")}
                />
                <p className={css.error}>{errors.password?.message ?? ""}</p>
            </div>

            <button
                className={css.submitBtn}
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ScaleLoader color="#fff" height={16} width={2} />
                ) : (
                    "Přihlásit se"
                )}
            </button>
        </form>
    );
}

export default function LoginForm() {
    return (
        <Suspense fallback={null}>
            <LoginFormInner />
        </Suspense>
    );
}

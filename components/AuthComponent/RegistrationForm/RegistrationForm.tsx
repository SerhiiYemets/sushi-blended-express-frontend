"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScaleLoader } from "react-spinners";
import { signUpSchema, type SignUpValues } from "@/utils/validationSchemas";
import { useAuth } from "@/hooks/useAuth";
import css from "@/components/AuthComponent/Auth.module.css";

function RegistrationFormInner() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";
    const { submitAuth } = useAuth(redirectTo);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, touchedFields },
    } = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        mode: "onTouched",
        defaultValues: { name: "", email: "", password: "" },
    });

    const onSubmit = useCallback(
        (values: SignUpValues) =>
            submitAuth(false, values, {
                setFieldError: (field, message) =>
                    setError(field, { message }),
                resetForm: () => reset(),
            }),
        [submitAuth, setError, reset]
    );

    return (
        <form className={css.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className={css.title}>Registrace</h2>

            <div className={css.formGroup}>
                <label htmlFor="name">Jméno*</label>
                <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Vaše jméno"
                    className={`${css.input} ${
                        errors.name && touchedFields.name ? css.inputError : ""
                    }`}
                    aria-invalid={!!errors.name}
                    {...register("name")}
                />
                <p className={css.error}>{errors.name?.message ?? ""}</p>
            </div>

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
                    autoComplete="new-password"
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
                    "Zaregistrovat se"
                )}
            </button>
        </form>
    );
}

export default function RegistrationForm() {
    return (
        <Suspense fallback={null}>
            <RegistrationFormInner />
        </Suspense>
    );
}

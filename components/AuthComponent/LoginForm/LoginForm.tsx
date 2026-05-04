"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ScaleLoader } from "react-spinners";
import { signInSchema } from "@/utils/validationSchemas";
import { useAuth } from "@/hooks/useAuth";
import css from "../../AuthComponent/AuthNav/Auth.module.css";

function LoginFormInner() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";
    const { submitAuth } = useAuth(redirectTo);

    return (
        <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={signInSchema}
            onSubmit={async (values, helpers) => {
                try {
                await submitAuth(true, values, helpers);
                } catch (error: any) {
                helpers.setErrors({
                    general:
                    error?.response?.data?.message ||
                    "Neplatné přihlašovací údaje",
                });
                }
            }}
            >
            {({ isSubmitting, errors, touched }) => (
                <Form className={css.form}>
                    <h2 className={css.title}>Přihlášení</h2>

                    <div className={css.formGroup}>
                        <label htmlFor="email">Email*</label>
                        <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="example@email.cz"
                        className={`${css.input} ${
                            errors.email && touched.email ? css.inputError : ""
                        }`}
                        />
                        <ErrorMessage
                        name="email"
                        component="p"
                        className={css.error}
                        />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="password">Heslo*</label>
                        <Field
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="********"
                        className={`${css.input} ${
                            errors.password && touched.password
                            ? css.inputError
                            : ""
                        }`}
                        />
                        <ErrorMessage
                        name="password"
                        component="p"
                        className={css.error}
                        />
                    </div>

                    {errors.general && (
                        <p className={css.error}>{errors.general}</p>
                    )}

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
                </Form>
            )}
        </Formik>
    );
}

export default function LoginForm() {
    return (
        <Suspense fallback={null}>
            <LoginFormInner />
        </Suspense>
    );
}
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ScaleLoader } from "react-spinners";
import { signUpSchema } from "@/utils/validationSchemas";
import { useAuth } from "@/hooks/useAuth";
import css from "@/components/AuthComponent/Auth.module.css";

function RegistrationFormInner() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";
    const { submitAuth } = useAuth(redirectTo);

    return (
        <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={signUpSchema}
            onSubmit={(values, helpers) => submitAuth(false, values, helpers)}
        >
            {({ isSubmitting, errors, touched }) => (
                <Form className={css.form}>
                    <h2 className={css.title}>Registrace</h2>

                    <div className={css.formGroup}>
                        <label htmlFor="name">Jméno*</label>
                        <Field
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Vaše jméno"
                            className={`${css.input} ${errors.name && touched.name ? css.inputError : ""}`}
                        />
                        <ErrorMessage name="name" component="p" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="email">Email*</label>
                        <Field
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="example@email.cz"
                            className={`${css.input} ${errors.email && touched.email ? css.inputError : ""}`}
                        />
                        <ErrorMessage name="email" component="p" className={css.error} />
                    </div>

                    <div className={css.formGroup}>
                        <label htmlFor="password">Heslo*</label>
                        <Field
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className={`${css.input} ${errors.password && touched.password ? css.inputError : ""}`}
                        />
                        <ErrorMessage name="password" component="p" className={css.error} />
                    </div>

                    <button className={css.submitBtn} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <ScaleLoader color="#fff" height={16} width={2} />
                        ) : (
                            "Zaregistrovat se"
                        )}
                    </button>
                </Form>
            )}
        </Formik>
    );
}

export default function RegistrationForm() {
    return (
        <Suspense fallback={null}>
            <RegistrationFormInner />
        </Suspense>
    );
}

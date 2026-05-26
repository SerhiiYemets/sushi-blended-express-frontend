"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { changePassword, type ChangePasswordPayload } from "@/lib/api/clientApi";

import css from "./ChangePasswordForm.module.css";

type FormState = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const MIN_PASSWORD_LENGTH = 8;

const EMPTY_FORM: FormState = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
};

const SERVER_ERROR_MAP: Record<string, { field?: keyof FormState; message: string }> = {
    "Current password is incorrect": {
        field: "currentPassword",
        message: "Aktuální heslo není správné",
    },
    "New password must be different from current password": {
        field: "newPassword",
        message: "Nové heslo musí být jiné než aktuální",
    },
};

export default function ChangePasswordForm() {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [errors, setErrors] = useState<FieldErrors>({});

    const mutation = useMutation({
        mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
        onSuccess: () => {
            setForm(EMPTY_FORM);
            setErrors({});
            toast.success("Heslo bylo změněno");
        },
        onError: (error) => {
            const raw = isAxiosError(error)
                ? (error.response?.data as { message?: string } | undefined)
                      ?.message ?? error.message
                : "Něco se pokazilo";

            const mapped = SERVER_ERROR_MAP[raw];

            if (mapped?.field) {
                setErrors((prev) => ({ ...prev, [mapped.field!]: mapped.message }));
            } else {
                toast.error(mapped?.message ?? raw);
            }
        },
    });

    const validate = (next: FormState): FieldErrors => {
        const out: FieldErrors = {};

        if (!next.currentPassword) {
            out.currentPassword = "Zadejte aktuální heslo";
        }

        if (!next.newPassword) {
            out.newPassword = "Zadejte nové heslo";
        } else if (next.newPassword.length < MIN_PASSWORD_LENGTH) {
            out.newPassword = `Heslo musí mít alespoň ${MIN_PASSWORD_LENGTH} znaků`;
        } else if (next.newPassword === next.currentPassword) {
            out.newPassword = "Nové heslo musí být jiné než aktuální";
        }

        if (!next.confirmNewPassword) {
            out.confirmNewPassword = "Potvrďte nové heslo";
        } else if (next.confirmNewPassword !== next.newPassword) {
            out.confirmNewPassword = "Hesla se neshodují";
        }

        return out;
    };

    const handleChange =
        (field: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setForm((prev) => ({ ...prev, [field]: value }));
            setErrors((prev) => {
                if (!prev[field]) return prev;
                const next = { ...prev };
                delete next[field];
                return next;
            });
        };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const nextErrors = validate(form);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) return;

        mutation.mutate({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
        });
    };

    return (
        <section className={css.card}>
            <header className={css.cardHeader}>
                <h2 className={css.title}>Změna hesla</h2>
                <p className={css.subtitle}>
                    Pro vyšší zabezpečení používejte silné heslo
                </p>
            </header>

            <form
                onSubmit={handleSubmit}
                className={css.form}
                noValidate
                autoComplete="off"
            >
                <div className={css.field}>
                    <label htmlFor="pw-current" className={css.label}>
                        Aktuální heslo
                    </label>
                    <input
                        id="pw-current"
                        type="password"
                        autoComplete="current-password"
                        className={`${css.input} ${
                            errors.currentPassword ? css.inputError : ""
                        }`}
                        value={form.currentPassword}
                        onChange={handleChange("currentPassword")}
                        aria-invalid={!!errors.currentPassword}
                    />
                    {errors.currentPassword && (
                        <span className={css.errorText}>
                            {errors.currentPassword}
                        </span>
                    )}
                </div>

                <div className={css.row2}>
                    <div className={css.field}>
                        <label htmlFor="pw-new" className={css.label}>
                            Nové heslo
                        </label>
                        <input
                            id="pw-new"
                            type="password"
                            autoComplete="new-password"
                            className={`${css.input} ${
                                errors.newPassword ? css.inputError : ""
                            }`}
                            value={form.newPassword}
                            onChange={handleChange("newPassword")}
                            aria-invalid={!!errors.newPassword}
                            minLength={MIN_PASSWORD_LENGTH}
                        />
                        {errors.newPassword ? (
                            <span className={css.errorText}>
                                {errors.newPassword}
                            </span>
                        ) : (
                            <span className={css.hint}>
                                Alespoň {MIN_PASSWORD_LENGTH} znaků
                            </span>
                        )}
                    </div>

                    <div className={css.field}>
                        <label htmlFor="pw-confirm" className={css.label}>
                            Potvrzení nového hesla
                        </label>
                        <input
                            id="pw-confirm"
                            type="password"
                            autoComplete="new-password"
                            className={`${css.input} ${
                                errors.confirmNewPassword ? css.inputError : ""
                            }`}
                            value={form.confirmNewPassword}
                            onChange={handleChange("confirmNewPassword")}
                            aria-invalid={!!errors.confirmNewPassword}
                        />
                        {errors.confirmNewPassword && (
                            <span className={css.errorText}>
                                {errors.confirmNewPassword}
                            </span>
                        )}
                    </div>
                </div>

                <div className={css.actions}>
                    <button
                        type="submit"
                        className={css.submitBtn}
                        disabled={mutation.isPending}
                        aria-busy={mutation.isPending}
                    >
                        {mutation.isPending ? "Ukládám..." : "Změnit heslo"}
                    </button>
                </div>
            </form>
        </section>
    );
}

"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { updateMe } from "@/lib/api/clientApi";
import type { ProfileUpdatePayload, User } from "@/types/user";

import css from "./ProfileInfoForm.module.css";

type Props = {
    user: User;
};

type FormState = {
    name: string;
    lastName: string;
    phone: string;
};

const PHONE_REGEX = /^[0-9+\s()\-]{6,20}$/;

function toForm(user: User): FormState {
    return {
        name: user.name ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
    };
}

function diffPayload(
    initial: FormState,
    next: FormState
): ProfileUpdatePayload {
    const diff: ProfileUpdatePayload = {};
    if (next.name !== initial.name) diff.name = next.name.trim();
    if (next.lastName !== initial.lastName)
        diff.lastName = next.lastName.trim();
    if (next.phone !== initial.phone) diff.phone = next.phone.trim();
    return diff;
}

export default function ProfileInfoForm({ user }: Props) {
    const queryClient = useQueryClient();

    const initial = useMemo<FormState>(() => toForm(user), [user]);

    const [form, setForm] = useState<FormState>(initial);
    const [phoneError, setPhoneError] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: (payload: ProfileUpdatePayload) => updateMe(payload),
        onSuccess: (updated) => {
            queryClient.setQueryData(["me"], updated);
            queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success("Profil byl uložen");
        },
        onError: (error) => {
            const msg = isAxiosError(error)
                ? (error.response?.data as { message?: string } | undefined)
                      ?.message ?? error.message
                : "Něco se pokazilo";
            toast.error(msg);
        },
    });

    const dirty =
        form.name !== initial.name ||
        form.lastName !== initial.lastName ||
        form.phone !== initial.phone;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.phone.trim() && !PHONE_REGEX.test(form.phone.trim())) {
            setPhoneError("Zadejte platné telefonní číslo");
            return;
        }
        setPhoneError(null);

        const payload = diffPayload(initial, form);
        if (Object.keys(payload).length === 0) return;

        mutation.mutate(payload);
    };

    return (
        <section className={css.card}>
            <header className={css.cardHeader}>
                <h2 className={css.title}>Osobní údaje</h2>
                <p className={css.subtitle}>
                    Tyto údaje použijeme pro vaše objednávky
                </p>
            </header>

            <form onSubmit={handleSubmit} className={css.form} noValidate>
                <div className={css.row2}>
                    <div className={css.field}>
                        <label htmlFor="profile-name" className={css.label}>
                            Jméno
                        </label>
                        <input
                            id="profile-name"
                            type="text"
                            autoComplete="given-name"
                            maxLength={40}
                            className={css.input}
                            value={form.name}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    name: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className={css.field}>
                        <label
                            htmlFor="profile-lastName"
                            className={css.label}
                        >
                            Příjmení
                        </label>
                        <input
                            id="profile-lastName"
                            type="text"
                            autoComplete="family-name"
                            maxLength={60}
                            className={css.input}
                            value={form.lastName}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    lastName: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>

                <div className={css.field}>
                    <label htmlFor="profile-email" className={css.label}>
                        E-mail
                    </label>
                    <input
                        id="profile-email"
                        type="email"
                        readOnly
                        value={user.email}
                        className={`${css.input} ${css.inputReadonly}`}
                        aria-readonly="true"
                    />
                    <span className={css.hint}>
                        E-mail nelze změnit
                    </span>
                </div>

                <div className={css.field}>
                    <label htmlFor="profile-phone" className={css.label}>
                        Telefon
                    </label>
                    <input
                        id="profile-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+420 123 456 789"
                        className={`${css.input} ${
                            phoneError ? css.inputError : ""
                        }`}
                        value={form.phone}
                        onChange={(e) =>
                            setForm((p) => ({
                                ...p,
                                phone: e.target.value,
                            }))
                        }
                        aria-invalid={!!phoneError}
                    />
                    {phoneError && (
                        <span className={css.errorText}>{phoneError}</span>
                    )}
                </div>

                <div className={css.actions}>
                    <button
                        type="submit"
                        className={css.submitBtn}
                        disabled={!dirty || mutation.isPending}
                        aria-busy={mutation.isPending}
                    >
                        {mutation.isPending ? "Ukládám..." : "Uložit změny"}
                    </button>
                </div>
            </form>
        </section>
    );
}

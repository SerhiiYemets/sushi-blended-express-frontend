"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

import { updateMe } from "@/lib/api/clientApi";
import type {
    DeliveryType,
    PaymentMethod,
    ProfileUpdatePayload,
    User,
} from "@/types/user";

import css from "./DeliveryPreferencesForm.module.css";

type Props = {
    user: User;
};

type FormState = {
    address: string;
    apartment: string;
    deliveryNotes: string;
    defaultDeliveryType: DeliveryType;
    preferredPaymentMethod: PaymentMethod;
    peopleCount: number;
};

const MIN_PEOPLE = 1;
const MAX_PEOPLE = 50;

function toForm(user: User): FormState {
    return {
        address: user.address ?? "",
        apartment: user.apartment ?? "",
        deliveryNotes: user.deliveryNotes ?? "",
        defaultDeliveryType: user.defaultDeliveryType ?? "delivery",
        preferredPaymentMethod: user.preferredPaymentMethod ?? "cash",
        peopleCount:
            typeof user.peopleCount === "number" && user.peopleCount > 0
                ? user.peopleCount
                : 1,
    };
}

function diffPayload(
    initial: FormState,
    next: FormState
): ProfileUpdatePayload {
    const diff: ProfileUpdatePayload = {};
    if (next.address !== initial.address) diff.address = next.address.trim();
    if (next.apartment !== initial.apartment)
        diff.apartment = next.apartment.trim();
    if (next.deliveryNotes !== initial.deliveryNotes)
        diff.deliveryNotes = next.deliveryNotes.trim();
    if (next.defaultDeliveryType !== initial.defaultDeliveryType)
        diff.defaultDeliveryType = next.defaultDeliveryType;
    if (next.preferredPaymentMethod !== initial.preferredPaymentMethod)
        diff.preferredPaymentMethod = next.preferredPaymentMethod;
    if (next.peopleCount !== initial.peopleCount)
        diff.peopleCount = next.peopleCount;
    return diff;
}

export default function DeliveryPreferencesForm({ user }: Props) {
    const queryClient = useQueryClient();

    const initial = useMemo<FormState>(() => toForm(user), [user]);
    const [form, setForm] = useState<FormState>(initial);

    const mutation = useMutation({
        mutationFn: (payload: ProfileUpdatePayload) => updateMe(payload),
        onSuccess: (updated) => {
            queryClient.setQueryData(["me"], updated);
            queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success("Předvolby byly uloženy");
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
        form.address !== initial.address ||
        form.apartment !== initial.apartment ||
        form.deliveryNotes !== initial.deliveryNotes ||
        form.defaultDeliveryType !== initial.defaultDeliveryType ||
        form.preferredPaymentMethod !== initial.preferredPaymentMethod ||
        form.peopleCount !== initial.peopleCount;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = diffPayload(initial, form);
        if (Object.keys(payload).length === 0) return;
        mutation.mutate(payload);
    };

    const isDelivery = form.defaultDeliveryType === "delivery";

    return (
        <section className={css.card}>
            <header className={css.cardHeader}>
                <h2 className={css.title}>Předvolby doručení</h2>
                <p className={css.subtitle}>
                    Uložíme si je pro vaši příští objednávku
                </p>
            </header>

            <form onSubmit={handleSubmit} className={css.form} noValidate>
                <div className={css.field}>
                    <span className={css.label}>Výchozí způsob</span>

                    <div className={css.toggle} role="radiogroup">
                        <label
                            className={`${css.toggleOption} ${
                                isDelivery ? css.toggleActive : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name="deliveryType"
                                value="delivery"
                                checked={isDelivery}
                                onChange={() =>
                                    setForm((p) => ({
                                        ...p,
                                        defaultDeliveryType: "delivery",
                                    }))
                                }
                                className={css.srOnly}
                            />
                            <span className={css.toggleIcon}>🚚</span>
                            <span className={css.toggleLabel}>Doručení</span>
                        </label>

                        <label
                            className={`${css.toggleOption} ${
                                !isDelivery ? css.toggleActive : ""
                            }`}
                        >
                            <input
                                type="radio"
                                name="deliveryType"
                                value="pickup"
                                checked={!isDelivery}
                                onChange={() =>
                                    setForm((p) => ({
                                        ...p,
                                        defaultDeliveryType: "pickup",
                                    }))
                                }
                                className={css.srOnly}
                            />
                            <span className={css.toggleIcon}>🏠</span>
                            <span className={css.toggleLabel}>Vyzvednutí</span>
                        </label>
                    </div>
                </div>

                <div className={css.row2}>
                    <div className={css.field}>
                        <label
                            htmlFor="pref-address"
                            className={css.label}
                        >
                            Adresa
                        </label>
                        <input
                            id="pref-address"
                            type="text"
                            autoComplete="street-address"
                            placeholder="Ulice, č.p., město"
                            className={css.input}
                            value={form.address}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    address: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className={css.field}>
                        <label
                            htmlFor="pref-apartment"
                            className={css.label}
                        >
                            Patro / byt
                        </label>
                        <input
                            id="pref-apartment"
                            type="text"
                            autoComplete="address-line2"
                            placeholder="3. patro, byt 12"
                            className={css.input}
                            value={form.apartment}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    apartment: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>

                <div className={css.field}>
                    <label htmlFor="pref-notes" className={css.label}>
                        Poznámka kurýrovi
                    </label>
                    <textarea
                        id="pref-notes"
                        rows={3}
                        className={css.textarea}
                        placeholder="Zvoňte na druhý zvonek, nechte u dveří…"
                        value={form.deliveryNotes}
                        onChange={(e) =>
                            setForm((p) => ({
                                ...p,
                                deliveryNotes: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className={css.row2}>
                    <div className={css.field}>
                        <span className={css.label}>Způsob platby</span>
                        <div className={css.payment} role="radiogroup">
                            <label
                                className={`${css.paymentOption} ${
                                    form.preferredPaymentMethod === "cash"
                                        ? css.paymentActive
                                        : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cash"
                                    checked={
                                        form.preferredPaymentMethod === "cash"
                                    }
                                    onChange={() =>
                                        setForm((p) => ({
                                            ...p,
                                            preferredPaymentMethod: "cash",
                                        }))
                                    }
                                    className={css.srOnly}
                                />
                                <span className={css.paymentIcon}>💵</span>
                                <span>Hotově</span>
                            </label>

                            <label
                                className={`${css.paymentOption} ${
                                    form.preferredPaymentMethod === "card"
                                        ? css.paymentActive
                                        : ""
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={
                                        form.preferredPaymentMethod === "card"
                                    }
                                    onChange={() =>
                                        setForm((p) => ({
                                            ...p,
                                            preferredPaymentMethod: "card",
                                        }))
                                    }
                                    className={css.srOnly}
                                />
                                <span className={css.paymentIcon}>💳</span>
                                <span>Kartou</span>
                            </label>
                        </div>
                    </div>

                    <div className={css.field}>
                        <label
                            htmlFor="pref-people"
                            className={css.label}
                        >
                            Výchozí počet osob
                        </label>
                        <input
                            id="pref-people"
                            type="number"
                            min={MIN_PEOPLE}
                            max={MAX_PEOPLE}
                            className={css.input}
                            value={form.peopleCount}
                            onChange={(e) => {
                                const raw = Number(e.target.value);
                                const value = Number.isFinite(raw)
                                    ? Math.min(
                                          MAX_PEOPLE,
                                          Math.max(MIN_PEOPLE, raw)
                                      )
                                    : MIN_PEOPLE;
                                setForm((p) => ({
                                    ...p,
                                    peopleCount: value,
                                }));
                            }}
                        />
                    </div>
                </div>

                <div className={css.actions}>
                    <button
                        type="submit"
                        className={css.submitBtn}
                        disabled={!dirty || mutation.isPending}
                        aria-busy={mutation.isPending}
                    >
                        {mutation.isPending
                            ? "Ukládám..."
                            : "Uložit předvolby"}
                    </button>
                </div>
            </form>
        </section>
    );
}

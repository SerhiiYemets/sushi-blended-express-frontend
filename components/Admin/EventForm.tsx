
"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import type {
    CreateEventPayload,
    Event,
} from "@/types/event";

import css from "@/components/Admin/AdminEvents.module.css";

type EventFormProps = {
    initialEvent?: Event | null;
    onSubmit: (payload: CreateEventPayload) => Promise<void>;
    onCancel?: () => void;
};

const toDateTimeLocal = (
    value: string | null | undefined
) => {
    if (!value) return "";

    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60_000;

    return new Date(date.getTime() - offset)
        .toISOString()
        .slice(0, 16);
};

const toIsoDate = (value: string) => {
    return value ? new Date(value).toISOString() : null;
};

export default function EventForm({
    initialEvent = null,
    onSubmit,
    onCancel,
}: EventFormProps) {
    const [title, setTitle] = useState(
        initialEvent?.title ?? ""
    );

    const [description, setDescription] = useState(
        initialEvent?.description ?? ""
    );

    const [imageUrl, setImageUrl] = useState(
        initialEvent?.imageUrl ?? ""
    );

    const [startAt, setStartAt] = useState(
        toDateTimeLocal(initialEvent?.startAt)
    );

    const [endAt, setEndAt] = useState(
        toDateTimeLocal(initialEvent?.endAt)
    );

    const [active, setActive] = useState(
        initialEvent?.active ?? true
    );

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] = useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        if (
            new Date(endAt).getTime() <
            new Date(startAt).getTime()
        ) {
            setError(
                "Konec události nesmí být před začátkem."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                imageUrl: imageUrl.trim(),
                startAt: toIsoDate(startAt),
                endAt: toIsoDate(endAt),
                active,
                buttonText: "",
                buttonUrl: "",
            });

            if (!initialEvent) {
                setTitle("");
                setDescription("");
                setImageUrl("");
                setStartAt("");
                setEndAt("");
                setActive(true);
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Událost se nepodařilo uložit."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            className={css.form}
            onSubmit={handleSubmit}
        >
            <h2 className={css.sectionTitle}>
                {initialEvent
                    ? "Upravit událost"
                    : "Nová událost"}
            </h2>

            <div className={css.field}>
                <label htmlFor="event-title">
                    Název *
                </label>

                <input
                    id="event-title"
                    className={css.input}
                    type="text"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    maxLength={120}
                    required
                />
            </div>

            <div className={css.field}>
                <label htmlFor="event-description">
                    Popis
                </label>

                <textarea
                    id="event-description"
                    className={css.textarea}
                    value={description}
                    onChange={(event) =>
                        setDescription(
                            event.target.value
                        )
                    }
                    maxLength={1000}
                    rows={5}
                />
            </div>

            <div className={css.field}>
                <label htmlFor="event-image">
                    URL obrázku
                </label>

                <input
                    id="event-image"
                    className={css.input}
                    type="url"
                    value={imageUrl}
                    onChange={(event) =>
                        setImageUrl(event.target.value)
                    }
                    placeholder="https://..."
                />
            </div>

            <div className={css.grid}>
                <div className={css.field}>
                    <label htmlFor="event-start">
                        Začátek události *
                    </label>

                    <input
                        id="event-start"
                        className={css.input}
                        type="datetime-local"
                        value={startAt}
                        onChange={(event) =>
                            setStartAt(event.target.value)
                        }
                        required
                    />
                </div>

                <div className={css.field}>
                    <label htmlFor="event-end">
                        Konec události *
                    </label>

                    <input
                        id="event-end"
                        className={css.input}
                        type="datetime-local"
                        value={endAt}
                        onChange={(event) =>
                            setEndAt(event.target.value)
                        }
                        min={startAt || undefined}
                        required
                    />
                </div>
            </div>

            <label className={css.checkboxRow}>
                <input
                    className={css.checkbox}
                    type="checkbox"
                    checked={active}
                    onChange={(event) =>
                        setActive(event.target.checked)
                    }
                />

                Aktivní
            </label>

            {error && (
                <p className={css.error}>
                    {error}
                </p>
            )}

            <div className={css.actions}>
                <button
                    className={css.primaryButton}
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Ukládám..."
                        : initialEvent
                            ? "Uložit změny"
                            : "Vytvořit událost"}
                </button>

                {initialEvent && onCancel && (
                    <button
                        className={css.secondaryButton}
                        type="button"
                        onClick={onCancel}
                    >
                        Zrušit
                    </button>
                )}
            </div>
        </form>
    );
}

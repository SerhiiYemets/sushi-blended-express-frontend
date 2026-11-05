
"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type {
    CreateEventPayload,
    Event,
} from "@/types/event";

import {
    ADMIN_UPLOAD_ACCEPT,
    getUploadErrorMessage,
    uploadAdminImage,
    validateAdminImageFile,
} from "@/lib/api/adminApi";

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

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [localPreview, setLocalPreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!localPreview) return;

        return () => URL.revokeObjectURL(localPreview);
    }, [localPreview]);

    const handleImageSelect = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        setUploadError("");

        const validationError = validateAdminImageFile(file);

        if (validationError) {
            setUploadError(validationError);
            return;
        }

        setLocalPreview(URL.createObjectURL(file));
        setIsUploading(true);

        try {
            const { url } = await uploadAdminImage(file, "events");
            setImageUrl(url);
        } catch (uploadFailure) {
            setUploadError(getUploadErrorMessage(uploadFailure));
        } finally {
            setLocalPreview(null);
            setIsUploading(false);
        }
    };

    const previewSrc = localPreview ?? imageUrl.trim();

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
                "Окончание события не может быть раньше начала."
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
                    : "Не удалось сохранить событие."
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
                    ? "Редактировать событие"
                    : "Новое событие"}
            </h2>

            <div className={css.field}>
                <label htmlFor="event-title">
                    Название *
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
                    Описание
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
                    URL изображения
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
                    disabled={isUploading}
                />

                <div className={css.upload}>
                    <input
                        ref={fileInputRef}
                        id="event-image-file"
                        className={css.fileInput}
                        type="file"
                        accept={ADMIN_UPLOAD_ACCEPT}
                        onChange={(event) => void handleImageSelect(event)}
                        disabled={isUploading}
                        tabIndex={-1}
                        aria-hidden="true"
                    />

                    <button
                        type="button"
                        className={css.secondaryButton}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        aria-describedby="event-image-hint"
                    >
                        {isUploading
                            ? "Загрузка..."
                            : "Загрузить с компьютера"}
                    </button>

                    <span id="event-image-hint" className={css.uploadHint}>
                        JPEG, PNG, WebP или AVIF, до 5 МБ
                    </span>
                </div>

                <p className={css.uploadStatus} role="status" aria-live="polite">
                    {isUploading ? "Изображение загружается..." : ""}
                </p>

                {uploadError && (
                    <p className={css.error} role="alert">
                        {uploadError}
                    </p>
                )}

                {previewSrc && (
                    <div
                        className={`${css.imagePreview} ${
                            isUploading ? css.imagePreviewLoading : ""
                        }`}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previewSrc}
                            alt="Предпросмотр изображения события"
                        />
                    </div>
                )}
            </div>

            <div className={css.grid}>
                <div className={css.field}>
                    <label htmlFor="event-start">
                        Начало события *
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
                        Окончание события *
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

                Активный
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
                    disabled={isSubmitting || isUploading}
                >
                    {isSubmitting
                        ? "Сохранение..."
                        : initialEvent
                            ? "Сохранить изменения"
                            : "Создать событие"}
                </button>

                {initialEvent && onCancel && (
                    <button
                        className={css.secondaryButton}
                        type="button"
                        onClick={onCancel}
                    >
                        Отмена
                    </button>
                )}
            </div>
        </form>
    );
}

"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";

import type { RestaurantAbout } from "@/lib/api/restaurantAboutApi";
import {
    uploadAdminImage,
    type UpdateAdminAboutPayload,
} from "@/lib/api/adminApi";

import css from "./AdminAboutForm.module.css";

type Props = {
    initialAbout: RestaurantAbout | null;
    onSubmit: (payload: UpdateAdminAboutPayload) => Promise<void>;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
];

export default function AdminAboutForm({
    initialAbout,
    onSubmit,
}: Props) {
    const [title, setTitle] = useState(initialAbout?.title ?? "");
    const [description, setDescription] = useState(
        initialAbout?.description ?? ""
    );
    const [imageUrl, setImageUrl] = useState(
        initialAbout?.imageUrl ?? ""
    );

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const handleImageUpload = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file || isUploading || isSaving) return;

        setError("");

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setError(
                "Неподдерживаемый формат изображения. Используйте JPEG, PNG, WebP или AVIF."
            );
            event.target.value = "";
            return;
        }

        if (file.size === 0) {
            setError("Выбранный файл пустой.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setError("Размер фотографии не должен превышать 5 МБ.");
            event.target.value = "";
            return;
        }

        setIsUploading(true);

        try {
            const result = await uploadAdminImage(file, "about");
            setImageUrl(result.url);
        } catch {
            setError(
                "Не удалось загрузить фотографию. Попробуйте ещё раз."
            );
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (isSaving || isUploading) return;

        setIsSaving(true);
        setError("");

        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                imageUrl: imageUrl.trim(),
            });
        } catch {
            setError(
                "Не удалось сохранить изменения. Попробуйте ещё раз."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form className={css.form} onSubmit={handleSubmit}>
            <div className={css.field}>
                <label htmlFor="about-title">Заголовок</label>
                <input
                    id="about-title"
                    className={css.input}
                    type="text"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    maxLength={120}
                    required
                    placeholder="SushiMax — víc než jen sushi"
                />
            </div>

            <div className={css.field}>
                <label htmlFor="about-description">
                    Описание
                </label>
                <textarea
                    id="about-description"
                    className={css.textarea}
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                    maxLength={3000}
                    rows={7}
                    placeholder="Напишите что-нибудь о своём ресторане..."
                />
            </div>

            <div className={css.field}>
                <label htmlFor="about-upload">
                    Загрузить фотографию с компьютера
                </label>

                <input
                    id="about-upload"
                    className={css.input}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleImageUpload}
                    disabled={isUploading || isSaving}
                />

                {isUploading && (
                    <p role="status">
                        Загрузка фотографии...
                    </p>
                )}
            </div>

            <div className={css.field}>
                <label htmlFor="about-image">
                    URL фотографии
                </label>
                <input
                    id="about-image"
                    className={css.input}
                    type="url"
                    value={imageUrl}
                    onChange={(event) =>
                        setImageUrl(event.target.value)
                    }
                    maxLength={2048}
                    disabled={isUploading || isSaving}
                    placeholder="https://example.com/restaurant.jpg"
                />
            </div>

            {imageUrl.trim() && (
                <div className={css.field}>
                    <span className={css.label}>
                        Предпросмотр фотографии
                    </span>

                    <Image
                        src={imageUrl.trim()}
                        alt="Предпросмотр фотографии ресторана"
                        width={480}
                        height={300}
                        unoptimized
                        style={{
                            width: "100%",
                            maxWidth: 480,
                            height: "auto",
                            borderRadius: 12,
                        }}
                    />
                </div>
            )}

            {error && (
                <p className={css.error} role="alert">
                    {error}
                </p>
            )}

            <div className={css.actions}>
                <button
                    className={css.primaryButton}
                    type="submit"
                    disabled={isSaving || isUploading}
                >
                    {isSaving
                        ? "Сохранение..."
                        : isUploading
                            ? "Загрузка фотографии..."
                            : "Сохранить изменения"}
                </button>
            </div>
        </form>
    );
}

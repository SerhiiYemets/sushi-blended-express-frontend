"use client";

import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    ADMIN_UPLOAD_ACCEPT,
    getUploadErrorMessage,
    uploadAdminImage,
    validateAdminImageFile,
    type CreateAdminGalleryPayload,
} from "@/lib/api/adminApi";
import type { RestaurantGallery } from "@/lib/api/restaurantGalleryApi";

import styles from "./AdminGalleryForm.module.css";

type PendingUpload = {
    id: number;
    name: string;
    previewUrl: string | null;
    status: "uploading" | "error";
    error?: string;
};

type Props = {
    gallery?: RestaurantGallery;
    onSave: (payload: CreateAdminGalleryPayload) => Promise<void>;
    onCancel: () => void;
    saving: boolean;
};

export default function AdminGalleryForm({
    gallery,
    onSave,
    onCancel,
    saving,
}: Props) {
    const [title, setTitle] = useState(gallery?.title ?? "");
    const [images, setImages] = useState<string[]>(
        gallery?.images.map((image) => image.url) ?? [""]
    );
    const [isActive, setIsActive] = useState(gallery?.isActive ?? true);

    const addImage = () => {
        setImages((previous) => [...previous, ""]);
    };

    const updateImage = (index: number, value: string) => {
        setImages((previous) =>
            previous.map((url, i) => (i === index ? value : url))
        );
    };

    const removeImage = (index: number) => {
        setImages((previous) =>
            previous.filter((_, i) => i !== index)
        );
    };

    const [uploads, setUploads] = useState<PendingUpload[]>([]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const nextUploadIdRef = useRef(0);
    const previewUrlsRef = useRef(new Set<string>());

    const isUploading = uploads.some((upload) => upload.status === "uploading");

    useEffect(() => {
        const previewUrls = previewUrlsRef.current;

        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
            previewUrls.clear();
        };
    }, []);

    const releasePreview = (previewUrl: string | null) => {
        if (!previewUrl) return;

        URL.revokeObjectURL(previewUrl);
        previewUrlsRef.current.delete(previewUrl);
    };

    const dismissUpload = (id: number) => {
        setUploads((previous) => {
            const upload = previous.find((item) => item.id === id);
            releasePreview(upload?.previewUrl ?? null);

            return previous.filter((item) => item.id !== id);
        });
    };

    const appendUploadedImage = (url: string) => {
        setImages((previous) =>
            previous.length === 1 && !previous[0].trim()
                ? [url]
                : [...previous, url]
        );
    };

    const handleFilesSelected = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = "";

        if (files.length === 0) return;

        const queue = files.map((file) => {
            const validationError = validateAdminImageFile(file);
            const previewUrl = validationError
                ? null
                : URL.createObjectURL(file);

            if (previewUrl) previewUrlsRef.current.add(previewUrl);

            const upload: PendingUpload = {
                id: nextUploadIdRef.current++,
                name: file.name,
                previewUrl,
                status: validationError ? "error" : "uploading",
                error: validationError ?? undefined,
            };

            return { file, upload };
        });

        setUploads((previous) => [
            ...previous,
            ...queue.map((item) => item.upload),
        ]);

        for (const { file, upload } of queue) {
            if (upload.status !== "uploading") continue;

            try {
                const { url } = await uploadAdminImage(file, "gallery");
                appendUploadedImage(url);
                dismissUpload(upload.id);
            } catch (uploadFailure) {
                const message = getUploadErrorMessage(uploadFailure);

                setUploads((previous) =>
                    previous.map((item) =>
                        item.id === upload.id
                            ? { ...item, status: "error", error: message }
                            : item
                    )
                );
            }
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await onSave({
            title: title.trim(),
            images: images
                .map((url) => url.trim())
                .filter(Boolean)
                .map((url) => ({ url })),
            isActive,
            sortOrder: gallery?.sortOrder ?? 0,
        });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    {gallery ? "Редактировать галерею" : "Новая галерея"}
                </h2>
                <p className={styles.subtitle}>
                    Укажите название и добавьте фотографии по ссылке или
                    с компьютера.
                </p>
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="gallery-title">
                    Название галереи / события
                </label>

                <input
                    id="gallery-title"
                    className={styles.input}
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={120}
                    required
                    placeholder="Например, Halloween Sushi Night"
                />
            </div>

            <section className={styles.photoSection}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                        Фотографии
                        <span className={styles.count}>{images.length}</span>
                    </h3>

                    <div className={styles.headerActions}>
                        <button
                            className={styles.addImageButton}
                            type="button"
                            onClick={addImage}
                        >
                            + Добавить фото
                        </button>

                        <input
                            ref={fileInputRef}
                            className={styles.fileInput}
                            type="file"
                            accept={ADMIN_UPLOAD_ACCEPT}
                            multiple
                            onChange={(event) =>
                                void handleFilesSelected(event)
                            }
                            tabIndex={-1}
                            aria-hidden="true"
                        />

                        <button
                            className={styles.addImageButton}
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            aria-describedby="gallery-upload-hint"
                        >
                            ⇪ Загрузить с компьютера
                        </button>
                    </div>
                </div>

                <p id="gallery-upload-hint" className={styles.uploadHint}>
                    Можно выбрать несколько файлов: JPEG, PNG, WebP или AVIF,
                    каждый до 5 МБ.
                </p>

                {uploads.length > 0 && (
                    <ul
                        className={styles.uploadList}
                        aria-label="Загрузка фотографий"
                        aria-live="polite"
                    >
                        {uploads.map((upload) => (
                            <li
                                key={upload.id}
                                className={`${styles.uploadItem} ${
                                    upload.status === "error"
                                        ? styles.uploadItemError
                                        : ""
                                }`}
                            >
                                <span className={styles.uploadThumb}>
                                    {upload.previewUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={upload.previewUrl}
                                            alt=""
                                        />
                                    ) : (
                                        <span aria-hidden="true">🖼</span>
                                    )}
                                </span>

                                <span className={styles.uploadInfo}>
                                    <span className={styles.uploadName}>
                                        {upload.name}
                                    </span>
                                    <span className={styles.uploadState}>
                                        {upload.status === "uploading"
                                            ? "Загрузка..."
                                            : upload.error}
                                    </span>
                                </span>

                                {upload.status === "error" && (
                                    <button
                                        type="button"
                                        className={styles.uploadDismiss}
                                        onClick={() =>
                                            dismissUpload(upload.id)
                                        }
                                        aria-label={`Убрать ${upload.name}`}
                                    >
                                        ×
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {images.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon} aria-hidden="true">
                            🖼
                        </span>
                        <p className={styles.emptyTitle}>
                            Пока нет фотографий
                        </p>
                        <p className={styles.emptyText}>
                            Нажмите «Добавить фото» и вставьте URL изображения
                            или загрузите фото с компьютера.
                        </p>
                    </div>
                ) : (
                    <div className={styles.imageList}>
                        {images.map((url, index) => (
                            <div className={styles.imageItem} key={index}>
                                <div className={styles.previewBox}>
                                    {url.trim() ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            className={styles.preview}
                                            src={url}
                                            alt={`Предпросмотр фотографии ${index + 1}`}
                                        />
                                    ) : (
                                        <span className={styles.previewPlaceholder}>
                                            Нет превью
                                        </span>
                                    )}
                                    <span className={styles.previewIndex}>
                                        {index + 1}
                                    </span>
                                </div>

                                <div className={styles.imageBody}>
                                    <div className={styles.field}>
                                        <label
                                            className={styles.label}
                                            htmlFor={`gallery-image-${index}`}
                                        >
                                            URL фотографии {index + 1}
                                        </label>

                                        <input
                                            id={`gallery-image-${index}`}
                                            className={styles.input}
                                            type="url"
                                            value={url}
                                            onChange={(event) =>
                                                updateImage(index, event.target.value)
                                            }
                                            placeholder="https://example.com/photo.jpg"
                                        />
                                    </div>

                                    <button
                                        className={styles.removeButton}
                                        type="button"
                                        onClick={() => removeImage(index)}
                                    >
                                        Удалить фото
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <label className={styles.toggle}>
                <input
                    className={styles.checkbox}
                    type="checkbox"
                    role="switch"
                    checked={isActive}
                    onChange={(event) =>
                        setIsActive(event.target.checked)
                    }
                />
                <span className={styles.toggleTrack} aria-hidden="true">
                    <span className={styles.toggleThumb} />
                </span>
                <span className={styles.toggleText}>
                    <span className={styles.toggleLabel}>Активная галерея</span>
                    <span className={styles.toggleHint}>
                        Активная галерея отображается на странице ресторана.
                    </span>
                </span>
            </label>

            <div className={styles.actions}>
                <button
                    className={styles.cancelButton}
                    type="button"
                    onClick={onCancel}
                >
                    Отмена
                </button>

                <button
                    className={styles.saveButton}
                    type="submit"
                    disabled={saving || isUploading || !title.trim()}
                >
                    {saving ? "Сохранение..." : "Сохранить галерею"}
                </button>
            </div>
        </form>
    );
}

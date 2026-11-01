"use client";

import { useState, type FormEvent } from "react";

import type { CreateAdminGalleryPayload } from "@/lib/api/adminApi";
import type { RestaurantGallery } from "@/lib/api/restaurantGalleryApi";

import styles from "./AdminGalleryForm.module.css";

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
                    {gallery ? "Upravit galerii" : "Nová galerie"}
                </h2>
                <p className={styles.subtitle}>
                    Vyplňte název a přidejte odkazy na fotografie.
                </p>
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="gallery-title">
                    Název galerie / události
                </label>

                <input
                    id="gallery-title"
                    className={styles.input}
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={120}
                    required
                    placeholder="Např. Halloween Sushi Night"
                />
            </div>

            <section className={styles.photoSection}>
                <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                        Fotografie
                        <span className={styles.count}>{images.length}</span>
                    </h3>

                    <button
                        className={styles.addImageButton}
                        type="button"
                        onClick={addImage}
                    >
                        + Přidat fotografii
                    </button>
                </div>

                {images.length === 0 ? (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon} aria-hidden="true">
                            🖼
                        </span>
                        <p className={styles.emptyTitle}>
                            Zatím žádné fotografie
                        </p>
                        <p className={styles.emptyText}>
                            Klikněte na „Přidat fotografii“ a vložte URL obrázku.
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
                                            alt={`Náhled fotografie ${index + 1}`}
                                        />
                                    ) : (
                                        <span className={styles.previewPlaceholder}>
                                            Bez náhledu
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
                                            URL fotografie {index + 1}
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
                                        Odebrat fotografii
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
                    <span className={styles.toggleLabel}>Aktivní galerie</span>
                    <span className={styles.toggleHint}>
                        Aktivní galerie se zobrazí na stránce restaurace.
                    </span>
                </span>
            </label>

            <div className={styles.actions}>
                <button
                    className={styles.cancelButton}
                    type="button"
                    onClick={onCancel}
                >
                    Zrušit
                </button>

                <button
                    className={styles.saveButton}
                    type="submit"
                    disabled={saving || !title.trim()}
                >
                    {saving ? "Ukládání..." : "Uložit galerii"}
                </button>
            </div>
        </form>
    );
}

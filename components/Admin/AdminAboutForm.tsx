
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";

import type { RestaurantAbout } from "@/lib/api/restaurantAboutApi";
import type { UpdateAdminAboutPayload } from "@/lib/api/adminApi";

import css from "./AdminEvents.module.css";

type Props = {
    initialAbout: RestaurantAbout | null;
    onSubmit: (payload: UpdateAdminAboutPayload) => Promise<void>;
};

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
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSaving) return;

        setIsSaving(true);
        setError("");

        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                imageUrl: imageUrl.trim(),
            });
        } catch {
            setError("Nepodařilo se uložit změny. Zkuste to znovu.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form className={css.form} onSubmit={handleSubmit}>
            <div className={css.field}>
                <label htmlFor="about-title">Nadpis</label>
                <input
                    id="about-title"
                    className={css.input}
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={120}
                    required
                    placeholder="SushiMax — víc než jen sushi"
                />
            </div>

            <div className={css.field}>
                <label htmlFor="about-description">Popis</label>
                <textarea
                    id="about-description"
                    className={css.textarea}
                    value={description}
                    onChange={(event) =>
                        setDescription(event.target.value)
                    }
                    maxLength={3000}
                    rows={7}
                    placeholder="Napište něco o své restauraci..."
                />
            </div>

            <div className={css.field}>
                <label htmlFor="about-image">URL fotografie</label>
                <input
                    id="about-image"
                    className={css.input}
                    type="url"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    maxLength={2048}
                    placeholder="https://example.com/restaurant.jpg"
                />
            </div>

            {imageUrl.trim() && (
                <div className={css.field}>
                    <span className={css.label}>Náhled fotografie</span>
                    <Image
                        src={imageUrl.trim()}
                        alt="Náhled fotografie restaurace"
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
                    disabled={isSaving}
                >
                    {isSaving ? "Ukládání..." : "Uložit změny"}
                </button>
            </div>
        </form>
    );
}


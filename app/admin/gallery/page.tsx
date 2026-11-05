"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import styles from "./page.module.css";

import AdminLayout from "@/components/Admin/AdminLayout/AdminLayout";
import AdminGalleryForm from "@/components/Admin/AdminGalleryForm";

import {
    getAdminMe,
    getAdminGalleries,
    createAdminGallery,
    updateAdminGallery,
    deleteAdminGallery,
} from "@/lib/api/adminApi";

import type {
    CreateAdminGalleryPayload,
} from "@/lib/api/adminApi";

import type { RestaurantAdmin } from "@/types/admin";
import type { RestaurantGallery } from "@/lib/api/restaurantGalleryApi";

export default function AdminGalleryPage() {
    const router = useRouter();

    const [admin, setAdmin] = useState<RestaurantAdmin | null>(null);
    const [galleries, setGalleries] = useState<RestaurantGallery[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState<RestaurantGallery | null>(null);
    const [showForm, setShowForm] = useState(false);

    const loadGalleries = useCallback(async () => {
        const data = await getAdminGalleries();
        setGalleries(data);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const currentAdmin = await getAdminMe();
                if (cancelled) return;

                setAdmin(currentAdmin);

                const data = await getAdminGalleries();
                if (!cancelled) setGalleries(data);
            } catch {
                if (!cancelled) router.replace("/admin/login");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, [router]);

    const handleSave = async (payload: CreateAdminGalleryPayload) => {
        setSaving(true);

        try {
            if (editing) {
                await updateAdminGallery(editing._id, payload);
                toast.success("Галерея обновлена");
            } else {
                await createAdminGallery(payload);
                toast.success("Галерея создана");
            }

            await loadGalleries();
            setEditing(null);
            setShowForm(false);
        } catch {
            toast.error("Не удалось сохранить галерею");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (gallery: RestaurantGallery) => {
        if (!window.confirm(`Удалить галерею «${gallery.title}»?`)) {
            return;
        }

        try {
            await deleteAdminGallery(gallery._id);
            await loadGalleries();
            toast.success("Галерея удалена");
        } catch {
            toast.error("Не удалось удалить галерею");
        }
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (!admin) {
        return null;
    }

    return (
        
<AdminLayout admin={admin}>
    <section className={styles.page}>
        <div className={styles.header}>
            <div>
                <h1 className={styles.title}>Галерея</h1>
                <p className={styles.description}>
                    Управляйте фотографиями вашего ресторана.
                </p>
            </div>

            {!showForm && (
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => {
                        setEditing(null);
                        setShowForm(true);
                    }}
                >
                    + Новая галерея
                </button>
            )}
        </div>

        {showForm && (
            <AdminGalleryForm
                key={editing?._id ?? "new"}
                gallery={editing ?? undefined}
                saving={saving}
                onSave={handleSave}
                onCancel={() => {
                    setEditing(null);
                    setShowForm(false);
                }}
            />
        )}

        <div>
            <h2 className={styles.sectionTitle}>
                Созданные галереи
            </h2>

            {galleries.length === 0 ? (
                <p className={styles.empty}>
                    У вас пока нет галерей.
                </p>
                ) : (
                    <div className={styles.galleryGrid}>
                        {galleries.map((gallery) => (
                            <article
                                key={gallery._id}
                                className={styles.galleryCard}
                            >
                                <h3 className={styles.galleryTitle}>
                                    {gallery.title}
                                </h3>

                                <p className={styles.galleryInfo}>
                                    Фотографий: {gallery.images.length}
                                </p>

                                <p
                                    className={
                                        gallery.isActive
                                            ? styles.active
                                            : styles.inactive
                                    }
                                >
                                    {gallery.isActive
                                        ? "Активный"
                                        : "Неактивный"}
                                </p>

                                <div className={styles.actions}>
                                    <button
                                        type="button"
                                        className={styles.editButton}
                                        onClick={() => {
                                            setEditing(gallery);
                                            setShowForm(true);
                                        }}
                                    >
                                        Изменить
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(gallery)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    </AdminLayout>

    );
}

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
                toast.success("Galerie byla aktualizována");
            } else {
                await createAdminGallery(payload);
                toast.success("Galerie byla vytvořena");
            }

            await loadGalleries();
            setEditing(null);
            setShowForm(false);
        } catch {
            toast.error("Nepodařilo se uložit galerii");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (gallery: RestaurantGallery) => {
        if (!window.confirm(`Opravdu smazat galerii "${gallery.title}"?`)) {
            return;
        }

        try {
            await deleteAdminGallery(gallery._id);
            await loadGalleries();
            toast.success("Galerie byla smazána");
        } catch {
            toast.error("Nepodařilo se smazat galerii");
        }
    };

    if (loading) {
        return <p>Načítání...</p>;
    }

    if (!admin) {
        return null;
    }

    return (
        
<AdminLayout admin={admin}>
    <section className={styles.page}>
        <div className={styles.header}>
            <div>
                <h1 className={styles.title}>Galerie</h1>
                <p className={styles.description}>
                    Spravujte fotografie vaší restaurace.
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
                    + Nová galerie
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
                Vytvořené galerie
            </h2>

            {galleries.length === 0 ? (
                <p className={styles.empty}>
                    Zatím nemáte žádné galerie.
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
                                    {gallery.images.length} fotografií
                                </p>

                                <p
                                    className={
                                        gallery.isActive
                                            ? styles.active
                                            : styles.inactive
                                    }
                                >
                                    {gallery.isActive
                                        ? "Aktivní"
                                        : "Neaktivní"}
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
                                        Upravit
                                    </button>

                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={() => handleDelete(gallery)}
                                    >
                                        Smazat
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

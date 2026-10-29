"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import EventForm from "@/components/Admin/EventForm";

import {
    createAdminEvent,
    deleteAdminEvent,
    getAdminEvents,
    getAdminMe,
    updateAdminEvent,
} from "@/lib/api/adminApi";

import { RESTAURANT_LABELS } from "@/lib/restaurants";

import type { RestaurantAdmin } from "@/types/admin";
import type {
    CreateEventPayload,
    Event,
} from "@/types/event";

import css from "@/components/Admin/AdminEvents.module.css";

const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;

        if (typeof message === "string") {
            return message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Něco se nepodařilo.";
};

export default function AdminEventsPage() {
    const router = useRouter();

    const [admin, setAdmin] =
        useState<RestaurantAdmin | null>(null);

    const [events, setEvents] = useState<Event[]>([]);

    const [editingEvent, setEditingEvent] =
        useState<Event | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadEvents = useCallback(async () => {
        const adminEvents = await getAdminEvents();
        setEvents(adminEvents);
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                const currentAdmin = await getAdminMe();

                setAdmin(currentAdmin);

                await loadEvents();
            } catch {
                router.replace("/admin/login");
            } finally {
                setIsLoading(false);
            }
        };

        void load();
    }, [loadEvents, router]);

    const handleCreate = async (
        payload: CreateEventPayload
    ) => {
        try {
            setError("");

            const created = await createAdminEvent(payload);

            setEvents((current) => [
                created,
                ...current,
            ]);
        } catch (error) {
            const message = getErrorMessage(error);
            setError(message);
            throw new Error(message);
        }
    };

    const handleUpdate = async (
        payload: CreateEventPayload
    ) => {
        if (!editingEvent) return;

        try {
            setError("");

            const updated = await updateAdminEvent(
                editingEvent._id,
                payload
            );

            setEvents((current) =>
                current.map((event) =>
                    event._id === updated._id
                        ? updated
                        : event
                )
            );

            setEditingEvent(null);
        } catch (error) {
            const message = getErrorMessage(error);
            setError(message);
            throw new Error(message);
        }
    };

    const handleDelete = async (event: Event) => {
        const confirmed = window.confirm(
            `Opravdu chcete smazat událost "${event.title}"?`
        );

        if (!confirmed) return;

        try {
            setError("");

            await deleteAdminEvent(event._id);

            setEvents((current) =>
                current.filter(
                    (item) => item._id !== event._id
                )
            );

            if (editingEvent?._id === event._id) {
                setEditingEvent(null);
            }
        } catch (error) {
            setError(getErrorMessage(error));
        }
    };

    if (isLoading) {
        return (
            <main className={css.page}>
                <div className={css.container}>
                    Načítání administrace...
                </div>
            </main>
        );
    }

    if (!admin) {
        return null;
    }

    return (
        <main className={css.page}>
            <div className={css.container}>
                <header className={css.header}>
                    <h1 className={css.title}>
                        Události
                    </h1>

                    <p className={css.restaurant}>
                        Restaurace:{" "}
                        <strong>
                            {
                                RESTAURANT_LABELS[
                                    admin.restaurantId
                                ]
                            }
                        </strong>
                    </p>
                </header>

                {error && (
                    <p className={css.error}>
                        {error}
                    </p>
                )}

                <div className={css.content}>
                    <section className={css.card}>
                        <EventForm
                            key={
                                editingEvent?._id ??
                                "new"
                            }
                            initialEvent={editingEvent}
                            onSubmit={
                                editingEvent
                                    ? handleUpdate
                                    : handleCreate
                            }
                            onCancel={() =>
                                setEditingEvent(null)
                            }
                        />
                    </section>

                    <section className={css.card}>
                        <h2 className={css.sectionTitle}>
                            Vytvořené události
                        </h2>

                        {events.length === 0 ? (
                            <p className={css.empty}>
                                Zatím nejsou vytvořené
                                žádné události.
                            </p>
                        ) : (
                            <div className={css.eventList}>
                                {events.map((event) => (
                                    <article
                                        key={event._id}
                                        className={
                                            css.eventCard
                                        }
                                    >
                                        <div
                                            className={
                                                css.eventTop
                                            }
                                        >
                                            <h3
                                                className={
                                                    css.eventTitle
                                                }
                                            >
                                                {
                                                    event.title
                                                }
                                            </h3>

                                            <span
                                                className={`${css.status} ${
                                                    event.active
                                                        ? css.statusActive
                                                        : css.statusInactive
                                                }`}
                                            >
                                                {event.active
                                                    ? "Aktivní"
                                                    : "Neaktivní"}
                                            </span>
                                        </div>

                                        {event.description && (
                                            <p
                                                className={
                                                    css.description
                                                }
                                            >
                                                {
                                                    event.description
                                                }
                                            </p>
                                        )}

                                        <div
                                            className={
                                                css.eventActions
                                            }
                                        >
                                            <button
                                                className={
                                                    css.secondaryButton
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setEditingEvent(
                                                        event
                                                    )
                                                }
                                            >
                                                Upravit
                                            </button>

                                            <button
                                                className={
                                                    css.dangerButton
                                                }
                                                type="button"
                                                onClick={() =>
                                                    void handleDelete(
                                                        event
                                                    )
                                                }
                                            >
                                                Smazat
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}
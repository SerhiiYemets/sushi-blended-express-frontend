
"use client";

import { useEffect, useState } from "react";

import { getPublicEvents } from "@/lib/api/eventsApi";
import {
    RESTAURANT_LABELS,
    type RestaurantId,
} from "@/lib/restaurants";

import type { Event } from "@/types/event";

import css from "./EventsBanner.module.css";

type Props = {
    restaurantId: RestaurantId;
};

const AUTOPLAY_INTERVAL_MS = 10_000;

const formatDateTime = (value: string | null) => {
    if (!value) return null;

    return new Intl.DateTimeFormat("cs-CZ", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Prague",
    }).format(new Date(value));
};


const getDateLabel = (event: Event) => {
    const start = formatDateTime(event.startAt);
    const end = formatDateTime(event.endAt);

    if (start && end) {
        return `Od ${start} do ${end}`;
    }

    if (start) {
        return `Od ${start}`;
    }

    if (end) {
        return `Do ${end}`;
    }

    return null;
};

export default function EventsBanner({
    restaurantId,
}: Props) {
    const [events, setEvents] = useState<Event[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedEventId, setSelectedEventId] =
        useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const loadEvents = async () => {
            try {
                const data = await getPublicEvents(restaurantId);

                if (cancelled) return;

                const now = Date.now();

                const activeEvents = data.filter((event) => {
                    if (!event.endAt) return true;

                    return (
                        new Date(event.endAt).getTime() > now
                    );
                });

                setEvents(activeEvents);
                setCurrentIndex(0);

                const endTimes = activeEvents
                    .filter((event) => event.endAt)
                    .map((event) =>
                        new Date(event.endAt!).getTime()
                    )
                    .filter((time) => Number.isFinite(time));

                if (endTimes.length > 0) {
                    const nextEndTime = Math.min(...endTimes);

                    const delay = Math.min(
                        Math.max(
                            nextEndTime - Date.now(),
                            0
                        ) + 100,
                        2_147_483_647
                    );

                    timeoutId = setTimeout(() => {
                        void loadEvents();
                    }, delay);
                }
            } catch (error) {
                console.error(
                    "Failed to load public events:",
                    error
                );

                if (!cancelled) {
                    setEvents([]);
                    setCurrentIndex(0);
                }
            }
        };

        void loadEvents();

        return () => {
            cancelled = true;

            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        };
    }, [restaurantId]);

    const selectedEvent =
        events.find(
            (event) => event._id === selectedEventId
        ) ?? null;

    useEffect(() => {
        if (!selectedEvent) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedEventId(null);
            }
        };

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [selectedEvent]);

    useEffect(() => {
        if (events.length < 2 || selectedEvent) return;

        const timeoutId = setTimeout(() => {
            setCurrentIndex(
                (current) => (current + 1) % events.length
            );
        }, AUTOPLAY_INTERVAL_MS);

        return () => clearTimeout(timeoutId);
    }, [events.length, currentIndex, selectedEvent]);

    if (events.length === 0) {
        return null;
    }

    const safeIndex = currentIndex % events.length;
    const event = events[safeIndex];
    const dateLabel = getDateLabel(event);

    const showPrevious = () => {
        setCurrentIndex((current) =>
            current <= 0
                ? events.length - 1
                : current - 1
        );
    };

    const showNext = () => {
        setCurrentIndex((current) =>
            current >= events.length - 1
                ? 0
                : current + 1
        );
    };

    return (
        <>
            <section
                className={css.wrapper}
                aria-label="Aktuální události"
            >
                <div
                    className={css.banner}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                        setSelectedEventId(event._id)
                    }
                    onKeyDown={(keyboardEvent) => {
                        if (
                            keyboardEvent.target !==
                            keyboardEvent.currentTarget
                        ) {
                            return;
                        }

                        if (
                            keyboardEvent.key === "Enter" ||
                            keyboardEvent.key === " "
                        ) {
                            keyboardEvent.preventDefault();
                            setSelectedEventId(event._id);
                        }
                    }}
                >
                    {events.length > 1 && (
                        <button
                            className={`${css.arrowButton} ${css.arrowPrev}`}
                            type="button"
                            aria-label="Předchozí událost"
                            onClick={(clickEvent) => {
                                clickEvent.stopPropagation();
                                showPrevious();
                            }}
                        >
                            ‹
                        </button>
                    )}

                    <div
                        className={`${css.bannerContent} ${
                            events.length > 1
                                ? css.bannerContentWithArrows
                                : ""
                        }`}
                    >
                        {event.imageUrl ? (
                            <img
                                className={css.image}
                                src={event.imageUrl}
                                alt={event.title}
                            />
                        ) : (
                            <div
                                className={css.icon}
                                aria-hidden="true"
                            >
                                ✦
                            </div>
                        )}

                        <div className={css.text}>
                            <p className={css.eyebrow}>
                                Událost ·{" "}
                                {
                                    RESTAURANT_LABELS[
                                        restaurantId
                                    ]
                                }
                            </p>

                            <h2 className={css.title}>
                                {event.title}
                            </h2>

                            {dateLabel && (
                                <p className={css.date}>
                                    {dateLabel}
                                </p>
                            )}

                            {event.description && (
                                <p
                                    className={
                                        css.description
                                    }
                                >
                                    {event.description}
                                </p>
                            )}
                        </div>

                        <span className={css.more}>
                            Více informací
                            <span aria-hidden="true">
                                {" "}
                            </span>
                        </span>

                        {events.length > 1 && (
                            <div
                                className={
                                    css.navigation
                                }
                                onClick={(clickEvent) =>
                                    clickEvent.stopPropagation()
                                }
                            >
                                <div className={css.dots}>
                                    {events.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <button
                                                key={
                                                    item._id
                                                }
                                                className={`${css.dot} ${
                                                    index ===
                                                    safeIndex
                                                        ? css.dotActive
                                                        : ""
                                                }`}
                                                type="button"
                                                aria-label={`Událost ${
                                                    index +
                                                    1
                                                }`}
                                                onClick={() =>
                                                    setCurrentIndex(
                                                        index
                                                    )
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {events.length > 1 && (
                        <button
                            className={`${css.arrowButton} ${css.arrowNext}`}
                            type="button"
                            aria-label="Další událost"
                            onClick={(clickEvent) => {
                                clickEvent.stopPropagation();
                                showNext();
                            }}
                        >
                            ›
                        </button>
                    )}
                </div>
            </section>

            {selectedEvent && (
                <div
                    className={css.modalBackdrop}
                    onClick={() =>
                        setSelectedEventId(null)
                    }
                >
                    <article
                        className={css.modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="event-modal-title"
                        onClick={(clickEvent) =>
                            clickEvent.stopPropagation()
                        }
                    >
                        <button
                            className={css.close}
                            type="button"
                            aria-label="Zavřít"
                            onClick={() =>
                                setSelectedEventId(null)
                            }
                        >
                            ×
                        </button>

                        {selectedEvent.imageUrl && (
                            <img
                                className={css.modalImage}
                                src={
                                    selectedEvent.imageUrl
                                }
                                alt={selectedEvent.title}
                            />
                        )}

                        <div className={css.modalBody}>
                            <p
                                className={
                                    css.modalEyebrow
                                }
                            >
                                Událost ·{" "}
                                {
                                    RESTAURANT_LABELS[
                                        selectedEvent.restaurantId
                                    ]
                                }
                            </p>

                            <h2
                                id="event-modal-title"
                                className={
                                    css.modalTitle
                                }
                            >
                                {selectedEvent.title}
                            </h2>

                            {getDateLabel(
                                selectedEvent
                            ) && (
                                <p
                                    className={
                                        css.modalDates
                                    }
                                >
                                    {getDateLabel(
                                        selectedEvent
                                    )}
                                </p>
                            )}

                            {selectedEvent.description && (
                                <p
                                    className={
                                        css.modalDescription
                                    }
                                >
                                    {
                                        selectedEvent.description
                                    }
                                </p>
                            )}

                            {selectedEvent.buttonUrl && (
                                <a
                                    className={
                                        css.modalButton
                                    }
                                    href={
                                        selectedEvent.buttonUrl
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {selectedEvent.buttonText ||
                                        "Více informací"}
                                </a>
                            )}
                        </div>
                    </article>
                </div>
            )}
        </>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent, TouchEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRestaurantGalleries } from "@/lib/api/restaurantGalleryApi";
import type { RestaurantId } from "@/lib/restaurants";
import styles from "./RestaurantGallery.module.css";

type Props = {
  restaurantId: RestaurantId;
};

const VISIBLE_PHOTOS = 6;
const SWIPE_THRESHOLD = 50;

export default function RestaurantGallery({ restaurantId }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(
    null
  );
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    data: galleries = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurant-galleries", restaurantId],
    queryFn: () => getRestaurantGalleries(restaurantId),
  });

  const selectedGallery =
    galleries.find((gallery) => gallery._id === selectedId) ??
    galleries[0];

  const images = selectedGallery?.images ?? [];
  const visibleImages = images.slice(0, VISIBLE_PHOTOS);
  const activePhoto =
    activePhotoIndex !== null ? images[activePhotoIndex] : undefined;
  const isModalOpen = activePhoto !== undefined;
  const hasMultipleImages = images.length > 1;

  const closePhoto = () => {
    setActivePhotoIndex(null);
    lastFocusedRef.current?.focus();
    lastFocusedRef.current = null;
  };

  const showNextPhoto = () => {
    setActivePhotoIndex((current) =>
      current === null ? null : (current + 1) % images.length
    );
  };

  const showPreviousPhoto = () => {
    setActivePhotoIndex((current) =>
      current === null
        ? null
        : (current - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePhoto();
        return;
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        event.preventDefault();
        showNextPhoto();
        return;
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        event.preventDefault();
        showPreviousPhoto();
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>("button")
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && (active === first || !modalRef.current.contains(active))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (active === last || !modalRef.current.contains(active))) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  });

  const openPhoto = (index: number) => {
    if (document.activeElement instanceof HTMLElement) {
      lastFocusedRef.current = document.activeElement;
    }
    setActivePhotoIndex(index);
  };

  const selectGallery = (galleryId: string) => {
    setSelectedId(galleryId);
    setActivePhotoIndex(null);
  };

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closePhoto();
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || !hasMultipleImages) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      showNextPhoto();
    } else {
      showPreviousPhoto();
    }
  };

  if (isLoading) {
    return (
      <section className={styles.section} id="galerie">
        <div className={styles.container}>
          <p className={styles.empty}>Načítání galerie...</p>
        </div>
      </section>
    );
  }

  if (isError || galleries.length === 0) return null;

  return (
    <section className={styles.section} id="galerie">
      <div className={styles.container}>
        <h2 className={styles.title}>Naše fotografie</h2>

        <div className={styles.categories}>
          {galleries.map((gallery) => (
            <button
              key={gallery._id}
              type="button"
              className={`${styles.categoryButton} ${
                selectedGallery._id === gallery._id
                  ? styles.categoryButtonActive
                  : ""
              }`}
              onClick={() => selectGallery(gallery._id)}
              aria-pressed={selectedGallery._id === gallery._id}
            >
              {gallery.title}
            </button>
          ))}
        </div>

        {images.length === 0 ? (
          <p className={styles.empty}>
            V této galerii zatím nejsou fotografie.
          </p>
        ) : (
          <>
            <div className={styles.photoGrid}>
              {visibleImages.map((image, index) => (
                <button
                  key={image._id}
                  type="button"
                  className={styles.photoItem}
                  onClick={() => openPhoto(index)}
                  aria-label={`Otevřít fotografii ${index + 1} z ${images.length}`}
                  aria-haspopup="dialog"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.photo}
                    src={image.url}
                    alt={`${selectedGallery.title} – fotografie ${
                      index + 1
                    }`}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            {images.length > VISIBLE_PHOTOS && (
              <div className={styles.showAllWrapper}>
                <button
                  type="button"
                  className={styles.showAllButton}
                  onClick={() => openPhoto(0)}
                  aria-haspopup="dialog"
                >
                  Zobrazit všechny fotografie ({images.length})
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {activePhoto && activePhotoIndex !== null && (
        <div
          ref={modalRef}
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`Galerie ${selectedGallery.title}`}
          onClick={handleOverlayClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className={styles.modalClose}
            onClick={closePhoto}
            aria-label="Zavřít galerii"
            autoFocus
          >
            ×
          </button>

          {hasMultipleImages && (
            <button
              type="button"
              className={`${styles.modalArrow} ${styles.modalPrevious}`}
              onClick={showPreviousPhoto}
              aria-label="Předchozí fotografie"
            >
              ‹
            </button>
          )}

          <div className={styles.modalStage} onClick={handleOverlayClick}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activePhoto._id}
              className={styles.modalImage}
              src={activePhoto.url}
              alt={`${selectedGallery.title} – fotografie ${
                activePhotoIndex + 1
              } z ${images.length}`}
              draggable={false}
            />
          </div>

          {hasMultipleImages && (
            <button
              type="button"
              className={`${styles.modalArrow} ${styles.modalNext}`}
              onClick={showNextPhoto}
              aria-label="Další fotografie"
            >
              ›
            </button>
          )}

          <div className={styles.modalCounter} aria-live="polite">
            {activePhotoIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </section>
  );
}

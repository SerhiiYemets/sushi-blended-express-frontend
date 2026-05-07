"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import { useCartStore } from "@/lib/store/cartStore";

import css from "./cart.module.css";

const MAX_QUANTITY = 30;
const DELIVERY_FEE = 49;
const FREE_DELIVERY_THRESHOLD = 599;

export default function CartClient() {
    const items = useCartStore((s) => s.items);
    const incrementItem = useCartStore((s) => s.incrementItem);
    const decrementItem = useCartStore((s) => s.decrementItem);
    const removeFromCart = useCartStore((s) => s.removeFromCart);
    const clearCart = useCartStore((s) => s.clearCart);

    const hydrated = useSyncExternalStore(
        useCartStore.persist.onFinishHydration,
        () => useCartStore.persist.hasHydrated(),
        () => false
    );

    const subtotal = useMemo(
        () => items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        [items]
    );
    const totalQty = useMemo(
        () => items.reduce((acc, i) => acc + i.quantity, 0),
        [items]
    );
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
    const total = subtotal + deliveryFee;
    const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
    const freeProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

    return (
        <>
            <Header />
                <main className={css.page}>
                    <section className={css.container}>
                        <header className={css.top}>
                            <div>
                                <h1 className={css.title}>Košík</h1>
                                {hydrated && items.length > 0 && (
                                    <p className={css.subtitle}>
                                        {totalQty}{" "}
                                        {totalQty === 1
                                            ? "položka"
                                            : totalQty < 5
                                            ? "položky"
                                            : "položek"}
                                    </p>
                                )}
                            </div>

                            {hydrated && items.length > 0 && (
                                <button
                                    type="button"
                                    className={css.clearBtn}
                                    onClick={clearCart}
                                >
                                    Vymazat košík
                                </button>
                            )}
                        </header>

                        {!hydrated ? (
                            <div className={css.empty} aria-busy="true" />
                        ) : items.length === 0 ? (
                            <div className={css.empty}>
                                <div className={css.emptyIcon} aria-hidden>
                                    <svg
                                        width="56"
                                        height="56"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 3h2l2.4 12.3a2 2 0 0 0 2 1.7h8.7a2 2 0 0 0 2-1.6L21.5 8H6" />
                                        <circle cx="9.5" cy="20.5" r="1.5" />
                                        <circle cx="17.5" cy="20.5" r="1.5" />
                                    </svg>
                                </div>
                                <h2 className={css.emptyTitle}>Košík je prázdný</h2>
                                <p className={css.emptyText}>
                                    Přidejte si oblíbené sushi a nechte se rozmazlit.
                                </p>
                                <Link href="/menu" className={css.menuBtn}>
                                    Otevřít menu
                                </Link>
                            </div>
                        ) : (
                            <div className={css.wrapper}>
                                <ul className={css.products}>
                                    {items.map((item) => {
                                        const lineTotal = item.price * item.quantity;
                                        const atMin = item.quantity <= 1;
                                        const atMax = item.quantity >= MAX_QUANTITY;
                                        return (
                                            <li key={item._id} className={css.card}>
                                                <div className={css.imageWrapper}>
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            sizes="(min-width: 768px) 140px, 96px"
                                                            className={css.image}
                                                        />
                                                    ) : (
                                                        <div
                                                            className={css.imagePlaceholder}
                                                            aria-hidden
                                                        />
                                                    )}
                                                </div>

                                                <div className={css.info}>
                                                    <div className={css.infoTop}>
                                                        <h3 className={css.name}>
                                                            {item.name}
                                                        </h3>
                                                        {item.weight && (
                                                            <span className={css.weight}>
                                                                {item.weight}
                                                            </span>
                                                        )}
                                                        <span className={css.unitPrice}>
                                                            {item.price} Kč / ks
                                                        </span>
                                                    </div>

                                                    <div className={css.infoBottom}>
                                                        <div
                                                            className={css.qty}
                                                            role="group"
                                                            aria-label={`Množství: ${item.name}`}
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    decrementItem(item._id)
                                                                }
                                                                className={css.qtyBtn}
                                                                disabled={atMin}
                                                                aria-label="Snížit množství"
                                                            >
                                                                −
                                                            </button>
                                                            <span
                                                                className={css.qtyValue}
                                                                aria-live="polite"
                                                            >
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    incrementItem(item._id)
                                                                }
                                                                className={css.qtyBtn}
                                                                disabled={atMax}
                                                                aria-label="Zvýšit množství"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <strong className={css.lineTotal}>
                                                            {lineTotal} Kč
                                                        </strong>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    className={css.removeBtn}
                                                    onClick={() => removeFromCart(item._id)}
                                                    aria-label={`Odebrat ${item.name}`}
                                                    title="Odebrat položku"
                                                >
                                                    <svg
                                                        width="18"
                                                        height="18"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        aria-hidden
                                                    >
                                                        <path d="M3 6h18" />
                                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                                        <path d="M10 11v6" />
                                                        <path d="M14 11v6" />
                                                    </svg>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <aside className={css.summary}>
                                    <h2 className={css.summaryTitle}>
                                        Shrnutí objednávky
                                    </h2>

                                    {remainingForFree > 0 ? (
                                        <div className={css.freeShip}>
                                            <p className={css.freeShipText}>
                                                Do dopravy zdarma vám chybí{" "}
                                                <strong>{remainingForFree} Kč</strong>
                                            </p>
                                            <div
                                                className={css.progress}
                                                role="progressbar"
                                                aria-valuenow={Math.round(freeProgress)}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                <span
                                                    className={css.progressBar}
                                                    style={{ width: `${freeProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={css.freeShipBadge}>
                                            Doprava zdarma
                                        </div>
                                    )}

                                    <div className={css.summaryRows}>
                                        <div className={css.row}>
                                            <span>Mezisoučet</span>
                                            <span>{subtotal} Kč</span>
                                        </div>
                                        <div className={css.row}>
                                            <span>Doprava</span>
                                            <span>
                                                {deliveryFee === 0 ? (
                                                    <em className={css.free}>Zdarma</em>
                                                ) : (
                                                    `${deliveryFee} Kč`
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={css.totalRow}>
                                        <span>Celkem</span>
                                        <strong>{total} Kč</strong>
                                    </div>

                                    <button type="button" className={css.checkoutBtn}>
                                        Pokračovat k objednávce
                                    </button>

                                    <Link href="/menu" className={css.continueLink}>
                                        Pokračovat v nákupu
                                    </Link>
                                </aside>
                            </div>
                        )}
                    </section>
                </main>
            <Footer />
        </>
    );
}

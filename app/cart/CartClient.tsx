"use client";

import { useMemo } from "react";

import Image from "next/image";
import Link from "next/link";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import { useCartStore } from "@/lib/store/cartStore";

import { useHydration } from "@/hooks/useHydration";

import css from "./cart.module.css";

const MAX_QUANTITY = 30;

const DELIVERY_FEE = 49;

const FREE_DELIVERY_THRESHOLD = 599;

export default function CartClient() {
    const hydrated = useHydration();

    const items = useCartStore(
        (s) => s.items
    );

    const incrementItem = useCartStore(
        (s) => s.incrementItem
    );

    const decrementItem = useCartStore(
        (s) => s.decrementItem
    );

    const removeFromCart = useCartStore(
        (s) => s.removeFromCart
    );

    const clearCart = useCartStore(
        (s) => s.clearCart
    );

    const subtotal = useMemo(
        () =>
            items.reduce(
                (acc, item) =>
                    acc +
                    item.price *
                        item.quantity,
                0
            ),
        [items]
    );

    const totalQty = useMemo(
        () =>
            items.reduce(
                (acc, item) =>
                    acc + item.quantity,
                0
            ),
        [items]
    );

    const deliveryFee =
        subtotal >=
            FREE_DELIVERY_THRESHOLD ||
        subtotal === 0
            ? 0
            : DELIVERY_FEE;

    const total =
        subtotal + deliveryFee;

    const remainingForFree =
        Math.max(
            0,
            FREE_DELIVERY_THRESHOLD -
                subtotal
        );

    const freeProgress = Math.min(
        100,
        (subtotal /
            FREE_DELIVERY_THRESHOLD) *
            100
    );

    if (!hydrated) {
        return null;
    }

    return (
        <>
            <Header />

                <main className={css.page}>
                    <section className={css.container}>
                        <div className={css.top}>
                            <div>
                                <h1 className={css.title}>
                                    Košík
                                </h1>

                                <p
                                    className={
                                        css.subtitle
                                    }
                                >
                                    {
                                        totalQty
                                    }{" "}
                                    produktů
                                    v
                                    košíku
                                </p>
                            </div>

                            {items.length >
                                0 && (
                                <button
                                    className={
                                        css.clearBtn
                                    }
                                    onClick={
                                        clearCart
                                    }
                                >
                                    Vymazat
                                    košík
                                </button>
                            )}
                        </div>

                        {items.length ===
                        0 ? (
                            <div
                                className={
                                    css.empty
                                }
                            >
                                <div
                                    className={
                                        css.emptyIcon
                                    }
                                >
                                    🛒
                                </div>

                                <h2
                                    className={
                                        css.emptyTitle
                                    }
                                >
                                    Košík
                                    je
                                    prázdný
                                </h2>

                                <p
                                    className={
                                        css.emptyText
                                    }
                                >
                                    Přidejte
                                    produkty
                                    do
                                    košíku
                                    a
                                    pokračujte
                                    k
                                    objednávce.
                                </p>

                                <Link
                                    href="/menu"
                                    className={
                                        css.menuBtn
                                    }
                                >
                                    Otevřít
                                    menu
                                </Link>
                            </div>
                        ) : (
                            <div
                                className={
                                    css.wrapper
                                }
                            >
                                <div
                                    className={
                                        css.products
                                    }
                                >
                                    {items.map(
                                        (
                                            item
                                        ) => (
                                            <article
                                                key={
                                                    item._id
                                                }
                                                className={
                                                    css.card
                                                }
                                            >
                                                <button
                                                    className={
                                                        css.removeBtn
                                                    }
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item._id
                                                        )
                                                    }
                                                >
                                                    ×
                                                </button>

                                                <div
                                                    className={
                                                        css.imageWrapper
                                                    }
                                                >
                                                    {item.image ? (
                                                        <Image
                                                            src={
                                                                item.image
                                                            }
                                                            alt={
                                                                item.name
                                                            }
                                                            fill
                                                            className={
                                                                css.image
                                                            }
                                                        />
                                                    ) : (
                                                        <div
                                                            className={
                                                                css.imagePlaceholder
                                                            }
                                                        />
                                                    )}
                                                </div>

                                                <div
                                                    className={
                                                        css.info
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            css.infoTop
                                                        }
                                                    >
                                                        <h3
                                                            className={
                                                                css.name
                                                            }
                                                        >
                                                            {
                                                                item.name
                                                            }
                                                        </h3>

                                                        {item.weight && (
                                                            <p
                                                                className={
                                                                    css.weight
                                                                }
                                                            >
                                                                {
                                                                    item.weight
                                                                }
                                                            </p>
                                                        )}

                                                        <span
                                                            className={
                                                                css.unitPrice
                                                            }
                                                        >
                                                            {
                                                                item.price
                                                            }{" "}
                                                            Kč
                                                            /
                                                            ks
                                                        </span>
                                                    </div>

                                                    <div
                                                        className={
                                                            css.infoBottom
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                css.qty
                                                            }
                                                        >
                                                            <button
                                                                className={
                                                                    css.qtyBtn
                                                                }
                                                                onClick={() =>
                                                                    decrementItem(
                                                                        item._id
                                                                    )
                                                                }
                                                            >
                                                                −
                                                            </button>

                                                            <span
                                                                className={
                                                                    css.qtyValue
                                                                }
                                                            >
                                                                {
                                                                    item.quantity
                                                                }
                                                            </span>

                                                            <button
                                                                className={
                                                                    css.qtyBtn
                                                                }
                                                                onClick={() => {
                                                                    if (
                                                                        item.quantity <
                                                                        MAX_QUANTITY
                                                                    ) {
                                                                        incrementItem(
                                                                            item._id
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <strong
                                                            className={
                                                                css.lineTotal
                                                            }
                                                        >
                                                            {item.price *
                                                                item.quantity}{" "}
                                                            Kč
                                                        </strong>
                                                    </div>
                                                </div>
                                            </article>
                                        )
                                    )}
                                </div>

                                <aside
                                    className={
                                        css.summary
                                    }
                                >
                                    <h2
                                        className={
                                            css.summaryTitle
                                        }
                                    >
                                        Shrnutí
                                        objednávky
                                    </h2>

                                    {remainingForFree >
                                    0 ? (
                                        <div
                                            className={
                                                css.freeShip
                                            }
                                        >
                                            <p
                                                className={
                                                    css.freeShipText
                                                }
                                            >
                                                Přidejte
                                                ještě{" "}
                                                <strong>
                                                    {
                                                        remainingForFree
                                                    }{" "}
                                                    Kč
                                                </strong>{" "}
                                                pro
                                                dopravu
                                                zdarma
                                            </p>

                                            <div
                                                className={
                                                    css.progress
                                                }
                                            >
                                                <span
                                                    className={
                                                        css.progressBar
                                                    }
                                                    style={{
                                                        width: `${freeProgress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={
                                                css.freeShipBadge
                                            }
                                        >
                                            🚚
                                            Doprava
                                            zdarma
                                            aktivována
                                        </div>
                                    )}

                                    <div
                                        className={
                                            css.summaryRows
                                        }
                                    >
                                        <div
                                            className={
                                                css.row
                                            }
                                        >
                                            <span>
                                                Produkty
                                            </span>

                                            <span>
                                                {
                                                    subtotal
                                                }{" "}
                                                Kč
                                            </span>
                                        </div>

                                        <div
                                            className={
                                                css.row
                                            }
                                        >
                                            <span>
                                                Doprava
                                            </span>

                                            <span>
                                                {deliveryFee ===
                                                0 ? (
                                                    <span
                                                        className={
                                                            css.free
                                                        }
                                                    >
                                                        Zdarma
                                                    </span>
                                                ) : (
                                                    `${deliveryFee} Kč`
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={
                                            css.totalRow
                                        }
                                    >
                                        <span>
                                            Celkem
                                        </span>

                                        <strong>
                                            {total}{" "}
                                            Kč
                                        </strong>
                                    </div>

                                    <button
                                        className={
                                            css.checkoutBtn
                                        }
                                    >
                                        Pokračovat
                                        k
                                        objednávce
                                    </button>

                                    <Link
                                        href="/menu"
                                        className={
                                            css.continueLink
                                        }
                                    >
                                        Pokračovat
                                        v
                                        nákupu
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

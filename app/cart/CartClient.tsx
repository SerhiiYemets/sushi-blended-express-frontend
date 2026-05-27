'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useCartStore, useCartActions } from '@/lib/store/cartStore';
import type { CartItem } from '@/types/cart';
import { useHydrated } from '@/hooks/useHydrated';

import css from './cart.module.css';

const MAX_QUANTITY = 30;

const selectItems = (s: { items: CartItem[] }) => s.items;

type RowProps = {
    item: CartItem;
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
    onRemove: (id: string) => void;
};

const CartRow = memo(function CartRow({
    item,
    onIncrement,
    onDecrement,
    onRemove,
}: RowProps) {
    return (
        <article className={css.card}>
            <button
                className={css.removeBtn}
                onClick={() => onRemove(item._id)}
                aria-label={`Odstranit ${item.name}`}
            >
                ×
            </button>

            <div className={css.imageWrapper}>
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 30vw, 160px"
                        className={css.image}
                    />
                ) : (
                    <div className={css.imagePlaceholder} />
                )}
            </div>

            <div className={css.info}>
                <div className={css.infoTop}>
                    <h3 className={css.name}>{item.name}</h3>

                    {item.weight && (
                        <p className={css.weight}>{item.weight}</p>
                    )}

                    <span className={css.unitPrice}>
                        {item.price} Kč / ks
                    </span>
                </div>

                <div className={css.infoBottom}>
                    <div className={css.qty}>
                        <button
                            className={css.qtyBtn}
                            onClick={() => onDecrement(item._id)}
                            aria-label="Snížit množství"
                        >
                            −
                        </button>

                        <span className={css.qtyValue}>{item.quantity}</span>

                        <button
                            className={css.qtyBtn}
                            onClick={() => {
                                if (item.quantity < MAX_QUANTITY) onIncrement(item._id);
                            }}
                            aria-label="Zvýšit množství"
                        >
                            +
                        </button>
                    </div>

                    <strong className={css.lineTotal}>
                        {item.price * item.quantity} Kč
                    </strong>
                </div>
            </div>
        </article>
    );
});

export default function CartClient() {
    const hydrated = useHydrated();
    const items = useCartStore(selectItems);
    const { incrementItem, decrementItem, removeFromCart, clearCart } =
        useCartActions();

    let estimatedSubtotal = 0;
    let totalQty = 0;
    for (const item of items) {
        estimatedSubtotal += item.price * item.quantity;
        totalQty += item.quantity;
    }

    const showEmpty = hydrated && items.length === 0;
    const showItems = hydrated && items.length > 0;

    return (
        <main className={css.page}>
            <section className={css.container}>
                <div className={css.top}>
                    <div>
                        <h1 className={css.title}>Košík</h1>
                        <p className={css.subtitle}>
                            {hydrated ? `${totalQty} produktů v košíku` : ' '}
                        </p>
                    </div>

                    {showItems && (
                        <button className={css.clearBtn} onClick={clearCart}>
                            Vymazat košík
                        </button>
                    )}
                </div>

                {showEmpty && (
                    <div className={css.empty}>
                        <div className={css.emptyIcon}>🛒</div>
                        <h2 className={css.emptyTitle}>Košík je prázdný</h2>
                        <p className={css.emptyText}>
                            Přidejte produkty do košíku a pokračujte k objednávce.
                        </p>
                        <Link href="/menu" className={css.menuBtn}>
                            Otevřít menu
                        </Link>
                    </div>
                )}

                {showItems && (
                    <div className={css.wrapper}>
                        <div className={css.products}>
                            {items.map((item) => (
                                <CartRow
                                    key={item._id}
                                    item={item}
                                    onIncrement={incrementItem}
                                    onDecrement={decrementItem}
                                    onRemove={removeFromCart}
                                />
                            ))}
                        </div>

                        <aside className={css.summary}>
                            <h2 className={css.summaryTitle}>Shrnutí objednávky</h2>

                            <div className={css.summaryRows}>
                                <div className={css.row}>
                                    <span>Mezisoučet (odhad)</span>
                                    <span>{estimatedSubtotal} Kč</span>
                                </div>
                            </div>

                            <p className={css.subtitle}>
                                Doprava po Kolíně a Jihlavě zdarma.
                            </p>
                            <p className={css.subtitle}>
                                Mimo město 10 Kč za každý kilometr.
                            </p>

                            <Link href="/checkout" className={css.checkoutBtn}>
                                Pokračovat k objednávce
                            </Link>

                            <Link href="/menu" className={css.continueLink}>
                                Pokračovat v nákupu
                            </Link>
                        </aside>
                    </div>
                )}
            </section>
        </main>
    );
}

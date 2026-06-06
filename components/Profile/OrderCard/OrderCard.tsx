"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
    requestReorder,
    useCartStore,
    type ReorderItem,
} from "@/lib/store/cartStore";
import { useSelectedRestaurant } from "@/lib/store/restaurantStore";
import { getMenu } from "@/lib/api/clientApi";
import type { Category } from "@/types/menu";
import type { Product } from "@/types/product";
import type { Order, OrderStatus } from "@/types/order";

import css from "./OrderCard.module.css";

type Props = {
    order: Order;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
    new: "Čeká na potvrzení",
    confirmed: "Potvrzeno",
    cooking: "Připravuje se",
    delivery: "Na cestě",
    completed: "Doručeno",
};

const STATUS_CLASS: Record<OrderStatus, string> = {
    new: css.statusPending,
    confirmed: css.statusConfirmed,
    cooking: css.statusPreparing,
    delivery: css.statusDelivering,
    completed: css.statusCompleted,
};

const dateFormatter = new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

function lineSubtotal(price: number | undefined, quantity: number): number {
    if (typeof price !== "number" || !Number.isFinite(price)) return 0;
    return price * quantity;
}

export default function OrderCard({ order }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const currentRestaurant = useSelectedRestaurant();

    const [isReordering, setIsReordering] = useState(false);

    const formattedDate = useMemo(() => {
        const d = new Date(order.createdAt);
        return Number.isNaN(d.getTime()) ? "" : dateFormatter.format(d);
    }, [order.createdAt]);

    const itemsSubtotal = useMemo(
        () =>
            order.items.reduce(
                (sum, item) => sum + lineSubtotal(item.price, item.quantity ?? 0),
                0
            ),
        [order.items]
    );

    const displayTotal =
        typeof order.totalPrice === "number" && order.totalPrice > 0
            ? order.totalPrice
            : itemsSubtotal + (order.deliveryFee ?? 0);

    const showTotal = displayTotal > 0;

    const shortId = order._id?.slice(-6).toUpperCase() ?? "";
    const status: OrderStatus = order.status ?? "new";
    const statusLabel = STATUS_LABEL[status] ?? status;
    const statusClass = STATUS_CLASS[status] ?? css.statusPending;

    const handleReorder = async () => {
        if (!order.items?.length) {
            toast.error("Tato objednávka neobsahuje žádné položky");
            return;
        }

        const targetRestaurant = order.restaurantId ?? currentRestaurant;

        setIsReordering(true);
        try {
            const menu = await queryClient.fetchQuery<Category[]>({
                queryKey: ["menu", targetRestaurant],
                queryFn: () => getMenu(targetRestaurant),
                staleTime: 60_000,
            });

            const byPoster = new Map<string, Product>();
            for (const category of menu) {
                for (const product of category.products) {
                    byPoster.set(String(product.posterProductId), product);
                }
            }

            const reorderItems: ReorderItem[] = [];
            let missing = 0;

            for (const it of order.items) {
                const key = it.productId ? String(it.productId) : "";
                const product = key ? byPoster.get(key) : undefined;
                const quantity = Math.max(1, it.quantity ?? 1);

                if (!product) {
                    missing++;
                    continue;
                }

                reorderItems.push({
                    _id: product._id,
                    posterProductId: product.posterProductId,
                    name: product.name,
                    price: product.price,
                    image: product.image ?? null,
                    weight: product.weight,
                    restaurantId: targetRestaurant,
                    quantity,
                });
            }

            if (reorderItems.length === 0) {
                toast.error(
                    "Položky této objednávky již nejsou v menu dostupné"
                );
                return;
            }

            if (missing > 0) {
                toast(
                    `${missing} položek z této objednávky již není v menu dostupných`
                );
            }

            requestReorder(targetRestaurant, reorderItems);

            const pending = useCartStore.getState().pendingAction;

            if (!pending) {
                toast.success("Položky byly přidány do košíku");
                router.push("/cart");
            }
        } catch {
            toast.error("Nepodařilo se načíst aktuální menu pro restauraci");
        } finally {
            setIsReordering(false);
        }
    };

    return (
        <article className={css.card}>
            <header className={css.header}>
                <div className={css.headerInfo}>
                    <h3 className={css.orderId}>Objednávka #{shortId}</h3>
                    {formattedDate && (
                        <p className={css.date}>{formattedDate}</p>
                    )}
                </div>

                <span className={`${css.status} ${statusClass}`}>
                    {statusLabel}
                </span>
            </header>

            <ul className={css.items}>
                {order.items.map((item, idx) => {
                    const quantity = item.quantity ?? 0;
                    const line = lineSubtotal(item.price, quantity);
                    const showLine = line > 0;
                    return (
                        <li
                            key={`${item.productId ?? "item"}-${idx}`}
                            className={css.item}
                        >
                            <span className={css.itemName}>
                                <span className={css.itemQty}>
                                    {quantity}×
                                </span>{" "}
                                {item.name ?? "Produkt"}
                            </span>
                            {showLine && (
                                <span className={css.itemPrice}>
                                    {line} Kč
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>

            <footer className={css.footer}>
                {showTotal ? (
                    <div className={css.totalWrap}>
                        <span className={css.totalLabel}>Celkem</span>
                        <strong className={css.totalValue}>
                            {displayTotal} Kč
                        </strong>
                    </div>
                ) : (
                    <div className={css.totalWrap} />
                )}

                <button
                    type="button"
                    onClick={handleReorder}
                    className={css.reorderBtn}
                    disabled={order.items.length === 0 || isReordering}
                    aria-busy={isReordering}
                >
                    {isReordering ? "Načítání…" : "Objednat znovu"}
                </button>
            </footer>
        </article>
    );
}

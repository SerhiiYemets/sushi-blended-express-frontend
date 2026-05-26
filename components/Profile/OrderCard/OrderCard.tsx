"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
    requestReorder,
    useCartStore,
    type ReorderItem,
} from "@/lib/store/cartStore";
import { useSelectedRestaurant } from "@/lib/store/restaurantStore";
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

export default function OrderCard({ order }: Props) {
    const router = useRouter();
    const currentRestaurant = useSelectedRestaurant();

    const formattedDate = useMemo(() => {
        const d = new Date(order.createdAt);
        return Number.isNaN(d.getTime()) ? "" : dateFormatter.format(d);
    }, [order.createdAt]);

    const itemsTotal = useMemo(
        () =>
            order.items.reduce(
                (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
                0
            ),
        [order.items]
    );

    const displayTotal =
        typeof order.totalPrice === "number" && order.totalPrice > 0
            ? order.totalPrice
            : itemsTotal + (order.deliveryFee ?? 0);

    const shortId = order._id?.slice(-6).toUpperCase() ?? "";
    const status: OrderStatus = order.status ?? "new";
    const statusLabel = STATUS_LABEL[status] ?? status;
    const statusClass = STATUS_CLASS[status] ?? css.statusPending;

    const handleReorder = () => {
        if (!order.items?.length) {
            toast.error("Tato objednávka neobsahuje žádné položky");
            return;
        }

        const targetRestaurant = order.restaurantId ?? currentRestaurant;

        const reorderItems: ReorderItem[] = order.items
            .filter((item) => !!item.productId)
            .map((item) => ({
                _id: item.productId,
                name: item.name,
                price: item.price,
                image: item.image ?? null,
                weight: item.weight,
                restaurantId: targetRestaurant,
                quantity: item.quantity,
            }));

        if (reorderItems.length === 0) {
            toast.error("Tato objednávka neobsahuje žádné položky");
            return;
        }

        requestReorder(targetRestaurant, reorderItems);

        const pending = useCartStore.getState().pendingAction;

        if (!pending) {
            toast.success("Položky byly přidány do košíku");
            router.push("/cart");
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
                {order.items.map((item, idx) => (
                    <li
                        key={`${item.productId ?? "item"}-${idx}`}
                        className={css.item}
                    >
                        <span className={css.itemName}>
                            <span className={css.itemQty}>
                                {item.quantity}×
                            </span>{" "}
                            {item.name}
                        </span>
                        <span className={css.itemPrice}>
                            {item.price * item.quantity} Kč
                        </span>
                    </li>
                ))}
            </ul>

            <footer className={css.footer}>
                <div className={css.totalWrap}>
                    <span className={css.totalLabel}>Celkem</span>
                    <strong className={css.totalValue}>
                        {displayTotal} Kč
                    </strong>
                </div>

                <button
                    type="button"
                    onClick={handleReorder}
                    className={css.reorderBtn}
                    disabled={order.items.length === 0}
                >
                    Objednat znovu
                </button>
            </footer>
        </article>
    );
}

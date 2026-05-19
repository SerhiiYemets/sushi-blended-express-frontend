import OrderCard from "@/components/Profile/OrderCard/OrderCard";
import type { Order } from "@/types/order";

import css from "./OrderHistory.module.css";

type Props = {
    orders: Order[];
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
};

export default function OrderHistory({
    orders,
    isLoading = false,
    isError = false,
    onRetry,
}: Props) {
    const sorted = [...orders].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );

    return (
        <section className={css.section}>
            <header className={css.header}>
                <h2 className={css.title}>Historie objednávek</h2>
                {sorted.length > 0 && (
                    <span className={css.count}>
                        {sorted.length}{" "}
                        {sorted.length === 1 ? "objednávka" : "objednávek"}
                    </span>
                )}
            </header>

            {isLoading ? (
                <div className={css.skeleton} aria-busy="true" />
            ) : isError ? (
                <div className={css.empty}>
                    <p className={css.emptyText}>
                        Nepodařilo se načíst objednávky.
                    </p>
                    {onRetry && (
                        <button
                            type="button"
                            className={css.retryBtn}
                            onClick={onRetry}
                        >
                            Zkusit znovu
                        </button>
                    )}
                </div>
            ) : sorted.length === 0 ? (
                <div className={css.empty}>
                    <div className={css.emptyIcon} aria-hidden="true">
                        🍣
                    </div>
                    <p className={css.emptyTitle}>
                        Zatím žádné objednávky
                    </p>
                    <p className={css.emptyText}>
                        Jakmile něco objednáte, najdete to tady.
                    </p>
                </div>
            ) : (
                <ul className={css.list}>
                    {sorted.map((order) => (
                        <li key={order._id} className={css.listItem}>
                            <OrderCard order={order} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

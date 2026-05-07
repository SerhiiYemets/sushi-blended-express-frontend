"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useCartStore } from "@/lib/store/cartStore";

import css from "./ProductPurchasePanel.module.css";

type PanelProduct = {
    _id: string;
    name: string;
    price: number;
    image?: string | null;
    weight?: string;
};

const MAX_QUANTITY = 30;

export default function ProductPurchasePanel({
    product,
}: {
    product: PanelProduct;
}) {
    const addToCart = useCartStore((s) => s.addToCart);
    const [quantity, setQuantity] = useState(1);

    const total = useMemo(
        () => product.price * quantity,
        [product.price, quantity]
    );

    const decrement = () => setQuantity((q) => Math.max(1, q - 1));
    const increment = () => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1));

    const handleAdd = () => {
        addToCart(
            {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image ?? null,
                weight: product.weight,
            },
            quantity
        );

        toast.success(`${product.name} přidáno do košíku`);
    };

    return (
        <div className={css.panel}>
            <div className={css.priceRow}>
                <span className={css.priceLabel}>Cena</span>
                <span className={css.price}>{total} Kč</span>
            </div>

            <div className={css.actions}>
                <div
                    className={css.quantity}
                    role="group"
                    aria-label="Množství"
                >
                    <button
                        type="button"
                        onClick={decrement}
                        className={css.qtyBtn}
                        aria-label="Snížit množství"
                        disabled={quantity <= 1}
                    >
                        −
                    </button>

                    <span className={css.qtyValue} aria-live="polite">
                        {quantity}
                    </span>

                    <button
                        type="button"
                        onClick={increment}
                        className={css.qtyBtn}
                        aria-label="Zvýšit množství"
                        disabled={quantity >= MAX_QUANTITY}
                    >
                        +
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    className={css.addBtn}
                >
                    Přidat do košíku
                </button>
            </div>
        </div>
    );
}

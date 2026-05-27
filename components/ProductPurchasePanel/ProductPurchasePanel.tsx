"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { requestAddToCart, useCartStore } from "@/lib/store/cartStore";
import type { RestaurantId } from "@/lib/restaurants";

import css from "./ProductPurchasePanel.module.css";

type PanelProduct = {
    _id: string;
    posterProductId: number;
    name: string;
    price: number;
    image?: string | null;
    weight?: string;
};

const MAX_QUANTITY = 30;

type Props = {
    product: PanelProduct;
    restaurantId: RestaurantId;
};

export default function ProductPurchasePanel({ product, restaurantId }: Props) {
    const [quantity, setQuantity] = useState(1);

    const total = product.price * quantity;

    const decrement = () => setQuantity((q) => Math.max(1, q - 1));
    const increment = () => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1));

    const handleAdd = () => {
        requestAddToCart(
            {
                _id: product._id,
                posterProductId: product.posterProductId,
                name: product.name,
                price: product.price,
                image: product.image ?? null,
                weight: product.weight,
                restaurantId,
            },
            quantity
        );

        const pending = useCartStore.getState().pendingAction;

        if (!pending) {
            toast.success(`${product.name} přidáno do košíku`);
        }
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

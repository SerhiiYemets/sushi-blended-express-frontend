"use client";

import type { Product } from "@/types/product";
import { useCartStore } from "@/lib/store/cartStore";
import css from "./ProductCard.module.css";

export default function ProductCard({ item }: { item: Product }) {
    const addToCart = useCartStore((s) => s.addToCart);

    return (
        <div className={css.card}>
            <img src={item.image} alt={item.name} className={css.image} />

            <h3 className={css.title}>{item.name}</h3>
            <p className={css.weight}>{item.weight}</p>

            <div className={css.bottom}>
                <span className={css.price}>{item.price} Kč</span>

                <button
                className={css.addBtn}
                onClick={() => addToCart(item)}
                >
                +
                </button>
            </div>
        </div>
    );
}
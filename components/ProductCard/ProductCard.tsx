"use client";

import Image from "next/image";
import type { Product } from "@/types/product";
import { useCartStore } from "@/lib/store/cartStore";
import css from "./ProductCard.module.css";

export default function ProductCard({ item }: { item: Product }) {
    const addToCart = useCartStore((s) => s.addToCart);

    return (
        <div className={css.card}>
            <div className={css.imageWrapper}>
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className={css.image}
                        sizes="(min-width: 1440px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                ) : (
                    <div className={css.imagePlaceholder} aria-hidden />
                )}
            </div>

            <h3 className={css.title}>{item.name}</h3>
            {item.weight && <p className={css.weight}>{item.weight}</p>}

            <div className={css.bottom}>
                <span className={css.price}>{item.price} Kč</span>

                <button
                    className={css.addBtn}
                    onClick={() =>
                        addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image ?? "",
                        })
                    }
                >
                🛒 
                </button>
            </div>
        </div>
    );
}
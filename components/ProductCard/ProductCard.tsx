"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import type { Product } from "@/types/product";
import type { RestaurantId } from "@/lib/restaurants";

import { requestAddToCart, useCartStore } from "@/lib/store/cartStore";

import css from "./ProductCard.module.css";

type Props = {
    item: Product;
    restaurantId: RestaurantId;
    categorySlug?: string;
};

export default function ProductCard({
    item,
    restaurantId,
    categorySlug,
}: Props) {
    const href = `/menu/${encodeURIComponent(
        categorySlug ?? "all"
    )}/${item._id}?r=${restaurantId}`;

    const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const before = useCartStore.getState().items.length;

        requestAddToCart({
            _id: item._id,
            posterProductId: item.posterProductId,
            name: item.name,
            price: item.price,
            image: item.image ?? null,
            weight: item.weight,
            restaurantId,
        });

        const after = useCartStore.getState().items.length;
        const pending = useCartStore.getState().pendingAction;

        if (!pending && after > before) {
            toast.success(`${item.name} přidáno do košíku`);
        } else if (
            !pending &&
            after === before &&
            useCartStore.getState().items.some((i) => i._id === item._id)
        ) {
            toast.success(`${item.name} přidáno do košíku`);
        }
    };

    return (
        <Link href={href} className={css.link} prefetch={false}>
            <article className={css.card}>
                <div className={css.imageWrapper}>
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className={css.image}
                            sizes="(min-width: 1440px) 33vw, (min-width: 768px) 50vw, 100vw"
                            loading="lazy"
                        />
                    ) : (
                        <div className={css.imagePlaceholder} aria-hidden />
                    )}
                </div>

                <h3 className={css.title}>{item.name}</h3>

                {item.weight && <p className={css.weight}>{item.weight}</p>}

                {item.description && (
                    <p className={css.description}>{item.description}</p>
                )}

                <div className={css.bottom}>
                    <span className={css.price}>{item.price} Kč</span>

                    <button
                        type="button"
                        className={css.addBtn}
                        onClick={handleAdd}
                        aria-label={`Přidat ${item.name} do košíku`}
                    >
                        🛒
                    </button>
                </div>
            </article>
        </Link>
    );
}
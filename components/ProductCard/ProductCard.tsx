"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

import type { Product } from "@/types/product";

import { useCartStore } from "@/lib/store/cartStore";

import css from "./ProductCard.module.css";

type Props = {
    item: Product;
    categorySlug?: string;
};

export default function ProductCard({
    item,
    categorySlug,
}: Props) {
    const addToCart = useCartStore(
        (s) => s.addToCart
    );

    const href = `/menu/${encodeURIComponent(
        categorySlug ?? "all"
    )}/${item._id}`;

    const handleAdd = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();

        e.stopPropagation();

        addToCart({
            _id: item._id,
            name: item.name,
            price: item.price,
            image: item.image ?? null,
            weight: item.weight,
        });

        toast.success(
            `${item.name} přidáno do košíku`
        );
    };

    return (
        <Link href={href} className={css.link}>
            <article className={css.card}>
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
                        <div
                            className={
                                css.imagePlaceholder
                            }
                            aria-hidden
                        />
                    )}
                </div>

                <h3 className={css.title}>
                    {item.name}
                </h3>

                {item.weight && (
                    <p className={css.weight}>
                        {item.weight}
                    </p>
                )}

                <div className={css.bottom}>
                    <span className={css.price}>
                        {item.price} Kč
                    </span>

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
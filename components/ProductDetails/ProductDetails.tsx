import Image from "next/image";

import ProductPurchasePanel from "@/components/ProductPurchasePanel/ProductPurchasePanel";
import type { ProductDetails as ProductDetailsType } from "@/types/product";

import css from "./ProductDetails.module.css";

type Props = {
    product: ProductDetailsType;
    titleId?: string;
    priority?: boolean;
};

export default function ProductDetails({
    product,
    titleId,
    priority = false,
}: Props) {
    const ingredients =
        product.ingredients ??
        product.description
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) ??
        [];

    return (
        <article className={css.layout}>
            <div className={css.media}>
                <div className={css.imageWrapper}>
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            priority={priority}
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className={css.image}
                        />
                    ) : (
                        <div className={css.imagePlaceholder} aria-hidden />
                    )}
                </div>
            </div>

            <div className={css.content}>
                <header className={css.heading}>
                    <h1 id={titleId} className={css.title}>
                        {product.name}
                    </h1>
                    {product.weight && (
                        <span className={css.weight}>{product.weight}</span>
                    )}
                </header>

                {product.description && (
                    <section className={css.section}>
                        <h2 className={css.subtitle}>Popis</h2>
                        <p className={css.description}>{product.description}</p>
                    </section>
                )}

                {ingredients.length > 0 && (
                    <section className={css.section}>
                        <h2 className={css.subtitle}>Ingredience</h2>
                        <ul className={css.ingredients}>
                            {ingredients.map((item) => (
                                <li key={item} className={css.ingredient}>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <ProductPurchasePanel
                    product={{
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image ?? null,
                        weight: product.weight,
                    }}
                />
            </div>
        </article>
    );
}

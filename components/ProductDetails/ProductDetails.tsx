import Image from "next/image";

import ProductPurchasePanel from "@/components/ProductPurchasePanel/ProductPurchasePanel";
import type { Product } from "@/types/product";
import type { RestaurantId } from "@/lib/restaurants";

import css from "./ProductDetails.module.css";

type Props = {
    product: Product;
    restaurantId: RestaurantId;
    titleId?: string;
    priority?: boolean;
};

type DescriptionBlock =
    | { type: "text"; text: string }
    | { type: "list"; items: string[] };

/**
 * Formats a raw Poster description string into readable blocks.
 * - Line breaks split content into separate blocks.
 * - A block made of short comma/semicolon-separated parts becomes
 *   ingredient chips; everything else stays a paragraph.
 * Pure presentation helper — no business logic.
 */
function formatDescription(raw: string): DescriptionBlock[] {
    return raw
        .split(/\r?\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const items = line
                .split(/[;,]/)
                .map((part) => part.trim())
                .filter(Boolean);

            const isIngredientList =
                items.length > 1 && items.every((item) => item.length <= 40);

            return isIngredientList
                ? { type: "list" as const, items }
                : { type: "text" as const, text: line };
        });
}

export default function ProductDetails({
    product,
    restaurantId,
    titleId,
    priority = false,
}: Props) {
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
                    {/* {product.weight && (
                        <span className={css.weight}>{product.weight}</span>
                    )} */}
                </header>

                {product.description && (
                    <section className={css.section}>
                        <h2 className={css.subtitle}>Popis</h2>
                        <div className={css.descriptionBody}>
                            {formatDescription(product.description).map(
                                (block, index) =>
                                    block.type === "list" ? (
                                        <ul
                                            key={index}
                                            className={css.ingredients}
                                        >
                                            {block.items.map((item, i) => (
                                                <li
                                                    key={i}
                                                    className={css.ingredient}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p
                                            key={index}
                                            className={css.description}
                                        >
                                            {block.text}
                                        </p>
                                    )
                            )}
                        </div>
                    </section>
                )}

                <ProductPurchasePanel
                    product={{
                        _id: product._id,
                        posterProductId: product.posterProductId,
                        name: product.name,
                        price: product.price,
                        image: product.image ?? null,
                        // weight: product.weight,
                    }}
                    restaurantId={restaurantId}
                />
            </div>
        </article>
    );
}
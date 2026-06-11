import Image from "next/image";

import ProductPurchasePanel from "@/components/ProductPurchasePanel/ProductPurchasePanel";
import type { Product } from "@/types/product";
import type { RestaurantId } from "@/lib/restaurants";

import css from "./ProductDetails.module.css";

// Описываем структуру тех-карты (ролла), которая приходит из Poster
type CompositionItem = {
    name: string;
    ingredients?: string[];
};

// Расширяем стандартный тип Product нужными нам полями
type ExtendedProduct = Product & {
    category?: string;
    composition?: CompositionItem[];
    ingredients?: string[];
};

type Props = {
    product: Product;
    restaurantId: RestaurantId;
    titleId?: string;
    priority?: boolean;
};

export default function ProductDetails({
    product,
    restaurantId,
    titleId,
    priority = false,
}: Props) {
    // Безопасно приводим продукт к расширенному типу вместо any
    const extendedProduct = product as ExtendedProduct;

    const hasComposition = Array.isArray(extendedProduct.composition) && extendedProduct.composition.length > 0;
    const hasIngredients = Array.isArray(extendedProduct.ingredients) && extendedProduct.ingredients.length > 0;

    // Универсальная функция для проверки названий
    const isNotHiddenItem = (text: string | undefined) => {
        if (!text) return false;
        const name = text.toLowerCase().trim();
        return name !== "васаби" && name !== "wasabi";
    };

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

                {/* 1. Если у товара есть сложная структура (сет) */}
                {hasComposition && extendedProduct.composition ? (
                    <section className={css.section}>
                        <h2 className={css.subtitle}>Ingredience</h2>

                        {extendedProduct.composition
                            .filter((roll) => isNotHiddenItem(roll.name))
                            .map((roll) => (
                                <div key={roll.name} style={{ marginBottom: 16 }}>
                                    <strong>{roll.name}</strong>

                                    <ul className={css.ingredients}>
                                        {Array.isArray(roll.ingredients) && 
                                            roll.ingredients
                                                .filter(isNotHiddenItem)
                                                .map((ingredient) => (
                                                    <li key={ingredient} className={css.ingredient}>
                                                        {ingredient}
                                                    </li>
                                                ))
                                        }
                                    </ul>
                                </div>
                            ))}
                    </section>
                ) : /* 2. Если сложного состава нет, но есть обычные ингредиенты (салаты и т.д.) */
                hasIngredients && extendedProduct.ingredients ? (
                    <section className={css.section}>
                        <h2 className={css.subtitle}>Ingredience</h2>

                        <ul className={css.ingredients}>
                            {extendedProduct.ingredients
                                .filter(isNotHiddenItem)
                                .map((ingredient) => (
                                    <li key={ingredient} className={css.ingredient}>
                                        {ingredient}
                                    </li>
                                ))}
                        </ul>
                    </section>
                ) : null}

                <ProductPurchasePanel
                    product={{
                        _id: product._id,
                        posterProductId: product.posterProductId,
                        name: product.name,
                        price: product.price,
                        image: product.image ?? null,
                        weight: product.weight,
                    }}
                    restaurantId={restaurantId}
                />
            </div>
        </article>
    );
}
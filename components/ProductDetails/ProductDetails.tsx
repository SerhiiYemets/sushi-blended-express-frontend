import Image from "next/image";

import ProductPurchasePanel from "@/components/ProductPurchasePanel/ProductPurchasePanel";
import type { Product } from "@/types/product";
import type { RestaurantId } from "@/lib/restaurants";

import css from "./ProductDetails.module.css";

type CompositionItem = {
    name: string;
    ingredients?: string[];
};

type ExtendedProduct = Product & {
    categoryName?: string; 
    categoryId?: string;
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
    const extendedProduct = product as ExtendedProduct;

    const cleanText = (text: string | undefined): string => {
        if (!text) return "";
        return text
            .toLowerCase()
            .normalize("NFD")               
            .replace(/[\u0300-\u036f]/g, "") 
            .trim();
    };

    const isNotHiddenItem = (text: string | undefined) => {
        if (!text) return false;
        
        const name = cleanText(text);
        
        const isHidden = 
            name === "vasabi" || 
            name === "васаби" || 
            name === "wasabi" || 
            name.includes("масло") || 
            name.includes("olej") ||
            name.includes("sůl") ||
            name.includes("cоль");

        return !isHidden;
    };

    const productNameCleaned = cleanText(extendedProduct.name);
    const categoryNameCleaned = cleanText(extendedProduct.categoryName);

    const isPastaOrBowl = 
        categoryNameCleaned.includes("testovin") || 
        categoryNameCleaned.includes("pasta") ||
        categoryNameCleaned.includes("bowl") ||
        categoryNameCleaned.includes("fast") || 
        categoryNameCleaned.includes("obed") ||
        categoryNameCleaned.includes("gril") ||
        categoryNameCleaned.includes("vip") ||
        categoryNameCleaned.includes("role") ||
        categoryNameCleaned.includes("kalifornia") || 
        categoryNameCleaned.includes("philadelphia") ||
        categoryNameCleaned.includes("futomaki") ||
        categoryNameCleaned.includes("maki") ||
        categoryNameCleaned.includes("tepli rolky") ||
        categoryNameCleaned.includes("sladke") ||
        categoryNameCleaned.includes("sushi") ||

        productNameCleaned.includes("testovin") ||
        productNameCleaned.includes("pasta") ||
        productNameCleaned.includes("spaghet") ||
        productNameCleaned.includes("bowl") ||
        productNameCleaned.includes("burger") ||
        productNameCleaned.includes("obed") ||
        productNameCleaned.includes("gril") ||
        productNameCleaned.includes("vip") ||
        productNameCleaned.includes("role") ||
        productNameCleaned.includes("kalifornia") ||
        productNameCleaned.includes("philadelphia") ||
        productNameCleaned.includes("futomaki") ||
        productNameCleaned.includes("maki") ||
        productNameCleaned.includes("tepli rolky") ||
        productNameCleaned.includes("sladke") ||
        productNameCleaned.includes("sushi");

    const cleanComposition = (extendedProduct.composition || []).filter((roll) => {
        return isNotHiddenItem(roll.name);
    });

    const isRealSet = !isPastaOrBowl && cleanComposition.length > 0 && cleanComposition.some(
        (roll) => Array.isArray(roll.ingredients) && roll.ingredients.length > 0
    );

    const showComposition = isRealSet;
    const hasIngredients = Array.isArray(extendedProduct.ingredients) && extendedProduct.ingredients.length > 0;

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

                {showComposition ? (
                    <section className={css.section}>
                        <h2 className={css.subtitle}>Ingredience</h2>

                        {cleanComposition.map((roll) => (
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
                ) : 

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
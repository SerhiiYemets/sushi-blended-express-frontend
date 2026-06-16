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

    const productNameCleaned = cleanText(extendedProduct.name);
    const categoryNameCleaned = cleanText(extendedProduct.categoryName);

    const isSalad = 
        categoryNameCleaned.includes("salat") || 
        productNameCleaned.includes("salat") ||
        categoryNameCleaned.includes("салат") || 
        productNameCleaned.includes("салат");

    const isNotHiddenItem = (text: string | undefined) => {
        if (!text) return false;
        
        const name = cleanText(text);

        if (name.includes("ryze") || name.includes("рис")) {
            return !isSalad; 
        }
        
        const isHidden = 
            name === "vasabi" || 
            name === "васаби" || 
            name === "wasabi" || 
            name.includes("масло") || 
            name.includes("olej") ||
            name.includes("sul") ||  
            name.includes("соль") ||
            name.includes("чеснок") ||
            name.includes("cesnek") || 
            name.includes("майонез") ||
            name.includes("majonez") || 
            name.includes("крем") ||
            name.includes("krem") ||
            name.includes("мука") ||
            name.includes("mouka") || 
            name.includes("сахар") ||
            name.includes("cukr");   

        return !isHidden;
    };

    const isCeburek = 
        categoryNameCleaned.includes("ceburek") || 
        categoryNameCleaned.includes("чебурек") ||
        productNameCleaned.includes("ceburek") ||
        productNameCleaned.includes("чебурек");

    const isSushiOrRoll = 
        categoryNameCleaned.includes("role") ||
        categoryNameCleaned.includes("kalifornia") || 
        categoryNameCleaned.includes("philadelphia") ||
        categoryNameCleaned.includes("futomaki") ||
        categoryNameCleaned.includes("maki") ||
        categoryNameCleaned.includes("tepli rolky") ||
        categoryNameCleaned.includes("sushi") ||
        categoryNameCleaned.includes("vip") ||     
        categoryNameCleaned.includes("вип") ||
        productNameCleaned.includes("role") ||
        productNameCleaned.includes("kalifornia") ||
        productNameCleaned.includes("philadelphia") ||
        productNameCleaned.includes("futomaki") ||
        productNameCleaned.includes("maki") ||
        productNameCleaned.includes("tepli rolky") ||
        productNameCleaned.includes("sushi") ||
        productNameCleaned.includes("vip") ||      
        productNameCleaned.includes("вип");

    const isPastaOrBowl = 
        categoryNameCleaned.includes("testovin") || 
        categoryNameCleaned.includes("pasta") ||
        categoryNameCleaned.includes("bowl") ||
        categoryNameCleaned.includes("fast") || 
        categoryNameCleaned.includes("obed") ||
        categoryNameCleaned.includes("gril") ||
        categoryNameCleaned.includes("vip") ||
        categoryNameCleaned.includes("sladke") ||
        categoryNameCleaned.includes("snidane") ||  
        categoryNameCleaned.includes("zavtrak") ||  
        isSalad ||                                       
        isSushiOrRoll || 
        isCeburek ||                                

        productNameCleaned.includes("testovin") ||
        productNameCleaned.includes("pasta") ||
        productNameCleaned.includes("fast") ||
        productNameCleaned.includes("spaghet") ||
        productNameCleaned.includes("bowl") ||
        productNameCleaned.includes("burger") ||
        productNameCleaned.includes("obed") ||
        productNameCleaned.includes("gril") ||
        productNameCleaned.includes("vip") ||
        productNameCleaned.includes("sladke") ||
        productNameCleaned.includes("snidane") ||  
        productNameCleaned.includes("zavtrak");

    const cleanComposition = (extendedProduct.composition || []).filter((roll) => {
        return isNotHiddenItem(roll.name);
    });

    const isRealSet = !isPastaOrBowl && cleanComposition.length > 0 && cleanComposition.some(
        (roll) => Array.isArray(roll.ingredients) && roll.ingredients.length > 0
    );

    const showComposition = isRealSet;

    let finalIngredients: string[] = [];

    // Изменение логики тут:
    if (isCeburek) {
        // Для чебуреков возвращаем пустой массив, чтобы блок ингредиентов вообще не рендерился
        finalIngredients = [];
    } else {
        finalIngredients = (extendedProduct.ingredients || []).filter(isNotHiddenItem);
        
        if (isSushiOrRoll && !isSalad) {
            const hasRice = finalIngredients.some(ing => {
                const cleaned = cleanText(ing);
                return cleaned.includes("ryze") || cleaned.includes("рис");
            });
            
            if (!hasRice) {
                finalIngredients.unshift("rýže"); 
            }
        }
    }

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

                        {cleanComposition.map((roll) => {
                            const rollIngredients = Array.isArray(roll.ingredients) 
                                ? roll.ingredients.filter(isNotHiddenItem) 
                                : [];
                                
                            const hasRiceInRoll = rollIngredients.some(ing => {
                                const cleaned = cleanText(ing);
                                return cleaned.includes("ryze") || cleaned.includes("рис");
                            });
                            
                            if (!hasRiceInRoll && !isSalad) {
                                rollIngredients.unshift("rýže");
                            }

                            return (
                                <div key={roll.name} style={{ marginBottom: 16 }}>
                                    <strong>{roll.name}</strong>

                                    <ul className={css.ingredients}>
                                        {rollIngredients.map((ingredient) => (
                                            <li key={ingredient} className={css.ingredient}>
                                                {ingredient}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </section>
                ) : 

                /* Сюда попадают чебуреки, но так как массив пустой, блок полностью проигнорируется */
                finalIngredients.length > 0 ? (
                    <section className={css.section}>
                        <h2 className={css.subtitle}>Ingredience</h2>

                        <ul className={css.ingredients}>
                            {finalIngredients.map((ingredient) => (
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
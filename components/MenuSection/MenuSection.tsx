import css from "./MenuSection.module.css";
import ProductCard from "@/components/ProductCard/ProductCard";

export default function MenuSection({ data }: any) {
    return (
        <div id="menu">
            {data.map((cat: any) => (
                <section key={cat.category} id={cat.category} className={css.section}>
                    <h2 className={css.categoryTitle}>{cat.category}</h2>

                    <div className={css.grid}>
                        {cat.products.map((item: any) => (
                        <ProductCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
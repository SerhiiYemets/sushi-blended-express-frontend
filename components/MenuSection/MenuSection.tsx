import type { MenuCategory } from "@/types/menu";
import ProductCard from "../ProductCard/ProductCard";

export default function MenuSection({ data }: { data: MenuCategory[] }) {
    return (
        <div>
            {data.map((cat) => (
                <section key={cat.category} id={cat.category}>
                    <h2>{cat.category}</h2>

                    {cat.products.map((item) => (
                        <ProductCard
                            key={item._id}
                            item={item}
                            categorySlug={cat.category}
                        />
                    ))}
                </section>
            ))}
        </div>
    );
}
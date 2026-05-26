import type { MenuCategory } from "@/types/menu";
import type { RestaurantId } from "@/lib/store/restaurantStore";

import ProductCard from "../ProductCard/ProductCard";

type Props = {
    data: MenuCategory[];
    restaurantId: RestaurantId;
};

export default function MenuSection({ data, restaurantId }: Props) {
    return (
        <div>
            {data.map((cat) => (
                <section key={cat._id} id={cat.name}>
                    <h2>{cat.name}</h2>

                    {cat.products.map((item) => (
                        <ProductCard
                            key={item._id}
                            item={item}
                            restaurantId={restaurantId}
                            categorySlug={cat.name}
                        />
                    ))}
                </section>
            ))}
        </div>
    );
}

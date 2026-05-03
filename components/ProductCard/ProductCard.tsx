import css from "./ProductCard.module.css";
import { useCartStore } from "@/lib/store/cartStore";

export default function ProductCard({ item }: any) {
    const addToCart = useCartStore((s) => s.addToCart);

    return (
        <div className={css.card}>
            <img src={item.image} alt={item.name} className={css.image} />

            <h3 className={css.title}>{item.name}</h3>
            <p className={css.weight}>{item.weight}</p>

            <div className={css.bottom}>
                <span className={css.price}>{item.price} Kč</span>

                <button
                className={css.addBtn}
                onClick={() =>
                    addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                    })
                }
                >
                +
                </button>
            </div>
        </div>
    );
}
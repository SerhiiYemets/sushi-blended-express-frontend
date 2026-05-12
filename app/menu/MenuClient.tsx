"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard/ProductCard";
import { getMenu } from "@/lib/api/clientApi";
import type { MenuCategory } from "@/types/menu";

import css from "./Menu.module.css";

export default function MenuClient() {
    const [data, setData] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        getMenu()
            .then((res) => {
                if (cancelled) return;
                setData(res);
                if (res.length > 0) setActiveCategory(res[0].category);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const current = data.find((c) => c.category === activeCategory);

    return (
        <main className={css.page}>
            <div className={css.container}>
                <h1 className={css.title}>Menu</h1>

                {loading ? (
                    <div className={css.loading}>Načítání…</div>
                ) : (
                    <>
                        <div className={css.categories}>
                            {data.map((cat) => (
                                <button
                                    key={cat.category}
                                    type="button"
                                    onClick={() => setActiveCategory(cat.category)}
                                    className={`${css.categoryBtn} ${
                                        activeCategory === cat.category
                                            ? css.active
                                            : ""
                                    }`}
                                >
                                    {cat.category}
                                </button>
                            ))}
                        </div>

                        {current && current.products.length > 0 ? (
                            <div className={css.products}>
                                {current.products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        item={product}
                                        categorySlug={current.category}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className={css.empty}>
                                V této kategorii zatím nejsou žádné produkty.
                            </p>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

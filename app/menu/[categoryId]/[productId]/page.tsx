import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductPurchasePanel from "@/components/ProductPurchasePanel/ProductPurchasePanel";

import { getProductById, NotFoundError } from "@/lib/api/serverApi";

import css from "./productDetails.module.css";

type Props = {
    params: Promise<{
        categoryId: string;
        productId: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { productId } = await params;

    try {
        const product = await getProductById(productId);

        return {
            title: product.name,
            description:
                product.description?.slice(0, 160) ??
                "Čerstvé sushi s rozvozem.",
        };
    } catch {
        return { title: "Produkt nenalezen" };
    }
}

export default async function ProductPage({ params }: Props) {
    const { categoryId, productId } = await params;

    let product;
    try {
        product = await getProductById(productId);
    } catch (err) {
        if (err instanceof NotFoundError) notFound();
        throw err;
    }

    const ingredients =
        product.ingredients ??
        product.description
            ?.split(",")
            .map((s) => s.trim())
            .filter(Boolean) ??
        [];

    const backHref = `/menu?category=${encodeURIComponent(categoryId)}`;

    return (
        <>
            <Header />

            <main className={css.page}>
                <div className={css.container}>
                    <nav className={css.breadcrumbs} aria-label="Breadcrumb">
                        <Link href="/menu" className={css.crumbLink}>
                            Menu
                        </Link>
                        <span className={css.crumbSep} aria-hidden>
                            /
                        </span>
                        <Link href={backHref} className={css.crumbLink}>
                            {decodeURIComponent(categoryId)}
                        </Link>
                        <span className={css.crumbSep} aria-hidden>
                            /
                        </span>
                        <span className={css.crumbCurrent}>{product.name}</span>
                    </nav>

                    <article className={css.layout}>
                        <div className={css.media}>
                            <div className={css.imageWrapper}>
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        priority
                                        sizes="(min-width: 1024px) 50vw, 100vw"
                                        className={css.image}
                                    />
                                ) : (
                                    <div
                                        className={css.imagePlaceholder}
                                        aria-hidden
                                    />
                                )}
                            </div>
                        </div>

                        <div className={css.content}>
                            <header className={css.heading}>
                                <h1 className={css.title}>{product.name}</h1>
                                {product.weight && (
                                    <span className={css.weight}>
                                        {product.weight}
                                    </span>
                                )}
                            </header>

                            {product.description && (
                                <section className={css.section}>
                                    <h2 className={css.subtitle}>Popis</h2>
                                    <p className={css.description}>
                                        {product.description}
                                    </p>
                                </section>
                            )}

                            {ingredients.length > 0 && (
                                <section className={css.section}>
                                    <h2 className={css.subtitle}>
                                        Ingredience
                                    </h2>
                                    <ul className={css.ingredients}>
                                        {ingredients.map((item) => (
                                            <li
                                                key={item}
                                                className={css.ingredient}
                                            >
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
                </div>
            </main>

            <Footer />
        </>
    );
}

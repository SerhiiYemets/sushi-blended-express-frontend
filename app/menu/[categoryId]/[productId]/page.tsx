import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductDetails from "@/components/ProductDetails/ProductDetails";

import { getProductById, NotFoundError } from "@/lib/api/serverApi";

import css from "./page.module.css";

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

                        <ProductDetails product={product} priority />
                    </div>
                </main>

            <Footer />
        </>
    );
}

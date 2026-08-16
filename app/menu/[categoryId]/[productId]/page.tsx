import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductDetails from "@/components/ProductDetails/ProductDetails";

import {
    getProductFromMenu,
    NotFoundError,
    resolveRestaurantId,
} from "@/lib/api/serverApi";

import css from "./page.module.css";

type Props = {
    params: Promise<{
        categoryId: string;
        productId: string;
    }>;
    searchParams: Promise<{
        r?: string;
    }>;
};

export async function generateMetadata({
    params,
    searchParams,
}: Props): Promise<Metadata> {
    const [{ productId }, { r }] = await Promise.all([params, searchParams]);
    const restaurantId = resolveRestaurantId(r);

    try {
        const { product } = await getProductFromMenu(restaurantId, productId);
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

export default async function ProductPage({ params, searchParams }: Props) {
    const [{ categoryId, productId }, { r }] = await Promise.all([
        params,
        searchParams,
    ]);
    const restaurantId = resolveRestaurantId(r);

    let found;
    try {
        found = await getProductFromMenu(restaurantId, productId);
    } catch (err) {
        if (err instanceof NotFoundError) notFound();
        throw err;
    }

    const { product, orderInfo } = found;

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

                        <ProductDetails
                            product={product}
                            restaurantId={restaurantId}
                            orderInfo={orderInfo}
                            priority
                        />
                    </div>
                </main>

            <Footer />
        </>
    );
}

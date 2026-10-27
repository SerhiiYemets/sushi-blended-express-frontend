import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ProductDetails from "@/components/ProductDetails/ProductDetails";

import {
    getProductFromMenu,
    NotFoundError,
} from "@/lib/api/serverApi";

import {
    isRestaurantId,
    RESTAURANT_LABELS,
} from "@/lib/restaurants";

import css from "@/app/menu/[categoryId]/[productId]/page.module.css";

type Props = {
    params: Promise<{
        restaurantId: string;
        categoryId: string;
        productId: string;
    }>;
};

export default async function RestaurantProductPage({ params }: Props) {
    const { restaurantId, categoryId, productId } = await params;

    if (!isRestaurantId(restaurantId)) {
        notFound();
    }

    let found;

    try {
        found = await getProductFromMenu(restaurantId, productId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            notFound();
        }

        throw error;
    }

    const { product, orderInfo } = found;

    const restaurantHref = `/restaurace/${restaurantId}`;

    return (
        <>
            <Header />

                <main className={css.page}>
                    <div className={css.container}>
                        <nav
                            className={css.breadcrumbs}
                            aria-label="Breadcrumb"
                        >
                            <Link
                                href={restaurantHref}
                                className={css.crumbLink}
                            >
                                {RESTAURANT_LABELS[restaurantId]}
                            </Link>

                            <span
                                className={css.crumbSep}
                                aria-hidden
                            >
                                /
                            </span>

                            <Link
                                href={restaurantHref}
                                className={css.crumbLink}
                            >
                                {decodeURIComponent(categoryId)}
                            </Link>

                            <span
                                className={css.crumbSep}
                                aria-hidden
                            >
                                /
                            </span>

                            <span className={css.crumbCurrent}>
                                {product.name}
                            </span>
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
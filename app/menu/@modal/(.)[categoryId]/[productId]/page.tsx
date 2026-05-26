import { notFound } from "next/navigation";

import ProductDetails from "@/components/ProductDetails/ProductDetails";

import {
    getProductFromMenu,
    NotFoundError,
    resolveRestaurantId,
} from "@/lib/api/serverApi";

import { MODAL_TITLE_ID } from "./_constants";

type Props = {
    params: Promise<{
        categoryId: string;
        productId: string;
    }>;
    searchParams: Promise<{
        r?: string;
    }>;
};

export default async function InterceptedProductPage({
    params,
    searchParams,
}: Props) {
    const [{ productId }, { r }] = await Promise.all([params, searchParams]);
    const restaurantId = resolveRestaurantId(r);

    let product;
    try {
        product = await getProductFromMenu(restaurantId, productId);
    } catch (err) {
        if (err instanceof NotFoundError) notFound();
        throw err;
    }

    return (
        <ProductDetails
            product={product}
            restaurantId={restaurantId}
            titleId={MODAL_TITLE_ID}
            priority
        />
    );
}

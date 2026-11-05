import { notFound } from "next/navigation";

import ProductDetails from "@/components/ProductDetails/ProductDetails";

import {
    getProductFromMenu,
    isRestaurantId,
    NotFoundError,
} from "@/lib/api/serverApi";

import { MODAL_TITLE_ID } from "@/app/menu/@modal/(.)[categoryId]/[productId]/_constants";

type Props = {
    params: Promise<{
        restaurantId: string;
        categoryId: string;
        productId: string;
    }>;
};

export default async function InterceptedRestaurantProductPage({
    params,
}: Props) {
    const { restaurantId, productId } = await params;

    if (!isRestaurantId(restaurantId)) {
        notFound();
    }

    let found;
    try {
        found = await getProductFromMenu(restaurantId, productId);
    } catch (err) {
        if (err instanceof NotFoundError) notFound();
        throw err;
    }

    return (
        <ProductDetails
            product={found.product}
            restaurantId={restaurantId}
            orderInfo={found.orderInfo}
            titleId={MODAL_TITLE_ID}
            priority
        />
    );
}

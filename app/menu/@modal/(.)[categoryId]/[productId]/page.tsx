import { notFound } from "next/navigation";

import ProductDetails from "@/components/ProductDetails/ProductDetails";

import { getProductById, NotFoundError } from "@/lib/api/serverApi";

import { MODAL_TITLE_ID } from "./_constants";

type Props = {
    params: Promise<{
        categoryId: string;
        productId: string;
    }>;
};

export default async function InterceptedProductPage({ params }: Props) {
    const { productId } = await params;

    let product;
    try {
        product = await getProductById(productId);
    } catch (err) {
        if (err instanceof NotFoundError) notFound();
        throw err;
    }

    return (
        <ProductDetails product={product} titleId={MODAL_TITLE_ID} priority />
    );
}

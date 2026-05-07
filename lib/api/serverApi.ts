import "server-only";

import type { ProductDetails } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export class NotFoundError extends Error {
    constructor(message = "Not found") {
        super(message);
        this.name = "NotFoundError";
    }
}

export async function getProductById(
    productId: string
): Promise<ProductDetails> {
    const res = await fetch(`${API_URL}/api/products/${productId}`, {
        next: { revalidate: 60, tags: [`product:${productId}`] },
    });

    if (res.status === 404) {
        throw new NotFoundError(`Product ${productId} not found`);
    }

    if (!res.ok) {
        throw new Error(
            `Failed to fetch product ${productId} (status ${res.status})`
        );
    }

    return res.json();
}

import clientApi from "@/lib/api/clientApi";
import type { OrderPayload } from "@/types/order";

type CreateOrderResult = {
    id: string;
    restaurantId: string;
    status: string;
    subtotal: number;
    deliveryFee: number;
    totalPrice: number;
    posterSyncStatus?: "success" | "failed" | "pending";
    posterOrderId?: number | null;
};

type CreateOrderResponse = {
    message: string;
    order: CreateOrderResult;
    emailSent?: boolean;
    posterWarning?: string;
};

export async function createOrder(
    payload: OrderPayload
): Promise<CreateOrderResponse> {
    const { data } = await clientApi.post<CreateOrderResponse>(
        "/api/orders",
        payload
    );

    return data;
}

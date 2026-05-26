import clientApi from "@/lib/api/clientApi";
import type { Order, OrderPayload } from "@/types/order";

type CreateOrderResponse = {
    message: string;
    order: Order;
    emailSent?: boolean;
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

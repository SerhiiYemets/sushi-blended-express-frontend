import clientApi from "@/lib/api/clientApi";
import type {
    DeliveryCalculateRequest,
    DeliveryCalculateResponse,
} from "@/types/delivery";

export async function calculateDelivery(
    payload: DeliveryCalculateRequest
): Promise<DeliveryCalculateResponse> {
    const { data } = await clientApi.post<DeliveryCalculateResponse>(
        "/api/delivery/calculate",
        payload
    );

    return data;
}

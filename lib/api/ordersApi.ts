import axios from "axios";

import type { OrderPayload } from "@/types/order";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

export async function createOrder(
    payload: OrderPayload
) {
    const { data } = await axios.post(
        `${API_URL}/api/orders`,
        payload
    );

    return data;
}
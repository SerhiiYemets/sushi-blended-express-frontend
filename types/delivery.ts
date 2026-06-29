import type { RestaurantId } from "@/lib/restaurants";

export type DeliveryCalculateRequest = {
    restaurantId: RestaurantId;
    lat: number;
    lng: number;
};

export type DeliveryCalculateResponse = {
    available: boolean;
    zoneId: string;
    zoneName: string;
    deliveryFee: number;
};

export type LatLng = {
    lat: number;
    lng: number;
};

export type SelectedLocation = LatLng & {
    address: string;
    /**
     * House number from the geocoded address, when available. Presence marks
     * the address as complete (street + number) for delivery validation. Does
     * not affect coordinates or delivery-fee calculation.
     */
    houseNumber?: string;
};

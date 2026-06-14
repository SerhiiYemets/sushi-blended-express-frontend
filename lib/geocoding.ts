import type { LatLng } from "@/types/delivery";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export type GeocodeResult = {
    id: string;
    label: string;
    lat: number;
    lng: number;
};

type NominatimSearchItem = {
    osm_type?: string;
    osm_id?: number;
    place_id?: number;
    display_name: string;
    lat: string;
    lon: string;
};

type NominatimReverseItem = {
    display_name?: string;
};

export async function searchAddress(
    query: string,
    signal?: AbortSignal
): Promise<GeocodeResult[]> {
    const trimmed = query.trim();
    if (trimmed.length < 3) return [];

    const params = new URLSearchParams({
        q: trimmed,
        format: "json",
        addressdetails: "0",
        limit: "5",
        countrycodes: "cz",
        "accept-language": "cs",
    });

    const res = await fetch(`${NOMINATIM_BASE}/search?${params.toString()}`, {
        signal,
        headers: { Accept: "application/json" },
    });

    if (!res.ok) {
        throw new Error(`Geocoding failed (${res.status})`);
    }

    const data = (await res.json()) as NominatimSearchItem[];

    return data.map((item) => ({
        id: String(
            item.osm_type && item.osm_id
                ? `${item.osm_type}-${item.osm_id}`
                : item.place_id
        ),
        label: item.display_name,
        lat: Number(item.lat),
        lng: Number(item.lon),
    }));
}

export async function reverseGeocode(
    { lat, lng }: LatLng,
    signal?: AbortSignal
): Promise<string> {
    const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lng),
        format: "json",
        "accept-language": "cs",
    });

    try {
        const res = await fetch(
            `${NOMINATIM_BASE}/reverse?${params.toString()}`,
            {
                signal,
                headers: { Accept: "application/json" },
            }
        );

        if (!res.ok) throw new Error(`Reverse geocoding failed (${res.status})`);

        const data = (await res.json()) as NominatimReverseItem;
        if (data.display_name) return data.display_name;
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw error;
        }
    }

    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

import type { LatLng } from "@/types/delivery";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

export type GeocodeResult = {
    id: string;
    label: string;
    lat: number;
    lng: number;
    /**
     * Structured house number when the geocoder provided one. Its presence is
     * what tells the UI the address is "complete" (street + number). Display
     * text / coordinates are unaffected by this field.
     */
    houseNumber?: string;
};

/**
 * Structured address components returned by Nominatim when `addressdetails=1`.
 * Only the fields we use to build the short label are typed; all are optional
 * because availability varies per result.
 */
type NominatimAddress = {
    road?: string;
    pedestrian?: string;
    footway?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    suburb?: string;
};

type NominatimSearchItem = {
    osm_type?: string;
    osm_id?: number;
    place_id?: number;
    display_name: string;
    address?: NominatimAddress;
    lat: string;
    lon: string;
};

type NominatimReverseItem = {
    display_name?: string;
    address?: NominatimAddress;
};

/**
 * Build a concise, user-facing address ("Street house_number, City") from
 * Nominatim's structured components — e.g. "Na Magistrále 709, Kolín" instead
 * of the verbose `display_name`. Returns `null` when there isn't enough data,
 * so callers can fall back to `display_name`.
 *
 * NOTE: display text only — coordinates / delivery data are never derived here.
 */
function buildShortAddress(address?: NominatimAddress): string | null {
    if (!address) return null;

    const street =
        address.road ?? address.pedestrian ?? address.footway ?? address.suburb;
    const city =
        address.city ??
        address.town ??
        address.village ??
        address.municipality;

    const streetPart = [street, address.house_number]
        .filter(Boolean)
        .join(" ");

    const parts = [streetPart, city].filter(Boolean);
    if (parts.length === 0) return null;

    return parts.join(", ");
}

export async function searchAddress(
    query: string,
    signal?: AbortSignal
): Promise<GeocodeResult[]> {
    const trimmed = query.trim();
    if (trimmed.length < 3) return [];

    const params = new URLSearchParams({
        q: trimmed,
        format: "json",
        // Need the structured `address` object to build the short label.
        addressdetails: "1",
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
        // Short "Street number, City" label for display; full display_name is
        // the fallback when components are missing. Coordinates are unchanged.
        label: buildShortAddress(item.address) ?? item.display_name,
        lat: Number(item.lat),
        lng: Number(item.lon),
        houseNumber: item.address?.house_number,
    }));
}

export async function reverseGeocode(
    { lat, lng }: LatLng,
    signal?: AbortSignal
): Promise<{ address: string; houseNumber?: string }> {
    const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lng),
        format: "json",
        // Need the structured `address` object to build the short label.
        addressdetails: "1",
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
        const houseNumber = data.address?.house_number;
        // Short "Street number, City"; fall back to the full name, then coords.
        const short = buildShortAddress(data.address);
        if (short) return { address: short, houseNumber };
        if (data.display_name) {
            return { address: data.display_name, houseNumber };
        }
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw error;
        }
    }

    return {
        address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        houseNumber: undefined,
    };
}

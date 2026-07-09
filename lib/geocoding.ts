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
 * Extract the municipality from a Czech `display_name`.
 *
 * Nominatim orders CZ components from most to least specific and always places
 * the district (`okres …`) right after the municipality, e.g.:
 *
 *   "43, Pražská, Vítězov, Velim, okres Kolín, Středočeský kraj, 281 01, Česko"
 *                          ▲──────┘ ▲───────┘
 *                       municipality  district
 *
 * The component immediately before `okres …` is therefore the municipality
 * (Velim), while the structured `village` is only the local settlement
 * (Vítězov, a část obce). Returns `null` when the pattern isn't present, so the
 * caller can fall back to the structured component.
 */
function municipalityFromDisplayName(displayName?: string): string | null {
    if (!displayName) return null;

    const parts = displayName.split(",").map((p) => p.trim());

    const okresIndex = parts.findIndex((p) =>
        p.toLowerCase().startsWith("okres ")
    );

    // `> 0` guards both "not found" (-1) and the impossible leading position.
    return okresIndex > 0 ? parts[okresIndex - 1] : null;
}

/**
 * Pick the best city/municipality component for the short label.
 *
 * Structured `city` / `town` / `municipality` are municipality-level and always
 * trusted first. `village` is the exception: it is often a local settlement
 * rather than the municipality users expect, so when it's the only structured
 * option we prefer the municipality parsed from `display_name` and fall back to
 * the village only if that parse fails.
 */
function resolveCity(
    address: NominatimAddress,
    displayName?: string
): string | undefined {
    const municipality = address.city ?? address.town ?? address.municipality;
    if (municipality) return municipality;

    if (address.village) {
        return municipalityFromDisplayName(displayName) ?? address.village;
    }

    return undefined;
}

/**
 * Build a concise, user-facing address ("Street house_number, City") from
 * Nominatim's structured components — e.g. "Pražská 43, Velim" instead of the
 * verbose `display_name`. `displayName` is used only to refine the city (see
 * `resolveCity`). Returns `null` when there isn't enough data, so callers can
 * fall back to `display_name`.
 *
 * NOTE: display text only — coordinates / delivery data are never derived here.
 */
function buildShortAddress(
    address?: NominatimAddress,
    displayName?: string
): string | null {
    if (!address) return null;

    const street =
        address.road ?? address.pedestrian ?? address.footway ?? address.suburb;
    const city = resolveCity(address, displayName);

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
        label: buildShortAddress(item.address, item.display_name) ?? item.display_name,
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

    const res = await fetch(`${NOMINATIM_BASE}/reverse?${params.toString()}`, {
        signal,
        headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Reverse geocoding failed (${res.status})`);

    const data = (await res.json()) as NominatimReverseItem;

    const address =
        buildShortAddress(data.address, data.display_name) ?? data.display_name;

    if (!address) {
        throw new Error("Reverse geocoding returned no address");
    }

    return { address, houseNumber: data.address?.house_number };
}

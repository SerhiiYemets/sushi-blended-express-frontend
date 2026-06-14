"use client";

import { useEffect, useState } from "react";
import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { RESTAURANT_COORDS, type RestaurantId } from "@/lib/restaurants";
import {
    reverseGeocode,
    searchAddress,
    type GeocodeResult,
} from "@/lib/geocoding";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { LatLng, SelectedLocation } from "@/types/delivery";

import css from "./DeliveryMap.module.css";

type Props = {
    restaurantId: RestaurantId;
    onLocationSelected: (location: SelectedLocation) => void;
};

const DEFAULT_ZOOM = 13;
const SELECTED_ZOOM = 16;

/** SVG pin rendered as a Leaflet divIcon — avoids bundler asset-path issues. */
const markerIcon = L.divIcon({
    className: css.markerWrap,
    html: `
        <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M17 0C7.6 0 0 7.6 0 17c0 12 17 29 17 29s17-17 17-29C34 7.6 26.4 0 17 0z" fill="#e23744"/>
            <circle cx="17" cy="17" r="6.5" fill="#fff"/>
        </svg>
    `,
    iconSize: [34, 46],
    iconAnchor: [17, 46],
});

/** Captures map clicks and reports the clicked coordinate. */
function ClickCapture({ onPick }: { onPick: (point: LatLng) => void }) {
    useMapEvents({
        click(event) {
            onPick({ lat: event.latlng.lat, lng: event.latlng.lng });
        },
    });
    return null;
}

/** Smoothly recenters the map whenever the target coordinate changes. */
function Recenter({ target }: { target: LatLng | null }) {
    const map = useMap();

    useEffect(() => {
        if (target) {
            map.flyTo([target.lat, target.lng], SELECTED_ZOOM, {
                duration: 0.8,
            });
        }
    }, [map, target]);

    return null;
}

export default function DeliveryMap({
    restaurantId,
    onLocationSelected,
}: Props) {
    const center = RESTAURANT_COORDS[restaurantId];

    const [position, setPosition] = useState<LatLng | null>(null);

    const [query, setQuery] = useState("");
    // `searchActive` gates both the network request and the dropdown, so a
    // programmatic query update (after a result pick / map click) never
    // re-opens the suggestions list.
    const [searchActive, setSearchActive] = useState(false);

    const debouncedQuery = useDebouncedValue(query, 600);
    const trimmedQuery = debouncedQuery.trim();

    const {
        data: results = [],
        isFetching: searching,
        isError: searchError,
    } = useQuery({
        queryKey: ["geocode-search", trimmedQuery],
        queryFn: ({ signal }) => searchAddress(trimmedQuery, signal),
        enabled: searchActive && trimmedQuery.length >= 3,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    const showResults = searchActive && results.length > 0;

    function handlePickResult(result: GeocodeResult) {
        setSearchActive(false);
        setQuery(result.label);
        const point = { lat: result.lat, lng: result.lng };
        setPosition(point);
        onLocationSelected({ ...point, address: result.label });
    }

    function handleMapClick(point: LatLng) {
        setSearchActive(false);
        // Optimistically place the marker; resolve the address in the background.
        setPosition(point);
        onLocationSelected({
            ...point,
            address: `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`,
        });

        reverseGeocode(point)
            .then((address) => {
                setQuery(address);
                onLocationSelected({ ...point, address });
            })
            .catch(() => {
                /* keep the coordinate fallback already reported */
            });
    }

    return (
        <div className={css.wrap}>
            <div className={css.searchBox}>
                <label htmlFor="deliveryAddressSearch" className={css.srOnly}>
                    Vyhledat adresu
                </label>

                <div className={css.searchInputRow}>
                    <span className={css.searchIcon} aria-hidden="true">
                        🔍
                    </span>

                    <input
                        id="deliveryAddressSearch"
                        type="text"
                        autoComplete="off"
                        className={css.searchInput}
                        placeholder="Vyhledat adresu (ulice, č.p., město)"
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setSearchActive(true);
                        }}
                        onFocus={() => {
                            if (query.trim().length >= 3) setSearchActive(true);
                        }}
                        role="combobox"
                        aria-expanded={showResults}
                        aria-controls="deliveryAddressResults"
                    />

                    {searching && (
                        <span className={css.searchSpinner} aria-hidden="true" />
                    )}
                </div>

                {searchError && (
                    <p className={css.searchError}>
                        Vyhledávání se nezdařilo. Zkuste to prosím znovu.
                    </p>
                )}

                {showResults && (
                    <ul
                        id="deliveryAddressResults"
                        className={css.results}
                        role="listbox"
                    >
                        {results.map((result) => (
                            <li
                                key={result.id}
                                role="option"
                                aria-selected="false"
                            >
                                <button
                                    type="button"
                                    className={css.resultBtn}
                                    onClick={() => handlePickResult(result)}
                                >
                                    {result.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={css.mapShell}>
                <MapContainer
                    center={[center.lat, center.lng]}
                    zoom={DEFAULT_ZOOM}
                    scrollWheelZoom={false}
                    className={css.map}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <ClickCapture onPick={handleMapClick} />
                    <Recenter target={position} />

                    {position && (
                        <Marker
                            position={[position.lat, position.lng]}
                            icon={markerIcon}
                        />
                    )}
                </MapContainer>
            </div>

            <p className={css.hint}>
                Vyhledejte adresu výše nebo klepněte na mapu pro výběr místa
                doručení.
            </p>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delayMs` has
 * passed without a new change. The initial value is returned immediately so
 * first paint (e.g. a shared `?search=` link) filters without waiting.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs]);

    return debounced;
}

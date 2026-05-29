import { useSyncExternalStore } from 'react';

export function useNow(intervalMs = 60_000): number | null {
    return useSyncExternalStore<number | null>(
        notify => {
            const id = setInterval(notify, intervalMs);
            return () => clearInterval(id);
        },
        () => Math.floor(Date.now() / intervalMs) * intervalMs,
        () => null
    );
}

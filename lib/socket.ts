import { io, type Socket } from "socket.io-client";

/**
 * Module-level singleton. The module is evaluated once per browser tab, so this
 * reference is shared across every import — guaranteeing a single underlying
 * connection no matter how many components/providers mount (requirement: "no
 * duplicate socket connections").
 */
let socket: Socket | null = null;

/**
 * Lazily create (or return the existing) Socket.IO client connected to
 * `NEXT_PUBLIC_API_URL`.
 *
 * Reconnection is enabled with an unbounded retry budget so the client heals
 * automatically after the network or backend drops — without the caller having
 * to manage it.
 *
 * Guarded for SSR: returns `null` on the server, where `window` is absent.
 */
export function getSocket(): Socket | null {
    if (typeof window === "undefined") return null;

    if (!socket) {
        const url = process.env.NEXT_PUBLIC_API_URL;

        if (!url) {
            // Falls back to same-origin, but make the misconfig obvious in dev.
            console.warn(
                "[socket] NEXT_PUBLIC_API_URL is not set — connecting to same origin."
            );
        }

        socket = io(url, {
            // Heal automatically after connection loss.
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1_000,
            reconnectionDelayMax: 5_000,
            // Let socket.io negotiate the best transport (polling → websocket),
            // which is the most proxy/firewall-friendly default.
            autoConnect: true,
        });
    }

    return socket;
}

/**
 * Return the existing singleton without creating one. Side-effect free, so it
 * is safe to read during render (e.g. to seed initial connection state).
 */
export function peekSocket(): Socket | null {
    return socket;
}

/**
 * Tear down the singleton. Not needed during normal app life (the provider is
 * mounted for the whole session) but exported for tests and hard teardown.
 */
export function disconnectSocket(): void {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
}

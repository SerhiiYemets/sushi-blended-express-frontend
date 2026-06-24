"use client";

import { createContext, type ReactNode } from "react";

/*
Socket.IO disabled.
Original code preserved.

import {
    createContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import toast from "react-hot-toast";
import type { Socket } from "socket.io-client";

import { getSocket, peekSocket } from "@/lib/socket";
import {
    armNotificationSoundUnlock,
    playNotificationSound,
    preloadNotificationSound,
} from "@/lib/notificationSound";
import { RESTAURANT_LABELS, isRestaurantId } from "@/lib/restaurants";
import type { NewOrderEvent } from "@/types/order";
*/

type SocketContextValue = {
    // Socket.IO disabled — always null now; the field is kept for API stability.
    socket: null;
    isConnected: boolean;
};

export const SocketContext = createContext<SocketContextValue>({
    socket: null,
    isConnected: false,
});

/*
Socket.IO disabled.
Original code preserved.

// Resolve the restaurant label shown in the toast, defensively.
function resolveRestaurantLabel(order: NewOrderEvent): string {
    if (isRestaurantId(order.restaurantId)) {
        return RESTAURANT_LABELS[order.restaurantId];
    }
    return order.restaurant ?? "—";
}

// Resolve the order number/id shown in the toast, defensively.
function resolveOrderNumber(order: NewOrderEvent): string {
    return String(order.orderNumber ?? order._id ?? "—");
}
*/

/**
 * Global provider mounted once near the app root. Socket.IO has been disabled,
 * so it no longer opens a connection or listens for events — it now simply
 * provides a static, disconnected context and renders its children. The
 * realtime original implementation is preserved in the comment below.
 */
export default function SocketProvider({
    children,
}: {
    children: ReactNode;
}) {
    /*
    Socket.IO disabled.
    Original code preserved.

    // Create the singleton once via a lazy initializer (same pattern this
    // project uses for its QueryClient). Stable across renders, so it can be
    // exposed through context without touching a ref during render.
    const [socket] = useState<Socket | null>(() => getSocket());
    // Seed from the existing connection (covers a remount onto a live socket)
    // without creating one during render; events keep it in sync afterwards.
    const [isConnected, setIsConnected] = useState<boolean>(
        () => peekSocket()?.connected ?? false
    );

    // Tracks order ids we've already chimed for → sound plays once per order.
    const notifiedOrdersRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!socket) return;

        // Warm up the shared notification sound so the first order is instant.
        preloadNotificationSound();
        // Unlock playback on the first user interaction (autoplay policy).
        const releaseUnlock = armNotificationSoundUnlock();

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        const handleNewOrder = (order: NewOrderEvent) => {
            // Requirement: log the raw order data.
            console.log("[socket] new-order", order);

            const orderKey = String(order?.orderNumber ?? order?._id ?? "");

            // Play the chime only once per unique order. Unknown/empty ids
            // still get a toast, but we skip the de-dupe guard for them.
            const alreadyNotified =
                orderKey !== "" && notifiedOrdersRef.current.has(orderKey);

            if (!alreadyNotified) {
                if (orderKey !== "") notifiedOrdersRef.current.add(orderKey);

                // Single shared instance; restarts from the start so rapid
                // orders re-trigger the chime without overlapping playbacks.
                playNotificationSound();
            }

            const restaurant = resolveRestaurantLabel(order);
            const orderNumber = resolveOrderNumber(order);

            toast(
                () => (
                    <div>
                        <strong>🔔 New Online Order</strong>
                        <div>Restaurant: {restaurant}</div>
                        <div>Order #{orderNumber}</div>
                    </div>
                ),
                { duration: 6000 }
            );
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("new-order", handleNewOrder);

        // Cleanup: detach only OUR listeners (keep the shared singleton alive so
        // reconnection keeps working and StrictMode's double-mount in dev does
        // not churn the connection). No leaked handlers → no memory leaks.
        return () => {
            releaseUnlock();
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("new-order", handleNewOrder);
        };
    }, [socket]);
    */

    return (
        <SocketContext.Provider value={{ socket: null, isConnected: false }}>
            {children}
        </SocketContext.Provider>
    );
}

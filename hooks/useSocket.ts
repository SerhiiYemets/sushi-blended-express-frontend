"use client";

import { useContext } from "react";

import { SocketContext } from "@/providers/SocketProvider";

/**
 * Access the shared Socket.IO connection and its live connection status from
 * anywhere inside <SocketProvider>.
 *
 * @example
 * const { socket, isConnected } = useSocket();
 * useEffect(() => {
 *     if (!socket) return;
 *     const onUpdate = (data) => { ... };
 *     socket.on("order-updated", onUpdate);
 *     return () => socket.off("order-updated", onUpdate);
 * }, [socket]);
 */
export function useSocket() {
    return useContext(SocketContext);
}

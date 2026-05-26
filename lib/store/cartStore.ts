import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import type { CartItem } from "@/types/cart";

import {
    useRestaurantStore,
    type RestaurantId,
} from "./restaurantStore";

export type ReorderItem = Omit<CartItem, "quantity"> & { quantity: number };

export type PendingAction =
    | { kind: "switch"; restaurantId: RestaurantId }
    | {
            kind: "addItem";
            restaurantId: RestaurantId;
            item: Omit<CartItem, "quantity">;
            quantity: number;
    }
    | {
            kind: "reorder";
            restaurantId: RestaurantId;
            items: ReorderItem[];
    };

export type CartActions = {
    addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    incrementItem: (id: string) => void;
    decrementItem: (id: string) => void;
    setQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    setPendingAction: (action: PendingAction | null) => void;
};

type CartStore = CartActions & {
    items: CartItem[];
    pendingAction: PendingAction | null;
};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],
            pendingAction: null,

            addToCart: (item, quantity = 1) =>
                set((state) => {
                    const existing = state.items.find((i) => i._id === item._id);

                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i._id === item._id
                                    ? { ...i, quantity: i.quantity + quantity }
                                    : i
                            ),
                        };
                    }

                    return {
                        items: [...state.items, { ...item, quantity }],
                    };
                }),

            removeFromCart: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i._id !== id),
                })),

            incrementItem: (id) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i._id === id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                })),

            decrementItem: (id) =>
                set((state) => ({
                    items: state.items
                        .map((i) =>
                            i._id === id
                                ? { ...i, quantity: i.quantity - 1 }
                                : i
                        )
                        .filter((i) => i.quantity > 0),
                })),

            setQuantity: (id, quantity) =>
                set((state) => ({
                    items: state.items
                        .map((i) => (i._id === id ? { ...i, quantity } : i))
                        .filter((i) => i.quantity > 0),
                })),

            clearCart: () => set({ items: [] }),

            setPendingAction: (action) => set({ pendingAction: action }),
        }),
        {
            name: "sushi-cart",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ items: state.items }),
        }
    )
);

export const selectCartActions = (s: CartStore): CartActions => ({
    addToCart: s.addToCart,
    removeFromCart: s.removeFromCart,
    incrementItem: s.incrementItem,
    decrementItem: s.decrementItem,
    setQuantity: s.setQuantity,
    clearCart: s.clearCart,
    setPendingAction: s.setPendingAction,
});

export const useCartActions = () =>
    useCartStore(useShallow(selectCartActions));

export const useCartCount = () =>
    useCartStore((s) => {
        let n = 0;
        for (const item of s.items) n += item.quantity;
        return n;
    });

export const useCartRestaurantId = () =>
    useCartStore(
        (s) => s.items.find((i) => i.restaurantId)?.restaurantId ?? null
    );

export const usePendingAction = () =>
    useCartStore((s) => s.pendingAction);

function currentCartRestaurantId(): RestaurantId | null {
    const items = useCartStore.getState().items;
    return items.find((i) => i.restaurantId)?.restaurantId ?? null;
}

export function requestAddToCart(
    item: Omit<CartItem, "quantity"> & { restaurantId: RestaurantId },
    quantity: number = 1
): void {
    const cart = useCartStore.getState();
    const cartRestaurant = currentCartRestaurantId();

    if (!cartRestaurant || cartRestaurant === item.restaurantId) {
        useRestaurantStore.getState().setRestaurant(item.restaurantId);
        cart.addToCart(item, quantity);
        return;
    }

    cart.setPendingAction({
        kind: "addItem",
        restaurantId: item.restaurantId,
        item,
        quantity,
    });
}

export function requestRestaurantSwitch(target: RestaurantId): void {
    const cart = useCartStore.getState();
    const restaurant = useRestaurantStore.getState();

    if (restaurant.selectedRestaurant === target) {
        return;
    }

    const cartRestaurant = currentCartRestaurantId();

    if (!cartRestaurant || cartRestaurant === target) {
        restaurant.setRestaurant(target);
        return;
    }

    cart.setPendingAction({ kind: "switch", restaurantId: target });
}

export function requestReorder(
    target: RestaurantId,
    items: ReorderItem[]
): void {
    if (items.length === 0) return;

    const cart = useCartStore.getState();
    const restaurant = useRestaurantStore.getState();
    const cartRestaurant = currentCartRestaurantId();

    if (!cartRestaurant || cartRestaurant === target) {
        restaurant.setRestaurant(target);
        for (const it of items) {
            const { quantity, ...rest } = it;
            cart.addToCart({ ...rest, restaurantId: target }, quantity);
        }
        return;
    }

    cart.setPendingAction({
        kind: "reorder",
        restaurantId: target,
        items,
    });
}

export function confirmPendingAction(): void {
    const cart = useCartStore.getState();
    const restaurant = useRestaurantStore.getState();
    const action = cart.pendingAction;
    if (!action) return;

    cart.clearCart();
    restaurant.setRestaurant(action.restaurantId);

    if (action.kind === "addItem") {
        cart.addToCart(action.item, action.quantity);
    } else if (action.kind === "reorder") {
        for (const it of action.items) {
            const { quantity, ...rest } = it;
            cart.addToCart(
                { ...rest, restaurantId: action.restaurantId },
                quantity
            );
        }
    }

    cart.setPendingAction(null);
}

export function cancelPendingAction(): void {
    useCartStore.getState().setPendingAction(null);
}

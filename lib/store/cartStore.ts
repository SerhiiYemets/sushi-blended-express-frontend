import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import type { CartItem } from "@/types/cart";

export type CartActions = {
    addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    incrementItem: (id: string) => void;
    decrementItem: (id: string) => void;
    setQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
};

type CartStore = CartActions & {
    items: CartItem[];
};

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            items: [],

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
        }),
        {
            name: "sushi-cart",
            storage: createJSONStorage(() => localStorage),
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
});

export const useCartActions = () =>
    useCartStore(useShallow(selectCartActions));

export const useCartCount = () =>
    useCartStore((s) => {
        let n = 0;
        for (const item of s.items) n += item.quantity;
        return n;
    });

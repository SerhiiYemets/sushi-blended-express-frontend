import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { CartItem } from "@/types/cart";

type CartStore = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeFromCart: (id: string) => void;
    incrementItem: (id: string) => void;
    decrementItem: (id: string) => void;
    setQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
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
                        .map((i) =>
                            i._id === id ? { ...i, quantity } : i
                        )
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

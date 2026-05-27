import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
    isRestaurantId,
    type RestaurantId,
} from "@/lib/restaurants";

type RestaurantState = {
    selectedRestaurant: RestaurantId;
    setRestaurant: (restaurant: RestaurantId) => void;
};

export const useRestaurantStore = create<RestaurantState>()(
    persist(
        (set) => ({
            selectedRestaurant: "kolin",
            setRestaurant: (restaurant) =>
                set({ selectedRestaurant: restaurant }),
        }),
        {
            name: "restaurant-storage",
            version: 1,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                selectedRestaurant: state.selectedRestaurant,
            }),
            migrate: (persisted) => {
                const value = (persisted as { selectedRestaurant?: unknown })
                    ?.selectedRestaurant;
                return {
                    selectedRestaurant: isRestaurantId(value) ? value : "kolin",
                };
            },
        }
    )
);

export const useSelectedRestaurant = () =>
    useRestaurantStore((s) => s.selectedRestaurant);

export const useSetRestaurant = () =>
    useRestaurantStore((s) => s.setRestaurant);

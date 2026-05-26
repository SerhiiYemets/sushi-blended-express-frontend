import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type RestaurantId = "kolin" | "jihlava";

export const RESTAURANT_LABELS: Record<RestaurantId, string> = {
    kolin: "Kolín",
    jihlava: "Jihlava",
};

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
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                selectedRestaurant: state.selectedRestaurant,
            }),
        }
    )
);

export const useSelectedRestaurant = () =>
    useRestaurantStore((s) => s.selectedRestaurant);

export const useSetRestaurant = () =>
    useRestaurantStore((s) => s.setRestaurant);

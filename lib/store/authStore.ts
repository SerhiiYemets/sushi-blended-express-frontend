import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/user";

type AuthState = {
    user: User | null;
    isHydrated: boolean;

    setUser: (user: User) => void;
    logout: () => void;
    setHydrated: (state: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isHydrated: false,

            setUser: (user) => set({ user }),

            logout: () => set({ user: null }),

            setHydrated: (state) => set({ isHydrated: state }),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user }),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
            skipHydration: false,
        }
    )
);

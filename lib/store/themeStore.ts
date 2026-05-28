import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Theme = "light" | "dark";

type ThemeState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

function applyToDocument(theme: Theme): void {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: "dark",

            setTheme: (theme) => {
                applyToDocument(theme);
                set({ theme });
            },

            toggleTheme: () => {
                const next: Theme = get().theme === "dark" ? "light" : "dark";
                applyToDocument(next);
                set({ theme: next });
            },
        }),
        {
            name: "theme",
            version: 1,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ theme: state.theme }),
            onRehydrateStorage: () => (state) => {
                if (state) applyToDocument(state.theme);
            },
        }
    )
);

export const useTheme = () => useThemeStore((s) => s.theme);
export const useToggleTheme = () => useThemeStore((s) => s.toggleTheme);

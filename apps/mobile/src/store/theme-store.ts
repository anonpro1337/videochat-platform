import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "dark" | "light";

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
  hydrate: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "dark",
  toggle: () =>
    set((state) => {
      const next = state.mode === "dark" ? "light" : "dark";
      AsyncStorage.setItem("theme", next);
      return { mode: next };
    }),
  setMode: (mode) => {
    AsyncStorage.setItem("theme", mode);
    set({ mode });
  },
  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem("theme");
      if (stored === "light" || stored === "dark") {
        set({ mode: stored });
      }
    } catch {
      // defaults to dark
    }
  },
}));

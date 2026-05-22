import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../lib/api";

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  loginWithGuest: () => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isHydrated: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<{ user: User }>("/auth/login", {
        email,
        password,
      });
      await AsyncStorage.setItem("token", data.user.token);
      set({ user: data.user, isLoading: false, isHydrated: true });
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Login failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  register: async (email, password, username) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<{ user: User }>("/auth/register", {
        email,
        password,
        username,
      });
      await AsyncStorage.setItem("token", data.user.token);
      set({ user: data.user, isLoading: false, isHydrated: true });
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Registration failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  loginWithGuest: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<{ user: User }>("/auth/guest");
      await AsyncStorage.setItem("token", data.user.token);
      set({ user: data.user, isLoading: false, isHydrated: true });
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Guest login failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ user: null, isHydrated: true });
  },

  hydrate: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const { data } = await api.get<{ user: User }>("/auth/me");
        set({ user: data.user, isHydrated: true });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      await AsyncStorage.removeItem("token");
      set({ user: null, isHydrated: true });
    }
  },

  clearError: () => set({ error: null }),
}));

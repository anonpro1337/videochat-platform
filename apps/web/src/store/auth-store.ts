import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { getDeviceId } from '@/lib/device';

interface User {
  id: string;
  displayName: string;
  username: string;
  avatar?: string;
  email?: string;
  role: string;
  tier: string;
  status: string;
  coins: number;
  gems: number;
  xp: number;
  level: number;
  isVerified: boolean;
  country?: string;
  language?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data: supabaseData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
          if (authError) throw new Error(authError.message);
          const supabaseToken = supabaseData.session?.access_token;
          const { data } = await api.post('/auth/login', { supabaseToken, email, deviceId: getDeviceId() });
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          set({ user: data.data.user, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err?.response?.data?.message || err.message || 'Login failed', isLoading: false });
        }
      },

      guestLogin: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data: { session } } = await supabase.auth.signInAnonymously();
          const { data } = await api.post('/auth/guest', { deviceId: getDeviceId() });
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          set({ user: data.data.user, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err?.response?.data?.message || 'Guest login failed', isLoading: false });
        }
      },

      register: async (email, password, displayName) => {
        set({ isLoading: true, error: null });
        try {
          const { data: supabaseData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { displayName } },
          });
          if (authError) throw new Error(authError.message);
          const supabaseToken = supabaseData.session?.access_token;
          const username = email.split('@')[0] + '_' + Math.random().toString(36).slice(2, 6);
          const { data } = await api.post('/auth/register', {
            supabaseToken,
            email,
            displayName,
            username,
            deviceId: getDeviceId(),
          });
          localStorage.setItem('accessToken', data.data.accessToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          set({ user: data.data.user, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err?.response?.data?.message || err.message || 'Registration failed', isLoading: false });
        }
      },

      logout: async () => {
        try { await api.post('/auth/logout'); } catch {}
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      fetchUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.data, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user ? {
          id: state.user.id,
          displayName: state.user.displayName,
          username: state.user.username,
          avatar: state.user.avatar,
          role: state.user.role,
          tier: state.user.tier,
        } : null,
      }),
    },
  ),
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  message: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  setUser: (user: User) => void;
}

function mapSupabaseUser(sbUser: any): User {
  return {
    id: sbUser.id,
    displayName: sbUser.user_metadata?.displayName || sbUser.email?.split('@')[0] || 'User',
    username: sbUser.email?.split('@')[0] || 'user_' + sbUser.id.slice(0, 8),
    avatar: sbUser.user_metadata?.avatar_url || undefined,
    email: sbUser.email,
    role: sbUser.role || 'user',
    tier: 'free',
    status: 'online',
    coins: 0,
    gems: 0,
    xp: 0,
    level: 1,
    isVerified: !!sbUser.email_confirmed_at,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      message: null,
      initialized: false,

      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            set({
              user: mapSupabaseUser(session.user),
              isAuthenticated: true,
              initialized: true,
            });
          } else {
            set({ user: null, isAuthenticated: false, initialized: true });
          }
        } catch {
          set({ user: null, isAuthenticated: false, initialized: true });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null, message: null });
        try {
          const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw new Error(error.message);
          if (!session?.user) throw new Error('No session returned');
          set({ user: mapSupabaseUser(session.user), isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'Login failed', isLoading: false });
        }
      },

      guestLogin: async () => {
        set({ isLoading: true, error: null, message: null });
        try {
          const { data: { session }, error } = await supabase.auth.signInAnonymously();
          if (error) throw new Error(error.message);
          if (!session?.user) throw new Error('No session returned');
          set({ user: mapSupabaseUser(session.user), isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'Guest login failed. Enable anonymous sign-ins in Supabase dashboard.', isLoading: false });
        }
      },

      register: async (email, password, displayName) => {
        set({ isLoading: true, error: null, message: null });
        try {
          const { data: { session }, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { displayName } },
          });
          if (error) throw new Error(error.message);
          if (session?.user) {
            set({ user: mapSupabaseUser(session.user), isAuthenticated: true, isLoading: false });
          } else {
            set({ isLoading: false, message: 'Account created! Check your email for a confirmation link to sign in.' });
          }
        } catch (err: any) {
          set({ error: err.message || 'Registration failed', isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false, isLoading: false });
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

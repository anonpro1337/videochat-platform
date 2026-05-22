import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AdType = 'banner' | 'interstitial' | 'rewarded' | 'native';

interface AdEvent {
  type: AdType;
  timestamp: number;
  revenue?: number;
}

interface AdState {
  swipeCount: number;
  lastInterstitial: number;
  lastRewarded: number;
  isPremium: boolean;
  adCooldown: number;
  events: AdEvent[];
  
  incrementSwipe: () => boolean;
  shouldShowInterstitial: () => boolean;
  markInterstitialShown: () => void;
  canShowRewarded: () => boolean;
  markRewardedShown: () => void;
  setPremium: (v: boolean) => void;
  getStats: () => { swipes: number; interstitials: number; rewarded: number };
}

const INTERSTITIAL_INTERVAL = 5;
const REWARDED_COOLDOWN = 120; // seconds
const AD_COOLDOWN = 30; // seconds between ads

export const useAdStore = create<AdState>()(
  persist(
    (set, get) => ({
      swipeCount: 0,
      lastInterstitial: 0,
      lastRewarded: 0,
      isPremium: false,
      adCooldown: AD_COOLDOWN,
      events: [],

      incrementSwipe: () => {
        const state = get();
        if (state.isPremium) return false;
        const newCount = state.swipeCount + 1;
        set({ swipeCount: newCount });
        return newCount >= INTERSTITIAL_INTERVAL;
      },

      shouldShowInterstitial: () => {
        const state = get();
        if (state.isPremium) return false;
        if (state.swipeCount < INTERSTITIAL_INTERVAL) return false;
        const now = Date.now();
        return (now - state.lastInterstitial) / 1000 > state.adCooldown;
      },

      markInterstitialShown: () => {
        set(state => ({ swipeCount: 0, lastInterstitial: Date.now(), events: [...state.events, { type: 'interstitial' as const, timestamp: Date.now() }] }));
      },

      canShowRewarded: () => {
        const state = get();
        const now = Date.now();
        return (now - state.lastRewarded) / 1000 > REWARDED_COOLDOWN;
      },

      markRewardedShown: () => {
        set(state => ({ lastRewarded: Date.now(), events: [...state.events, { type: 'rewarded' as const, timestamp: Date.now() }] }));
      },

      setPremium: (v) => set({ isPremium: v }),

      getStats: () => {
        const state = get();
        const interstitials = state.events.filter(e => e.type === 'interstitial').length;
        const rewarded = state.events.filter(e => e.type === 'rewarded').length;
        return { swipes: state.swipeCount, interstitials, rewarded };
      },
    }),
    { name: 'chatvibe-ads', partialize: (s) => ({ swipeCount: s.swipeCount, isPremium: s.isPremium, lastInterstitial: s.lastInterstitial, lastRewarded: s.lastRewarded, events: s.events }) }
  )
);

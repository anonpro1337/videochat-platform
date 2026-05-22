'use client';

import { create } from 'zustand';
import { realtime } from '@/lib/realtime';

interface VideoState {
  isConnected: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  partnerId: string | null;
  matchId: string | null;
  isSearching: boolean;
  setConnected: (val: boolean) => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  setPartner: (partnerId: string | null, matchId: string | null) => void;
  setSearching: (val: boolean) => void;
}

function sendSignal(type: string, state: VideoState) {
  if (!state.partnerId || !state.matchId) return;
  realtime.broadcast(`match:${state.matchId}`, 'signal:send', {
    type,
    targetUserId: state.partnerId,
    matchId: state.matchId,
  });
}

export const useVideoStore = create<VideoState>((set, get) => ({
  isConnected: false,
  isMuted: false,
  isCameraOff: false,
  partnerId: null,
  matchId: null,
  isSearching: false,

  setConnected: (val) => set({ isConnected: val }),

  toggleMute: () => {
    const newVal = !get().isMuted;
    set({ isMuted: newVal });
    sendSignal(newVal ? 'mute' : 'unmute', get());
  },

  toggleCamera: () => {
    const newVal = !get().isCameraOff;
    set({ isCameraOff: newVal });
    sendSignal(newVal ? 'camera-off' : 'camera-on', get());
  },

  setPartner: (partnerId, matchId) => set({ partnerId, matchId, isConnected: !!partnerId }),

  setSearching: (val) => set({ isSearching: val }),
}));

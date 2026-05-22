'use client';

import { create } from 'zustand';
import { getSocket } from '@/lib/api';

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
    const socket = getSocket();
    if (socket && get().partnerId) {
      socket.emit('signal:send', {
        type: newVal ? 'mute' : 'unmute',
        targetUserId: get().partnerId,
        matchId: get().matchId,
      });
    }
  },

  toggleCamera: () => {
    const newVal = !get().isCameraOff;
    set({ isCameraOff: newVal });
    const socket = getSocket();
    if (socket && get().partnerId) {
      socket.emit('signal:send', {
        type: newVal ? 'camera-off' : 'camera-on',
        targetUserId: get().partnerId,
        matchId: get().matchId,
      });
    }
  },

  setPartner: (partnerId, matchId) => set({ partnerId, matchId, isConnected: !!partnerId }),

  setSearching: (val) => set({ isSearching: val }),
}));

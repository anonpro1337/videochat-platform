'use client';

import { supabase } from './supabase';
import { RealtimeChannel, REALTIME_SUBSCRIBE_STATES, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type EventHandler = (payload: any) => void;

interface ChannelSubscriptions {
  broadcast: Map<string, Set<EventHandler>>;
  presence: Set<EventHandler>;
  postgresChanges: Map<string, Set<(payload: RealtimePostgresChangesPayload<any>) => void>>;
  subscribed: boolean;
}

class RealtimeService {
  private channels: Map<string, { channel: RealtimeChannel; subs: ChannelSubscriptions }> = new Map();
  private currentUserId: string | null = null;

  setUserId(userId: string | null) {
    this.currentUserId = userId;
  }

  private getOrCreateChannel(channelName: string) {
    const existing = this.channels.get(channelName);
    if (existing) return existing;

    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: true },
        presence: { enabled: true },
      },
    });
    const subs: ChannelSubscriptions = {
      broadcast: new Map(),
      presence: new Set(),
      postgresChanges: new Map(),
      subscribed: false,
    };

    this.channels.set(channelName, { channel, subs });
    return { channel, subs };
  }

  private subscribe(channelName: string) {
    const entry = this.channels.get(channelName);
    if (!entry) return;

    entry.channel.subscribe(async (status) => {
      if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        entry.subs.subscribed = true;
        if (this.currentUserId) {
          await entry.channel.track({ userId: this.currentUserId, onlineAt: new Date().toISOString() });
        }
      }
    });
  }

  private unsubscribeIfEmpty(channelName: string) {
    const entry = this.channels.get(channelName);
    if (!entry) return;
    const { subs } = entry;
    const hasListeners =
      subs.broadcast.size > 0 ||
      subs.presence.size > 0 ||
      subs.postgresChanges.size > 0;
    if (!hasListeners) {
      entry.channel.unsubscribe();
      this.channels.delete(channelName);
    }
  }

  onBroadcast(channelName: string, event: string, handler: EventHandler) {
    const { channel, subs } = this.getOrCreateChannel(channelName);
    if (!subs.broadcast.has(event)) {
      subs.broadcast.set(event, new Set());
      channel.on('broadcast', { event }, (payload) => {
        const handlers = subs.broadcast.get(event);
        if (handlers) handlers.forEach((h) => h(payload));
      });
    }
    subs.broadcast.get(event)!.add(handler);
    this.subscribe(channelName);
    return () => {
      subs.broadcast.get(event)?.delete(handler);
      if (subs.broadcast.get(event)?.size === 0) {
        subs.broadcast.delete(event);
      }
      this.unsubscribeIfEmpty(channelName);
    };
  }

  onPresence(channelName: string, handler: EventHandler) {
    const { channel, subs } = this.getOrCreateChannel(channelName);
    if (subs.presence.size === 0) {
      channel.on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        handler(state);
      });
      channel.on('presence', { event: 'join' }, (payload) => {
        handler({ type: 'join', ...payload });
      });
      channel.on('presence', { event: 'leave' }, (payload) => {
        handler({ type: 'leave', ...payload });
      });
    }
    subs.presence.add(handler);
    this.subscribe(channelName);
    return () => {
      subs.presence.delete(handler);
      if (subs.presence.size === 0) this.unsubscribeIfEmpty(channelName);
    };
  }

  onPostgresChanges(
    channelName: string,
    table: string,
    handler: (payload: RealtimePostgresChangesPayload<any>) => void,
    filter?: string,
  ) {
    const { channel, subs } = this.getOrCreateChannel(channelName);
    const key = `${table}:${filter || '*'}`;
    if (!subs.postgresChanges.has(key)) {
      subs.postgresChanges.set(key, new Set());
      channel.on('postgres_changes', { event: '*', schema: 'public', table, filter }, (payload) => {
        const handlers = subs.postgresChanges.get(key);
        if (handlers) handlers.forEach((h) => h(payload));
      });
    }
    subs.postgresChanges.get(key)!.add(handler);
    this.subscribe(channelName);
    return () => {
      subs.postgresChanges.get(key)?.delete(handler);
      if (subs.postgresChanges.get(key)?.size === 0) subs.postgresChanges.delete(key);
      this.unsubscribeIfEmpty(channelName);
    };
  }

  async broadcast(channelName: string, event: string, payload: any) {
    const entry = this.channels.get(channelName);
    if (entry && entry.subs.subscribed) {
      await entry.channel.send({
        type: 'broadcast' as const,
        event,
        payload,
      });
    }
  }

  async trackPresence(channelName: string, payload: Record<string, any>) {
    const entry = this.channels.get(channelName);
    if (entry && entry.subs.subscribed) {
      await entry.channel.track(payload);
    }
  }

  async untrackPresence(channelName: string) {
    const entry = this.channels.get(channelName);
    if (entry && entry.subs.subscribed) {
      await entry.channel.untrack();
    }
  }

  cleanup() {
    for (const [, { channel }] of this.channels) {
      channel.unsubscribe();
    }
    this.channels.clear();
  }
}

export const realtime = new RealtimeService();

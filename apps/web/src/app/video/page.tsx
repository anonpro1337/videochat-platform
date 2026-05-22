'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, VideoCamera, Microphone, PhoneDisconnect,
  Hand, Smiley, Flag, Shield,
  Sparkle, GenderIntersex, Translate,
  DotsThree, Star
} from '@phosphor-icons/react';

const filters = ['All', '18-25', '25-35', '35+', 'Male', 'Female', 'LGBTQ+', 'Study', 'Gaming', 'Music'];

const regions = [
  { name: 'Global', flag: '🌍' },
  { name: 'US', flag: '🇺🇸' },
  { name: 'Europe', flag: '🇪🇺' },
  { name: 'Asia', flag: '🌏' },
  { name: 'LatAm', flag: '🌎' },
];

const sidebarUsers = [
  { name: 'Alex', age: 24, country: 'US', avatar: 'A', status: 'online' as const, interest: 'Gaming' },
  { name: 'Maya', age: 22, country: 'UK', avatar: 'M', status: 'online' as const, interest: 'Music' },
  { name: 'Kai', age: 27, country: 'JP', avatar: 'K', status: 'idle' as const, interest: 'Travel' },
  { name: 'Emma', age: 21, country: 'CA', avatar: 'E', status: 'online' as const, interest: 'Art' },
];

export default function VideoPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeRegion, setActiveRegion] = useState('Global');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (localVideoRef.current && !isCamOff) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
          }
          streamRef.current = stream;
          localVideoRef.current!.srcObject = stream;
        })
        .catch(() => {});
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [isCamOff]);

  const toggleConnection = () => setIsConnected(!isConnected);

  return (
    <div className="min-h-screen pt-16 md:pt-16 pb-16 md:pb-0 flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row gap-3 p-3 max-w-[1600px] mx-auto w-full">
        {/* Main Area */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Video Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Local Video */}
            <div className="video-container bg-gradient-to-br from-bg-card to-bg-secondary relative group">
              {!isCamOff ? (
                <video ref={localVideoRef} autoPlay muted playsInline className="scale-x-[-1]" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary/30">
                    Y
                  </div>
                </div>
              )}
              <div className="absolute bottom-3 left-3 glass px-3 py-1 rounded-lg text-xs font-medium">
                You {isMuted && <span className="text-destructive">(Muted)</span>}
              </div>
            </div>

            {/* Remote Video Placeholder */}
            <div className="video-container bg-gradient-to-br from-bg-card to-bg-secondary relative">
              {isConnected ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-bg-card to-purple-500/5 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-2xl font-bold shadow-lg shadow-pink-500/30 animate-pulse-glow">
                      S
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="font-semibold">Sarah, 23</p>
                      <p className="text-xs text-text-secondary">United States • Music</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Users className="w-10 h-10 text-text-muted" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-1">Looking for someone?</p>
                    <p className="text-sm text-text-muted">Tap the button below to start matching</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {regions.map(r => (
              <button
                key={r.name}
                onClick={() => setActiveRegion(r.name)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeRegion === r.name
                    ? 'bg-primary/20 text-primary-light border border-primary/30'
                    : 'glass hover:bg-white/10 text-text-secondary'
                }`}
              >
                <span>{r.flag}</span>
                {r.name}
              </button>
            ))}
            <div className="w-px h-5 bg-border" />
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeFilter === f
                    ? 'bg-primary/20 text-primary-light border border-primary/30'
                    : 'glass hover:bg-white/10 text-text-secondary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Connection Controls */}
          <div className="glass rounded-2xl p-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isMuted ? 'bg-destructive/20 text-destructive' : 'bg-white/10 text-text-secondary hover:bg-white/15'
              }`}
            >
              <Microphone className="w-5 h-5" weight={isMuted ? 'fill' : 'regular'} />
            </button>

            <button
              onClick={() => setIsCamOff(!isCamOff)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isCamOff ? 'bg-destructive/20 text-destructive' : 'bg-white/10 text-text-secondary hover:bg-white/15'
              }`}
            >
              <VideoCamera className="w-5 h-5" weight={isCamOff ? 'fill' : 'regular'} />
            </button>

            <button
              onClick={toggleConnection}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                isConnected
                  ? 'bg-destructive hover:bg-destructive-dark shadow-lg shadow-destructive/25'
                  : 'bg-gradient-to-br from-primary to-purple-500 hover:shadow-lg hover:shadow-primary/30'
              }`}
            >
              {isConnected ? (
                <PhoneDisconnect className="w-6 h-6 text-white" weight="fill" />
              ) : (
                <Sparkle className="w-6 h-6 text-white" weight="fill" />
              )}
            </button>

            <button
              className="w-12 h-12 rounded-xl bg-white/10 text-text-secondary hover:bg-white/15 flex items-center justify-center transition-all"
            >
              <Smiley className="w-5 h-5" />
            </button>

            <button
              className="w-12 h-12 rounded-xl bg-white/10 text-text-secondary hover:bg-white/15 flex items-center justify-center transition-all"
            >
              <Hand className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full md:w-72 flex-shrink-0 flex flex-col gap-3"
            >
              {/* Online Users */}
              <div className="glass-card-static p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary-light" weight="fill" />
                    Online Now
                  </h3>
                  <span className="text-xs text-text-muted bg-white/5 px-2 py-0.5 rounded-md">247</span>
                </div>
                <div className="space-y-2">
                  {sidebarUsers.map(u => (
                    <div key={u.name} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer">
                      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-xs font-bold">
                        {u.avatar}
                        <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-bg-primary ${
                          u.status === 'online' ? 'bg-secondary' : 'bg-text-muted'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.name}, {u.age}</p>
                        <p className="text-[10px] text-text-muted truncate">{u.country} • {u.interest}</p>
                      </div>
                      <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-primary/20 text-text-muted hover:text-primary-light flex items-center justify-center transition-all flex-shrink-0">
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card-static p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-primary-light" weight="fill" />
                  Safety Tools
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-text-secondary transition-all">
                    <Flag className="w-3.5 h-3.5 text-destructive" weight="fill" />
                    Report
                  </button>
                  <button className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-text-secondary transition-all">
                    <Translate className="w-3.5 h-3.5 text-primary-light" />
                    Translate
                  </button>
                  <button className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-text-secondary transition-all">
                    <GenderIntersex className="w-3.5 h-3.5 text-pink-400" />
                    Gender
                  </button>
                  <button className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-text-secondary transition-all">
                    <DotsThree className="w-3.5 h-3.5" />
                    More
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

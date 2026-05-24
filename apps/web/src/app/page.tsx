'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import {
  Sparkle, Video, ChatCircle, Globe, Shield, Lightning, Users,
  ArrowRight, Compass, MagicWand, Heart, Star, Camera,
  MusicNote, HandWaving, ChatTeardropDots, GameController
} from '@phosphor-icons/react';

const features = [
  { icon: Video, title: 'Random Video Chat', desc: 'Meet people instantly through HD video calls with ultra-low latency', color: 'from-purple-500/20 to-pink-500/20' },
  { icon: ChatCircle, title: 'Smart Text Chat', desc: 'Real-time messaging with AI translation in 50+ languages', color: 'from-blue-500/20 to-cyan-500/20' },
  { icon: MagicWand, title: 'AI Matching', desc: 'Smart algorithm finds your perfect conversation partner', color: 'from-emerald-500/20 to-teal-500/20' },
  { icon: Shield, title: 'AI Safety First', desc: 'Real-time moderation keeps conversations respectful and safe', color: 'from-orange-500/20 to-red-500/20' },
  { icon: Globe, title: 'Global Community', desc: 'Connect with millions across 190+ countries worldwide', color: 'from-indigo-500/20 to-purple-500/20' },
  { icon: Lightning, title: 'Blazing Fast', desc: 'Powered by WebRTC with sub-100ms lag for smooth conversations', color: 'from-yellow-500/20 to-orange-500/20' },
];

const stats = [
  { value: '2M+', label: 'Active Users', icon: Users },
  { value: '50M+', label: 'Matches Made', icon: Sparkle },
  { value: '190+', label: 'Countries', icon: Globe },
  { value: '99.9%', label: 'Uptime', icon: Lightning },
];

const floatingIcons = [
  { icon: ChatTeardropDots, x: '10%', y: '20%', delay: 0, size: 24, color: 'text-purple-400/30' },
  { icon: Heart, x: '85%', y: '15%', delay: 0.5, size: 20, color: 'text-pink-400/30' },
  { icon: Star, x: '75%', y: '70%', delay: 1, size: 18, color: 'text-yellow-400/30' },
  { icon: Camera, x: '15%', y: '75%', delay: 1.5, size: 22, color: 'text-blue-400/30' },
  { icon: MusicNote, x: '90%', y: '45%', delay: 2, size: 20, color: 'text-green-400/30' },
  { icon: HandWaving, x: '5%', y: '50%', delay: 2.5, size: 28, color: 'text-orange-400/30' },
  { icon: GameController, x: '50%', y: '5%', delay: 3, size: 22, color: 'text-cyan-400/30' },
  { icon: Globe, x: '50%', y: '92%', delay: 3.5, size: 20, color: 'text-indigo-400/30' },
];

export default function HomePage() {
  const { isAuthenticated, guestLogin } = useAuthStore();
  const [guestLoading, setGuestLoading] = useState(false);
  const [liveUsers, setLiveUsers] = useState(2847);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => prev + Math.floor(Math.random() * 10) - 3);
    }, 3000);
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  const handleGuest = async () => {
    setGuestLoading(true);
    await guestLogin();
    setGuestLoading(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center px-5 pt-20 pb-16 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-br from-purple-600/10 via-pink-600/8 to-blue-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse"
          style={{ animationDuration: '6s' }}
        />

        {/* Floating icons */}
        {floatingIcons.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              className={`absolute pointer-events-none ${item.color}`}
              style={{ left: item.x, top: item.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
              transition={{
                opacity: { delay: item.delay, duration: 1 },
                scale: { delay: item.delay, duration: 1 },
                y: { delay: item.delay, duration: 3 + item.delay, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              <Icon size={item.size} weight="fill" />
            </motion.div>
          );
        })}

        {/* Live users badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-green-500/20 bg-green-500/5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs font-medium text-green-400">
              <span className="tabular-nums">{liveUsers.toLocaleString()}</span> people online now
            </span>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          className="max-w-5xl mx-auto text-center relative z-10 w-full"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-sm text-primary-light mb-6"
          >
            <Sparkle className="w-4 h-4" weight="fill" />
            <span>AI-Powered Social Discovery</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 leading-[1.05] tracking-tight"
          >
            Find Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Vibe
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Connect with people who match your energy. Video chat, text, and share moments
            with a global community — intelligently matched by AI.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 flex-wrap mb-10"
          >
            {isAuthenticated ? (
              <Link
                href="/video"
                className="btn-gradient px-8 py-4 text-lg gap-3 rounded-2xl"
              >
                Start Chatting <Video className="w-5 h-5" weight="fill" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="btn-gradient px-8 py-4 text-lg gap-3 rounded-2xl shadow-lg shadow-purple-500/25"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleGuest}
                  disabled={guestLoading}
                  className="btn-ghost px-8 py-4 text-lg rounded-2xl gap-3 border border-border hover:border-border-hover"
                >
                  {guestLoading ? (
                    <span className="w-5 h-5 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Try as Guest <Compass className="w-5 h-5" /></>
                  )}
                </button>
              </>
            )}
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 sm:gap-10 text-sm text-text-muted"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-card border-2 border-background flex items-center justify-center text-[10px] font-bold text-text-secondary">
                +
              </div>
            </div>
            <span>Joined by <span className="text-text-primary font-semibold">50,000+</span> people this week</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-text-muted uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-4 h-6 rounded-full border border-border flex items-start justify-center pt-1"
          >
            <div className="w-1 h-1.5 rounded-full bg-text-muted" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-5 py-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-static p-5 text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon className="w-5 h-5 text-primary-light mx-auto mb-2" weight="fill" />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Everything You Need
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-text-secondary max-w-lg mx-auto"
          >
            From random connections to lasting friendships — all in one seamless platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6 hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all" />
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-primary-light" weight="fill" />
                </div>
                <h3 className="font-semibold text-base mb-1.5">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card-static p-10 md:p-16 relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 via-transparent to-pink-500/3 pointer-events-none" />

          <Sparkle className="w-10 h-10 text-primary-light mx-auto mb-6" weight="fill" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Connect?</h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Join millions of users already connecting, chatting, and sharing moments worldwide.
          </p>
          <Link
            href={isAuthenticated ? '/video' : '/auth'}
            className="btn-gradient px-8 py-4 text-lg gap-3 rounded-2xl inline-flex shadow-lg shadow-purple-500/25"
          >
            {isAuthenticated ? 'Start Video Chat' : 'Create Free Account'}
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-text-muted mb-4">Also available on</p>
            <div className="flex items-center justify-center gap-4">
              {['App Store', 'Google Play'].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all border border-border"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-text-primary" fill="currentColor">
                    <path d={name === 'App Store'
                      ? 'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z'
                      : 'M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z'}
                    />
                  </svg>
                  <span className="text-xs font-medium text-text-secondary">{name}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkle className="w-4 h-4 text-white" weight="fill" />
              </div>
              <span className="text-base font-bold gradient-text">ChatVibe</span>
            </div>
            <div className="flex items-center gap-3">
              {['App Store', 'Google Play'].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass hover:bg-white/10 transition-all border border-border"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-text-primary" fill="currentColor">
                    <path d={name === 'App Store'
                      ? 'M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z'
                      : 'M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z'}
                    />
                  </svg>
                  <span className="text-xs font-medium text-text-secondary">{name}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <p className="text-xs text-text-muted">&copy; 2026 ChatVibe. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-text-muted hover:text-text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="text-xs text-text-muted hover:text-text-primary transition-colors">Terms</Link>
              <Link href="/safety" className="text-xs text-text-muted hover:text-text-primary transition-colors">Safety</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

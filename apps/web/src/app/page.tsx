'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import {
  Sparkle, Video, ChatCircle, Globe, Shield, Lightning, Users,
  CaretRight, ArrowRight, Compass
} from '@phosphor-icons/react';

const features = [
  { icon: Video, title: 'Random Video Chat', desc: 'Meet people instantly through HD video calls with ultra-low latency' },
  { icon: ChatCircle, title: 'Smart Text Chat', desc: 'Real-time messaging with AI translation in 50+ languages' },
  { icon: Sparkle, title: 'AI Matching', desc: 'Smart algorithm finds your perfect conversation partner' },
  { icon: Shield, title: 'AI Safety First', desc: 'Real-time moderation keeps conversations respectful and safe' },
  { icon: Globe, title: 'Global Community', desc: 'Connect with millions across 190+ countries worldwide' },
  { icon: Lightning, title: 'Blazing Fast', desc: 'Powered by WebRTC with sub-100ms lag for smooth conversations' },
];

const stats = [
  { value: '2M+', label: 'Active Users', icon: Users },
  { value: '50M+', label: 'Matches Made', icon: Sparkle },
  { value: '190+', label: 'Countries', icon: Globe },
  { value: '99.9%', label: 'Uptime', icon: Lightning },
];

export default function HomePage() {
  const { isAuthenticated, guestLogin } = useAuthStore();
  const [guestLoading, setGuestLoading] = useState(false);

  const handleGuest = async () => {
    setGuestLoading(true);
    await guestLogin();
    setGuestLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden px-5 pt-24 pb-32 md:pt-32 md:pb-40">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/4 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-sm text-primary-light mb-6"
          >
            <Sparkle className="w-4 h-4" weight="fill" />
            <span>Now with AI-Powered Matching</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight"
          >
            Connect
            <br />
            <span className="gradient-text">Beyond Borders</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Experience the next generation of social discovery. Meet people through
            random video chat, text, and livestreams — intelligently matched by AI.
          </motion.p>

          {/* App Store Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-center gap-4 flex-wrap mb-8"
          >
            <a
              href="#"
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl glass hover:bg-white/10 transition-all border border-border hover:border-border-hover group"
              aria-label="Download on the App Store"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-text-primary" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <div className="text-left">
                <p className="text-[10px] text-text-muted leading-tight">Download on the</p>
                <p className="text-sm font-semibold text-text-primary leading-tight">App Store</p>
              </div>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl glass hover:bg-white/10 transition-all border border-border hover:border-border-hover group"
              aria-label="Get it on Google Play"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-text-primary" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
              </svg>
              <div className="text-left">
                <p className="text-[10px] text-text-muted leading-tight">Get it on</p>
                <p className="text-sm font-semibold text-text-primary leading-tight">Google Play</p>
              </div>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 flex-wrap"
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
                  className="btn-gradient px-8 py-4 text-lg gap-3 rounded-2xl"
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleGuest}
                  disabled={guestLoading}
                  className="btn-ghost px-8 py-4 text-lg rounded-2xl gap-3"
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

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass-card-static p-4 text-center">
                  <Icon className="w-5 h-5 text-primary-light mx-auto mb-2" weight="fill" />
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-xs text-text-muted">{s.label}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="px-5 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
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
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-purple-500/30 transition-all">
                  <Icon className="w-5 h-5 text-primary-light" weight="fill" />
                </div>
                <h3 className="font-semibold text-base mb-1.5">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="px-5 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass-card-static p-10 md:p-16 relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />

          <Sparkle className="w-10 h-10 text-primary-light mx-auto mb-6" weight="fill" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Connect?</h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Join millions of users already connecting, chatting, and sharing moments worldwide.
          </p>
          <Link
            href={isAuthenticated ? '/video' : '/auth'}
            className="btn-gradient px-8 py-4 text-lg gap-3 rounded-2xl inline-flex"
          >
            {isAuthenticated ? 'Start Video Chat' : 'Create Free Account'}
            <CaretRight className="w-5 h-5" />
          </Link>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-text-muted mb-4">Also available on</p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="#"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all border border-border"
                aria-label="Download on the App Store"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-text-primary" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-xs font-medium text-text-secondary">App Store</span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all border border-border"
                aria-label="Get it on Google Play"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-text-primary" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                <span className="text-xs font-medium text-text-secondary">Google Play</span>
              </a>
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
              <a
                href="#"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass hover:bg-white/10 transition-all border border-border"
                aria-label="Download on the App Store"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-text-primary" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-xs font-medium text-text-secondary">App Store</span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass hover:bg-white/10 transition-all border border-border"
                aria-label="Get it on Google Play"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-text-primary" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                <span className="text-xs font-medium text-text-secondary">Google Play</span>
              </a>
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

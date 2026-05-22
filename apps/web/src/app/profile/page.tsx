'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocaleStore } from '@/store/locale-store';
import { locales } from '@/lib/i18n/config';
import {
  User, Gear, Shield, CreditCard, Bell, SignOut,
  Coin, Heart, Star, ChatCircle, Video, Trophy,
  CaretRight, Question, Info, Check,
  MagicWand, Translate
} from '@phosphor-icons/react';

const menuItems = [
  { icon: Gear, label: 'settings', color: 'text-text-secondary' },
  { icon: Shield, label: 'privacyAndSafety', color: 'text-text-secondary' },
  { icon: Bell, label: 'notifications', color: 'text-text-secondary' },
  { icon: CreditCard, label: 'premium', color: 'text-yellow-400', badge: 'New' },
  { icon: Translate, label: 'language', color: 'text-text-secondary', dynamic: true },
  { icon: Info, label: 'about', color: 'text-text-secondary' },
  { icon: Question, label: 'helpAndSupport', color: 'text-text-secondary' },
];

const statsData = [
  { icon: Video, label: 'Calls', value: '47', gradient: 'from-primary to-purple-500' },
  { icon: ChatCircle, label: 'Messages', value: '1.2K', gradient: 'from-blue-500 to-cyan-500' },
  { icon: Heart, label: 'Matches', value: '28', gradient: 'from-pink-500 to-red-500' },
  { icon: Star, label: 'Rating', value: '4.9', gradient: 'from-yellow-500 to-orange-500' },
];

const achievements = [
  { icon: '🔥', name: 'Streak Master', desc: '7-day streak', progress: 70 },
  { icon: '🎤', name: 'Chat King', desc: '100 conversations', progress: 45 },
  { icon: '🌍', name: 'Globe Trotter', desc: '10 countries', progress: 30 },
  { icon: '💎', name: 'Social Butterfly', desc: '50 matches', progress: 56 },
];

export default function ProfilePage() {
  const { locale, t } = useLocaleStore();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const currentLang = locales.find(l => l.code === locale);

  return (
    <div className="min-h-screen pt-16 md:pt-16 pb-16 md:pb-0">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-static p-6 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent pointer-events-none" />

          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-3xl font-bold mx-auto shadow-xl shadow-primary/30">
              U
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/30">
              <MagicWand className="w-4 h-4 text-white" weight="fill" />
            </div>
          </div>

          <h1 className="text-2xl font-bold">User</h1>
          <p className="text-text-secondary text-sm">22 • United States</p>

          {/* Bio */}
          <p className="text-sm text-text-secondary mt-3 max-w-sm mx-auto leading-relaxed">
            Music lover &amp; gamer. Looking for cool people to vibe with. ✨
          </p>

          {/* Coins */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <Coin className="w-5 h-5 text-yellow-400" weight="fill" />
            <span className="text-sm font-bold text-yellow-300">250 {t('profile.coins')}</span>
            <button className="text-[10px] text-yellow-400 hover:underline ml-1">{t('profile.topUp')}</button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statsData.map(s => (
            <motion.div
              key={s.label}
              whileHover={{ y: -2 }}
              className="glass-card p-4 text-center"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mx-auto mb-2`}>
                <s.icon className="w-5 h-5 text-white" weight="fill" />
              </div>
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[10px] text-text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <div className="glass-card-static p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" weight="fill" />
              {t('profile.achievements')}
            </h2>
            <button className="text-xs text-primary-light hover:underline">{t('common.viewAll')}</button>
          </div>
          <div className="space-y-3">
            {achievements.map(a => (
              <div key={a.name} className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{a.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{a.name}</p>
                    <span className="text-[10px] text-text-muted">{a.desc}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all"
                      style={{ width: `${a.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="glass-card-static divide-y divide-border overflow-hidden rounded-2xl">
          {menuItems.map(item => {
            const Icon = item.icon;
            const label = item.dynamic ? t('profile.language') : t(`profile.${item.label}`);
            return (
              <button
                key={item.label}
                onClick={item.dynamic ? () => setShowLangPicker(!showLangPicker) : undefined}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/5 transition-all text-left"
              >
                <Icon className={`w-5 h-5 ${item.color}`} weight={item.badge ? 'fill' : 'regular'} />
                <span className="text-sm flex-1">{label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-primary/20 text-primary-light font-semibold">{t('profile.new')}</span>
                )}
                {item.dynamic && currentLang && (
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    {currentLang.flag} {currentLang.name}
                  </span>
                )}
                <CaretRight className={`w-4 h-4 text-text-muted transition-transform ${showLangPicker && item.dynamic ? 'rotate-90' : ''}`} weight="bold" />
              </button>
            );
          })}
          {showLangPicker && (
            <div className="px-5 py-4 border-t border-border bg-white/[0.02]">
              <p className="text-xs font-medium text-text-muted mb-3">{t('profile.language')}</p>
              <div className="grid grid-cols-1 gap-1">
                {locales.map((l) => {
                  const isActive = locale === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => useLocaleStore.getState().setLocale(l.code)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                        isActive
                          ? 'bg-primary/15 text-primary-light font-medium'
                          : 'hover:bg-white/5 text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <span className="text-base leading-none">{l.flag}</span>
                      <span className="flex-1">{l.nativeName}</span>
                      <span className="text-[10px] text-text-muted">{l.name}</span>
                      {isActive && <Check className="w-4 h-4 text-primary-light" weight="bold" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button className="w-full py-3.5 rounded-2xl border border-destructive/20 text-destructive hover:bg-destructive/10 text-sm font-medium transition-all flex items-center justify-center gap-2">
          <SignOut className="w-4 h-4" />
          {t('profile.signOut')}
        </button>

        <p className="text-center text-[10px] text-text-muted pb-4">{t('profile.version')}</p>
      </div>
    </div>
  );
}

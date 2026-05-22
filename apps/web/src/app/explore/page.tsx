'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass, Fire, Star, Trophy, Users, Sparkle,
  MagicWand, GameController, MusicNote, Palette,
  Globe, ChatCircle, Video, MagnifyingGlass, CaretRight
} from '@phosphor-icons/react';

const categories = [
  { name: 'Trending', icon: Fire, color: 'from-orange-500 to-red-500' },
  { name: 'Gaming', icon: GameController, color: 'from-purple-500 to-blue-500' },
  { name: 'Music', icon: MusicNote, color: 'from-pink-500 to-purple-500' },
  { name: 'Art', icon: Palette, color: 'from-yellow-500 to-pink-500' },
  { name: 'Study', icon: Trophy, color: 'from-green-500 to-emerald-500' },
  { name: 'Travel', icon: Globe, color: 'from-blue-500 to-cyan-500' },
];

const trendingUsers = [
  { name: 'Luna Star', age: 22, country: 'US', tags: ['Music', 'Dance'], viewers: '2.3K', avatar: 'L', gradient: 'from-pink-500 to-purple-500', online: true },
  { name: 'Kai Zen', age: 25, country: 'JP', tags: ['Gaming', 'Tech'], viewers: '1.8K', avatar: 'K', gradient: 'from-blue-500 to-cyan-500', online: true },
  { name: 'Maya Ray', age: 21, country: 'UK', tags: ['Art', 'Design'], viewers: '1.2K', avatar: 'M', gradient: 'from-yellow-500 to-pink-500', online: false },
  { name: 'Alex Neo', age: 24, country: 'DE', tags: ['Fitness', 'Travel'], viewers: '980', avatar: 'A', gradient: 'from-green-500 to-emerald-500', online: true },
  { name: 'Soul', age: 23, country: 'BR', tags: ['Music', 'Dance'], viewers: '750', avatar: 'S', gradient: 'from-purple-500 to-blue-500', online: true },
  { name: 'Nova', age: 20, country: 'CA', tags: ['Gaming', 'Music'], viewers: '620', avatar: 'N', gradient: 'from-orange-500 to-red-500', online: false },
];

const communities = [
  { name: 'K-Pop Lovers', members: '45K', icon: '🎵' },
  { name: 'Valorant Squad', members: '32K', icon: '🎮' },
  { name: 'Study Buddies', members: '28K', icon: '📚' },
  { name: 'Digital Art', members: '22K', icon: '🎨' },
  { name: 'Travel Vibes', members: '18K', icon: '✈️' },
  { name: 'Fitness Freaks', members: '15K', icon: '💪' },
];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Trending');

  return (
    <div className="min-h-screen pt-16 md:pt-16 pb-16 md:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Compass className="text-primary-light" weight="fill" />
            Explore
          </h1>
          <p className="text-text-secondary text-sm mt-1">Discover new people and communities</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Search people, interests, communities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-glass w-full pl-12 pr-4 py-3.5 text-base rounded-2xl"
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`glass-card p-4 flex flex-col items-center gap-2 hover:scale-[1.03] transition-all ${
                  isActive ? 'border-primary/40' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" weight="fill" />
                </div>
                <span className="text-xs font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Trending People */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Fire className="w-5 h-5 text-orange-400" weight="fill" />
              Trending Now
            </h2>
            <button className="text-xs text-primary-light hover:underline flex items-center gap-1">
              View All <CaretRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {trendingUsers.map(u => (
              <motion.div
                key={u.name}
                whileHover={{ y: -4 }}
                className="glass-card p-4 text-center relative overflow-hidden group cursor-pointer"
              >
                <div className="relative inline-block mb-3">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${u.gradient} flex items-center justify-center text-xl font-bold mx-auto shadow-lg`}>
                    {u.avatar}
                  </div>
                  {u.online && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-secondary border-2 border-bg-primary" />
                  )}
                  {u.viewers && (
                    <div className="absolute -bottom-1 -left-1 glass px-1.5 py-0.5 rounded-md text-[9px] font-medium flex items-center gap-0.5">
                      <Users className="w-2.5 h-2.5" weight="fill" /> {u.viewers}
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold">{u.name}</p>
                <p className="text-[10px] text-text-muted">{u.age} • {u.country}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {u.tags.map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 text-text-muted">{t}</span>
                  ))}
                </div>
                <button className="mt-3 w-full py-2 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary-light text-xs font-medium transition-all">
                  Say Hi
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Communities */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" weight="fill" />
              Popular Communities
            </h2>
            <button className="text-xs text-primary-light hover:underline flex items-center gap-1">
              View All <CaretRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {communities.map(c => (
              <motion.div
                key={c.name}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-4 flex items-center gap-3 cursor-pointer"
              >
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-[10px] text-text-muted">{c.members} members</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Live Now */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Video className="w-5 h-5 text-red-400" weight="fill" />
              Live Now
            </h2>
            <span className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping-slow" />
              12 live streams
            </span>
          </div>
          <div className="glass-card p-6 text-center">
            <Sparkle className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="font-medium mb-1">Livestreams Coming Soon</p>
            <p className="text-xs text-text-muted">Go live and connect with your audience in real-time</p>
          </div>
        </section>
      </div>
    </div>
  );
}

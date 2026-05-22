'use client';
import { ShieldCheck, Flag, Lock, Eye, Users, Bell } from '@phosphor-icons/react';

const items = [
  { icon: ShieldCheck, title: 'AI Moderation', desc: 'Real-time AI detects toxic behavior, harassment, and explicit content automatically.' },
  { icon: Flag, title: 'Report System', desc: 'Report any user or message with one tap. Our moderation team reviews within minutes.' },
  { icon: Lock, title: 'Private Calls', desc: 'End-to-end encrypted video and text chats. We never record your conversations.' },
  { icon: Eye, title: 'Content Filtering', desc: 'Blur and filter options let you control what you see. Customize your comfort level.' },
  { icon: Users, title: 'Community Guidelines', desc: 'Clear rules enforced consistently. Our community is built on respect and kindness.' },
  { icon: Bell, title: 'Safety Notifications', desc: 'Get alerts when someone tries to share inappropriate content or behaves suspiciously.' },
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-emerald-500 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-7 h-7 text-white" weight="fill" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Your Safety is Our Priority</h1>
        <p className="text-text-secondary max-w-lg mx-auto">We use cutting-edge AI and human moderation to keep ChatVibe safe for everyone.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="glass-card p-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary-light" weight="fill" />
              </div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

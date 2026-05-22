'use client';
import Link from 'next/link';
import { Crown, Check, Sparkle, Video, ChartLine, Globe, Star, MusicNote, Shield, Lightning } from '@phosphor-icons/react';

const plans = [
  {
    name: 'Monthly',
    price: '₹999',
    period: '/month',
    features: ['No ads', 'Unlimited filters', 'HD video', 'Priority matching', 'Premium badge', 'Incognito mode', 'Unlimited reconnects', 'Match history'],
  },
  {
    name: 'Yearly',
    price: '₹6,999',
    period: '/year',
    popular: true,
    savings: 'Save 42%',
    features: ['Everything in Monthly', 'Premium-only rooms', 'Advanced country filters', 'Gender preference unlock', 'Early access features', 'Priority support'],
  },
];

const coins = [
  { amount: '100', price: '₹99', popular: false },
  { amount: '500', price: '₹399', popular: true },
  { amount: '1,000', price: '₹699', popular: false },
  { amount: '5,000', price: '₹2,499', popular: false },
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/30">
            <Crown className="w-7 h-7 text-white" weight="fill" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Go Premium</h1>
          <p className="text-text-secondary">Unlock the full ChatVibe experience</p>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {plans.map((plan) => (
            <div key={plan.name} className={`glass-card-static p-6 md:p-8 relative ${plan.popular ? 'border-primary/40' : ''}`}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-purple-500 text-xs font-semibold shadow-lg">
                  Most Popular
                </span>
              )}
              {plan.savings && (
                <span className="text-xs text-secondary font-medium mb-2 block">{plan.savings}</span>
              )}
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="mt-3 mb-5">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-text-muted text-sm">{plan.period}</span>
              </div>
              <Link
                href="/auth"
                className={`block w-full py-3 rounded-2xl text-center text-sm font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/25'
                    : 'glass hover:bg-white/10'
                }`}
              >
                Subscribe Now
              </Link>
              <div className="mt-5 space-y-2.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-secondary" weight="bold" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Coins */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold flex items-center justify-center gap-2">
            <Sparkle className="w-5 h-5 text-yellow-400" weight="fill" />
            Coin Packages
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {coins.map((c) => (
            <div key={c.amount} className={`glass-card p-5 text-center ${c.popular ? 'border-primary/30' : ''}`}>
              <p className="text-2xl font-bold">{c.amount}</p>
              <p className="text-xs text-text-muted mb-3">Coins</p>
              <p className="text-lg font-semibold text-primary-light">{c.price}</p>
              <button className="mt-3 w-full py-2 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary-light text-xs font-medium transition-all">
                Buy
              </button>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
          {[
            { icon: Video, label: 'HD Video' },
            { icon: ChartLine, label: 'Priority Queue' },
            { icon: Globe, label: 'All Filters' },
            { icon: Star, label: 'Premium Badge' },
            { icon: Shield, label: 'No Ads' },
            { icon: Lightning, label: 'Faster Matching' },
            { icon: MusicNote, label: 'Voice Rooms' },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="glass-card py-4 text-center">
                <Icon className="w-5 h-5 text-primary-light mx-auto mb-1" weight="fill" />
                <span className="text-xs font-medium">{f.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

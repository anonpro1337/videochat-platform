'use client';

import { useEffect, useState } from 'react';
import { useAdStore } from '@/store/ad-store';
import { X, PlayCircle, Coins } from '@phosphor-icons/react';

interface AdBannerProps {
  position?: 'top' | 'bottom';
}

export function AdBanner({ position = 'bottom' }: AdBannerProps) {
  const isPremium = useAdStore((s) => s.isPremium);
  const [dismissed, setDismissed] = useState(false);

  if (isPremium || dismissed) return null;

  return (
    <div
      className={`fixed left-0 right-0 z-40 ${position === 'top' ? 'top-16' : 'bottom-16 md:bottom-0'}`}
    >
      <div className="glass-strong mx-3 my-1 p-3 rounded-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
          <PlayCircle className="w-4 h-4 text-white" weight="fill" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">Sponsored</p>
          <p className="text-[10px] text-text-muted truncate">Meet new people — Download ChatVibe Now!</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center flex-shrink-0"
        >
          <X className="w-3 h-3 text-text-muted" />
        </button>
      </div>
    </div>
  );
}

interface InterstitialAdProps {
  onClose: () => void;
  onReward?: () => void;
}

export function InterstitialAd({ onClose, onReward }: InterstitialAdProps) {
  const { markInterstitialShown, markRewardedShown } = useAdStore();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    markInterstitialShown();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const handleRewarded = () => {
    markRewardedShown();
    onReward?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5">
      <div className="glass-card-static p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
          <PlayCircle className="w-8 h-8 text-white" weight="fill" />
        </div>
        <h3 className="text-lg font-bold mb-1">Sponsored Content</h3>
        <p className="text-sm text-text-muted mb-6">Support ChatVibe by watching this short ad</p>

        <div className="glass p-4 rounded-xl mb-4">
          <p className="text-xs text-text-secondary">Ad placeholder — AdMob / AdSense would render here</p>
        </div>

        <div className="flex gap-2">
          {onReward && (
            <button
              onClick={handleRewarded}
              disabled={countdown > 0}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Coins className="w-4 h-4" weight="fill" />
              Watch for Coins
            </button>
          )}
          <button
            onClick={onClose}
            disabled={countdown > 0}
            className="flex-1 py-3 rounded-xl glass hover:bg-white/10 text-sm font-medium disabled:opacity-50 transition-all"
          >
            {countdown > 0 ? `${countdown}s` : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface RewardedAdTriggerProps {
  onReward: () => void;
  label?: string;
  className?: string;
}

export function RewardedAdTrigger({ onReward, label = 'Watch Ad for Coins', className = '' }: RewardedAdTriggerProps) {
  const { canShowRewarded, markRewardedShown } = useAdStore();
  const [showAd, setShowAd] = useState(false);
  const available = canShowRewarded();

  const handleClick = () => {
    if (!available) return;
    setShowAd(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={!available}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-medium disabled:opacity-40 transition-all ${className}`}
      >
        <Coins className="w-4 h-4" weight="fill" />
        {label}
      </button>
      {showAd && (
        <InterstitialAd
          onClose={() => setShowAd(false)}
          onReward={() => {
            markRewardedShown();
            onReward();
          }}
        />
      )}
    </>
  );
}

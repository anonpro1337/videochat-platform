export { useAdStore } from '@/store/ad-store';
export { AdBanner, InterstitialAd, RewardedAdTrigger } from '@/components/ui/Ads';

export function useAdIntegration() {
  const initAds = () => {
    if (typeof window === 'undefined') return;
  };

  return { initAds };
}

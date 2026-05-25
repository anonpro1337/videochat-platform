'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/auth?error=oauth_failed');
        return;
      }

      const fallback = '/explore';
      navigator.mediaDevices?.enumerateDevices().then(devices => {
        const hasCamera = devices.some(d => d.kind === 'videoinput');
        router.push(hasCamera ? '/video' : '/chat');
      }).catch(() => router.push(fallback));
    };
    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    if (error) {
      router.push(`/auth?error=${encodeURIComponent(errorDescription || error)}`);
      return;
    }

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
  }, [router, searchParams]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <Suspense fallback={null}>
        <AuthCallbackInner />
      </Suspense>
    </div>
  );
}

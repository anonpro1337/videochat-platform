'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { getDeviceId } from '@/lib/device';

export default function AuthCallbackPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/auth?error=oauth_failed');
        return;
      }

      const supabaseToken = session.access_token;
      const email = session.user?.email || '';
      const deviceId = getDeviceId();

      try {
        const { data } = await api.post('/auth/login', { supabaseToken, email, deviceId });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        setUser(data.data.user);
        const fallback = '/explore';
        navigator.mediaDevices?.enumerateDevices().then(devices => {
          const hasCamera = devices.some(d => d.kind === 'videoinput');
          router.push(hasCamera ? '/video' : '/chat');
        }).catch(() => router.push(fallback));
      } catch {
        router.push('/auth?error=login_failed');
      }
    };
    handleCallback();
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

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
      const deviceId = localStorage.getItem('deviceId') || '';

      try {
        const { data } = await api.post('/auth/login', { supabaseToken, email, deviceId });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        setUser(data.data.user);
        router.push('/video');
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

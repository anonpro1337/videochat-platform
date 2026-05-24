'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth-store';
import { supabase } from '@/lib/supabase';
import {
  Envelope, Lock, User, Eye, EyeSlash, GoogleLogo,
  AppleLogo, GithubLogo, FacebookLogo, InstagramLogo,
  Sparkle, ArrowRight, CheckCircle
} from '@phosphor-icons/react';

export default function AuthPage() {
  const router = useRouter();
  const { register, login, guestLogin, isLoading, error } = useAuthStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [showPw, setShowPw] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const toggleMode = () => setMode(m => m === 'login' ? 'register' : 'login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(form.email, form.password);
    } else {
      await register(form.email, form.password, form.displayName);
    }
    const currentError = useAuthStore.getState().error;
    if (!currentError) router.push('/video');
  };

  const handleGuest = async () => {
    setGuestLoading(true);
    await guestLogin();
    setGuestLoading(false);
    const currentError = useAuthStore.getState().error;
    if (!currentError) router.push('/video');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-24 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card-static p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30"
            >
              <Sparkle className="w-7 h-7 text-white" weight="fill" />
            </motion.div>
            <h1 className="text-2xl font-bold">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {mode === 'login' ? 'Sign in to continue to ChatVibe' : 'Join the community today'}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl mb-5"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-medium text-text-secondary mb-1.5 block">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.displayName}
                    onChange={e => setForm({ ...form, displayName: e.target.value })}
                    className="input-glass w-full pl-10 pr-4 py-3 text-sm"
                    required={mode === 'register'}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Email</label>
              <div className="relative">
                <Envelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-glass w-full pl-10 pr-4 py-3 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-glass w-full pl-10 pr-10 py-3 text-sm"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                >
                  {showPw ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gradient w-full py-3.5 text-base rounded-2xl gap-2 mt-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <>Sign In</>
              ) : (
                <>Create Account</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {[
              { icon: GoogleLogo, label: 'Google', provider: 'google' as const },
              { icon: GithubLogo, label: 'GitHub', provider: 'github' as const },
              { icon: FacebookLogo, label: 'Facebook', provider: 'facebook' as const },
              { icon: InstagramLogo, label: 'Instagram', provider: 'instagram' as any },
              { icon: AppleLogo, label: 'Apple', provider: 'apple' as const },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  onClick={() => supabase.auth.signInWithOAuth({
                    provider: s.provider,
                    options: { redirectTo: `${window.location.origin}/auth/callback` }
                  })}
                  className="flex flex-col items-center gap-1 py-3 rounded-xl glass hover:bg-white/10 transition-all text-sm font-medium"
                  title={s.label}
                >
                  <Icon className="w-5 h-5" weight="fill" />
                  <span className="text-[10px] text-text-muted">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Guest */}
          <button
            onClick={handleGuest}
            disabled={guestLoading}
            className="w-full py-3 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-hover text-sm transition-all flex items-center justify-center gap-2"
          >
            {guestLoading ? (
              <span className="w-4 h-4 border-2 border-text-muted border-t-text-primary rounded-full animate-spin" />
            ) : (
              <>Continue as Guest <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          {/* Toggle */}
          <p className="text-center text-sm text-text-secondary mt-6">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary-light font-medium hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

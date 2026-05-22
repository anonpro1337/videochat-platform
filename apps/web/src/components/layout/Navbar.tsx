'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { useThemeStore } from '@/store/theme-store';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import {
  House, Video, ChatCircle, Compass, User, Sparkle, Coins, Bell, Sun, Moon
} from '@phosphor-icons/react';

const desktopNav = [
  { href: '/', label: 'Home', icon: House },
  { href: '/video', label: 'Video', icon: Video },
  { href: '/chat', label: 'Chat', icon: ChatCircle },
  { href: '/explore', label: 'Explore', icon: Compass },
];

const mobileNav = [
  ...desktopNav,
  { href: '/profile', label: 'Profile', icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();

  return (
    <>
      {/* Desktop Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border hidden md:block">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all">
              <Sparkle className="w-5 h-5 text-white" weight="fill" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">ChatVibe</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 bg-bg-secondary/50 p-1 rounded-2xl border border-border">
            {desktopNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/20 text-primary-light shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" weight={isActive ? 'fill' : 'regular'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-text-secondary" /> : <Moon className="w-4 h-4 text-text-secondary" />}
            </button>
            {isAuthenticated ? (
              <>
                <button className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all relative">
                  <Bell className="w-5 h-5 text-text-secondary" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-[9px] font-bold flex items-center justify-center">3</span>
                </button>
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 glass-strong px-3 py-1.5 rounded-xl hover:bg-white/[0.12] transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-xs font-bold shadow-sm">
                    {user?.displayName?.[0] || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium leading-tight">{user?.displayName || 'User'}</p>
                    <p className="text-[10px] text-text-muted leading-tight">{user?.coins || 0} coins</p>
                  </div>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-all shadow-lg shadow-primary/25"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2 pb-2">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-primary-light' : 'text-text-muted'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_6px_rgba(124,58,237,0.5)]' : ''}`} weight={isActive ? 'fill' : 'regular'} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ChartBar,
  Users,
  ShieldCheck,
  CurrencyDollar,
  Gear,
  SignOut,
  List,
  X,
  ChatCircleDots,
} from '@phosphor-icons/react';
import './globals.css';

const navItems = [
  { href: '/', label: 'Dashboard', icon: ChartBar },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/moderation', label: 'Moderation', icon: ShieldCheck },
  { href: '/revenue', label: 'Revenue', icon: CurrencyDollar },
  { href: '/settings', label: 'Settings', icon: Gear },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-bg-primary text-text-primary">
        <div className="flex h-screen overflow-hidden">
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-secondary/95 backdrop-blur-xl border-r border-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink flex items-center justify-center">
                <ChatCircleDots size={18} weight="fill" className="text-white" />
              </div>
              <span className="font-bold text-lg">Admin Panel</span>
            </div>

            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/15 text-primary-light border border-primary/20'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200">
                <SignOut size={20} />
                Logout
              </button>
            </div>
          </aside>

          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-16 border-b border-border bg-bg-secondary/50 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <List size={24} />
              </button>

              <div className="hidden lg:flex items-center gap-2">
                <span className="text-sm text-text-muted">Admin Dashboard</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-pink flex items-center justify-center text-xs font-bold">
                    A
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">Admin</p>
                    <p className="text-xs text-text-muted">Super Admin</p>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

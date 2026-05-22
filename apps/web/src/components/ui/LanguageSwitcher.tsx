'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocaleStore } from '@/store/locale-store';
import { locales } from '@/lib/i18n/config';
import { Check } from '@phosphor-icons/react';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocaleStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = locales.find(l => l.code === locale);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-sm"
        aria-label={t('profile.language')}
      >
        <span className="text-base leading-none">{current?.flag || '🌐'}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl border border-border overflow-hidden z-50 shadow-xl max-h-80 overflow-y-auto">
          <div className="p-1.5 space-y-0.5">
            {locales.map((l) => {
              const isActive = locale === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => {
                    setLocale(l.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                    isActive
                      ? 'bg-primary/15 text-primary-light font-medium'
                      : 'hover:bg-white/5 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="text-base leading-none">{l.flag}</span>
                  <span className="flex-1">{l.nativeName}</span>
                  <span className="text-[10px] text-text-muted">{l.name}</span>
                  {isActive && <Check className="w-4 h-4 text-primary-light" weight="bold" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import en from '@/lib/i18n/locales/en';
import hi from '@/lib/i18n/locales/hi';
import es from '@/lib/i18n/locales/es';
import fr from '@/lib/i18n/locales/fr';
import de from '@/lib/i18n/locales/de';
import ja from '@/lib/i18n/locales/ja';
import zh from '@/lib/i18n/locales/zh';
import ar from '@/lib/i18n/locales/ar';
import pt from '@/lib/i18n/locales/pt';
import ru from '@/lib/i18n/locales/ru';
import type { LocaleCode } from '@/lib/i18n/config';
import { defaultLocale } from '@/lib/i18n/config';
const translations: Record<string, Record<string, unknown>> = {
  en, hi, es, fr, de, ja, zh, ar, pt, ru,
};

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object' && Object.hasOwn(acc, part)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

interface LocaleState {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: defaultLocale,
      setLocale: (locale) => {
        set({ locale });
        const dir = locale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = locale;
      },
      t: (key, params) => {
        const { locale } = get();
        const current = translations[locale];
        const fallback = translations.en;
        let value =
          (getNestedValue(current, key) as string) ||
          (getNestedValue(fallback, key) as string) ||
          key;
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            value = value.replace(`{{${k}}}`, v);
          });
        }
        return value;
      },
    }),
    { name: 'chatvibe-locale' }
  )
);

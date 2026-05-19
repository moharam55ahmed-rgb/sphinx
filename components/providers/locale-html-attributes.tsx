'use client';

import { useEffect } from 'react';
import { localeDirection, type Locale } from '@/i18n/config';

export function LocaleHtmlAttributes({ locale }: { locale: string }) {
  useEffect(() => {
    const direction = localeDirection[locale as Locale] ?? 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    document.documentElement.classList.add('bg-background');
  }, [locale]);

  return null;
}

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { trackPageVisit } from '@/lib/public-api';

export function VisitTracker() {
  const pathname = usePathname();
  const locale = useLocale();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.includes('/admin')) return;

    const key = `${locale}:${pathname}`;
    if (lastTracked.current === key) return;
    lastTracked.current = key;

    const sessionKey = `visit:${key}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
      return;
    }

    trackPageVisit({
      path: pathname,
      locale,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    })
      .then(() => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(sessionKey, '1');
        }
      })
      .catch(() => {});
  }, [pathname, locale]);

  return null;
}

'use client';

import { useParams } from 'next/navigation';

export function useAdminLocale(): string {
  const params = useParams();
  return (params?.locale as string) || 'ar';
}

/** Prefix admin paths with current locale, e.g. `/admin/pages` → `/ar/admin/pages` */
export function useAdminPath() {
  const locale = useAdminLocale();
  return (path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `/${locale}${normalized}`;
  };
}

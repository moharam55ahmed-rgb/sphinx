'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSettings } from '@/lib/public-api';
import { useAdminPath } from '@/lib/admin-path';
import { useTranslations } from 'next-intl';

type AdminBrandProps = {
  compact?: boolean;
};

export function AdminBrand({ compact = false }: AdminBrandProps) {
  const adminPath = useAdminPath();
  const t = useTranslations('admin');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    getSettings()
      .then((settings) => {
        const url = settings?.logo?.url;
        if (url) setLogoUrl(url);
      })
      .catch(() => {});
  }, []);

  const src = logoUrl || '/favicon.svg';

  return (
    <Link href={adminPath('/admin')} className="flex items-center gap-3 min-w-0">
      <Image
        src={src}
        alt="SPHINX Admin"
        width={compact ? 40 : 160}
        height={compact ? 40 : 48}
        className={
          compact
            ? 'h-10 w-10 object-contain shrink-0'
            : 'h-11 w-auto max-w-[180px] object-contain object-left'
        }
        unoptimized
        priority
      />
      {!compact && (
        <span className="text-xs text-muted-foreground hidden xl:inline">
          {t('brandSubtitle')}
        </span>
      )}
    </Link>
  );
}

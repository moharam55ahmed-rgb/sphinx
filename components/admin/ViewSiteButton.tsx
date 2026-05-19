'use client';

import Link from 'next/link';
import { ExternalLink, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminLocale } from '@/lib/admin-path';
import { useTranslations } from 'next-intl';

export function ViewSiteButton({ className }: { className?: string }) {
  const locale = useAdminLocale();
  const t = useTranslations('admin');

  return (
    <Button asChild variant="default" className={className}>
      <Link href={`/${locale}`} target="_blank" rel="noopener noreferrer">
        <Globe className="w-4 h-4 me-2" />
        {t('viewWebsite')}
        <ExternalLink className="w-3.5 h-3.5 ms-2 opacity-80" />
      </Link>
    </Button>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import { VisitAnalyticsPanel } from '@/components/admin/VisitAnalyticsPanel';
import { ViewSiteButton } from '@/components/admin/ViewSiteButton';

export default function AdminAnalyticsPage() {
  const t = useTranslations('admin');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('analyticsPageTitle')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t('analyticsPageSubtitle')}
          </p>
        </div>
        <ViewSiteButton />
      </div>
      <VisitAnalyticsPanel />
    </div>
  );
}

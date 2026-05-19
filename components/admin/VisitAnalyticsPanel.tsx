'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export type AnalyticsData = {
  total: number;
  today: number;
  last7Days: number;
  last30Days: number;
  topPages: { path: string; count: number }[];
  dailyVisits: { date: string; count: number }[];
};

const emptyAnalytics: AnalyticsData = {
  total: 0,
  today: 0,
  last7Days: 0,
  last30Days: 0,
  topPages: [],
  dailyVisits: [],
};

export function VisitAnalyticsPanel() {
  const t = useTranslations('admin.analytics');
  const [analytics, setAnalytics] = useState<AnalyticsData>(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient
      .get('/analytics/stats')
      .then((res) => {
        if (res.data?.success) {
          setAnalytics(res.data.data);
          setError('');
        } else {
          setError(t('errorLoad'));
        }
      })
      .catch((err: any) => {
        const msg = err.response?.data?.message || '';
        const status = err.response?.status;
        if (
          status === 503 ||
          msg.includes('pageVisit') ||
          msg.includes('prisma generate') ||
          msg.includes('not ready')
        ) {
          setError(t('errorPrisma'));
        } else {
          setError(t('errorConnect'));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const maxDaily =
    analytics.dailyVisits.reduce((m, d) => Math.max(m, d.count), 0) || 1;

  const dailyRows = analytics.dailyVisits;

  return (
    <section className="space-y-4" id="visit-analytics">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Eye className="w-5 h-5 text-primary" />
        {t('title')}
      </h2>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title={t('today')} value={analytics.today} icon={Calendar} />
            <StatCard
              title={t('last7Days')}
              value={analytics.last7Days}
              icon={TrendingUp}
            />
            <StatCard
              title={t('last30Days')}
              value={analytics.last30Days}
              icon={Eye}
            />
            <StatCard title={t('allTime')} value={analytics.total} icon={Eye} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('chartTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyRows.length === 0 ? (
                  <p className="text-sm text-muted-foreground">—</p>
                ) : (
                  <div className="flex items-end gap-2 h-32">
                    {dailyRows.map((day) => (
                      <div
                        key={day.date}
                        className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                      >
                        <div
                          className="w-full bg-primary/80 rounded-t min-h-[4px]"
                          style={{
                            height: `${Math.max(8, (day.count / maxDaily) * 100)}%`,
                          }}
                          title={`${day.count}`}
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {day.date.slice(5)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('topPages')}</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.topPages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('noVisits')}</p>
                ) : (
                  <ul className="space-y-2">
                    {analytics.topPages.map((row) => (
                      <li
                        key={row.path}
                        className="flex justify-between gap-2 text-sm border-b border-border/50 pb-2 last:border-0"
                      >
                        <span className="truncate text-muted-foreground">
                          {row.path}
                        </span>
                        <span className="font-medium shrink-0">{row.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </section>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

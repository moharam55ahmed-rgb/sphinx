'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, Users, MessageSquare, BarChart3 } from 'lucide-react';
import { VisitAnalyticsPanel } from '@/components/admin/VisitAnalyticsPanel';
import { ViewSiteButton } from '@/components/admin/ViewSiteButton';
import Link from 'next/link';
import { useAdminPath } from '@/lib/admin-path';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const t = useTranslations('admin');
  const adminPath = useAdminPath();
  const [stats, setStats] = useState({
    pages: 0,
    projects: 0,
    users: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pages, projects, users, messages] = await Promise.all([
          apiClient.get('/pages').catch(() => ({ data: { data: [] } })),
          apiClient.get('/projects').catch(() => ({ data: { data: [] } })),
          apiClient.get('/users').catch(() => ({ data: { data: [] } })),
          apiClient.get('/contact-messages').catch(() => ({ data: { data: [] } })),
        ]);

        setStats({
          pages: pages.data.data.length || 0,
          projects: projects.data.data.length || 0,
          users: users.data.data.length || 0,
          messages: messages.data.data.length || 0,
        });
      } catch {
        setError(t('apiError'));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dashboardTitle')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('dashboardSubtitle')}</p>
        </div>
        <ViewSiteButton />
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <VisitAnalyticsPanel />

      <div className="flex justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href={adminPath('/admin/analytics')}>
            <BarChart3 className="w-4 h-4 me-2" />
            {t('fullAnalyticsPage')}
          </Link>
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t('contentSection')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t('totalPages')} value={stats.pages} icon={FileText} />
          <StatCard title={t('totalProjects')} value={stats.projects} icon={Briefcase} />
          <StatCard title={t('users')} value={stats.users} icon={Users} />
          <StatCard title={t('messages')} value={stats.messages} icon={MessageSquare} />
        </div>
      </section>
    </div>
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

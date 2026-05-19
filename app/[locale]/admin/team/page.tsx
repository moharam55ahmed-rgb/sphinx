'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { TeamMembersEditor } from '@/components/admin/TeamMembersEditor';
import { normalizeTeamMembers, type TeamMemberRecord } from '@/lib/team';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAdminPath } from '@/lib/admin-path';
import { ExternalLink } from 'lucide-react';

export default function AdminTeamPage() {
  const adminPath = useAdminPath();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations('admin');

  const [section, setSection] = useState<any>(null);
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const load = async () => {
      try {
        const pagesRes = await apiClient.get('/pages');
        const teamPage = (pagesRes.data.data || []).find(
          (p: { slug: string }) => p.slug === 'team'
        );
        if (!teamPage) {
          setLoading(false);
          return;
        }
        const sectionsRes = await apiClient.get(`/sections?pageId=${teamPage.id}`);
        const teamSection = (sectionsRes.data.data || []).find(
          (s: { sectionKey: string }) => s.sectionKey === 'team-members'
        );
        if (teamSection) {
          setSection(teamSection);
          setMembers(normalizeTeamMembers(teamSection.customData));
        }
      } catch {
        toast.error(isRtl ? 'تعذّر تحميل بيانات الفريق' : 'Failed to load team data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isRtl]);

  const handleSave = async () => {
    if (!section?.id) return;
    setSaving(true);
    try {
      await apiClient.put(`/sections/${section.id}`, {
        ...section,
        customData: members,
      });
      toast.success(isRtl ? 'تم حفظ فريق العمل' : 'Team saved successfully');
    } catch {
      toast.error(isRtl ? 'فشل الحفظ' : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">{t('loading')}</div>;
  }

  if (!section) {
    return (
      <div className="space-y-4 p-8 border border-dashed rounded-lg text-muted-foreground">
        <p>
          {isRtl
            ? 'لم يُعثر على قسم team-members. أنشئه من صفحة الصفحات.'
            : 'Team section not found. Create it from Pages → Team.'}
        </p>
        <Button asChild variant="outline">
          <Link href={adminPath('/admin/pages')}>{t('pages')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isRtl ? 'فريق العمل' : 'Team members'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isRtl
              ? 'البيانات تظهر في صفحة الفريق — اضغط على العضو لفتح التفاصيل.'
              : 'Shown on the public team page. Visitors click a member to open details.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/team`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className={cn('w-4 h-4', isRtl ? 'ml-2' : 'mr-2')} />
              {isRtl ? 'معاينة' : 'Preview'}
            </Link>
          </Button>
          <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
            <Button
              type="button"
              size="sm"
              variant={activeLang === 'en' ? 'secondary' : 'ghost'}
              onClick={() => setActiveLang('en')}
            >
              EN
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeLang === 'ar' ? 'secondary' : 'ghost'}
              onClick={() => setActiveLang('ar')}
            >
              AR
            </Button>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : isRtl ? 'حفظ' : 'Save'}
          </Button>
        </div>
      </div>

      <TeamMembersEditor
        members={members}
        onChange={setMembers}
        activeLang={activeLang}
        isRtl={isRtl}
      />
    </div>
  );
}

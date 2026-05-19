'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { RelatedCompaniesEditor } from '@/components/admin/RelatedCompaniesEditor';
import {
  normalizeRelatedCompanies,
  prepareCompaniesForEditor,
  findRelatedCompaniesSection,
  syncCompanyPages,
  type RelatedCompanyRecord,
} from '@/lib/related-companies';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAdminPath } from '@/lib/admin-path';
import { ExternalLink, Plus } from 'lucide-react';

export default function AdminRelatedCompaniesPage() {
  const adminPath = useAdminPath();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations('admin');

  const [section, setSection] = useState<any>(null);
  const [homePageId, setHomePageId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<RelatedCompanyRecord[]>([]);
  const [pages, setPages] = useState<Array<{ id: string; slug: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>(locale === 'ar' ? 'ar' : 'en');

  const load = async () => {
    try {
      const pagesRes = await apiClient.get('/pages');
      const allPages = pagesRes.data.data || [];
      setPages(allPages);

      const homePage = allPages.find((p: { slug: string }) => p.slug === 'home');
      if (!homePage) {
        setLoading(false);
        return;
      }
      setHomePageId(homePage.id);

      const sectionsRes = await apiClient.get(`/sections?pageId=${homePage.id}`);
      const homeSections = sectionsRes.data.data || [];
      const relatedSection = findRelatedCompaniesSection(homeSections);

      if (relatedSection) {
        setSection(relatedSection);
        setCompanies(
          prepareCompaniesForEditor(relatedSection.customData)
        );
      }
    } catch {
      toast.error(isRtl ? 'تعذّر تحميل الشركات' : 'Failed to load related companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isRtl]);

  const handleCreateSection = async () => {
    if (!homePageId) return;
    setCreating(true);
    try {
      const res = await apiClient.post('/sections', {
        pageId: homePageId,
        sectionKey: 'related-companies',
        sectionName: 'Related Companies',
        title: { en: 'Related Companies', ar: 'شركات ذات صلة' },
        subtitle: {
          en: 'Subsidiary companies of SPHINX Real Estate Development Group.',
          ar: 'شركات تابعة ومتفرعة من مجموعة سفنكس للتطوير العقاري.',
        },
        customData: [],
        sortOrder: 9,
        isActive: true,
      });
      setSection(res.data.data);
      setCompanies([]);
      toast.success(isRtl ? 'تم إنشاء القسم' : 'Section created');
    } catch {
      toast.error(isRtl ? 'فشل إنشاء القسم' : 'Failed to create section');
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    if (!section?.id) return;

    const valid = normalizeRelatedCompanies(companies);
    if (valid.length === 0) {
      toast.error(
        isRtl
          ? 'أضف شركة واحدة على الأقل (اسم + صورة)'
          : 'Add at least one company with a name'
      );
      return;
    }

    setSaving(true);
    try {
      const withPages = await syncCompanyPages(valid, apiClient);
      setCompanies(withPages);

      await apiClient.put(`/sections/${section.id}`, {
        ...section,
        sectionKey: 'related-companies',
        sectionName: 'Related Companies',
        title: { en: 'Related Companies', ar: 'شركات ذات صلة' },
        subtitle: {
          en: 'Subsidiary companies of SPHINX Real Estate Development Group.',
          ar: 'شركات تابعة ومتفرعة من مجموعة سفنكس للتطوير العقاري.',
        },
        customData: withPages,
        isActive: true,
      });

      toast.success(
        isRtl
          ? 'تم الحفظ وربط صفحات الشركات'
          : 'Saved — company pages created/linked'
      );
      await load();
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
      <div className="space-y-6 max-w-2xl p-8 border border-dashed rounded-xl" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className={cn('space-y-2', isRtl && 'text-right')}>
          <h1 className="text-2xl font-bold">{isRtl ? 'شركات ذات صلة' : 'Related companies'}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isRtl
              ? 'لا يوجد قسم على الرئيسية. اضغط الزر لإنشائه — بعدها كل شركة لها صفحة خاصة تلقائياً عند الحفظ.'
              : 'No section on home yet. Create it — each company gets its own page on save.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleCreateSection} disabled={creating || !homePageId}>
            <Plus className={cn('w-4 h-4', isRtl ? 'ml-2' : 'mr-2')} />
            {creating
              ? isRtl
                ? 'جاري الإنشاء...'
                : 'Creating...'
              : isRtl
                ? 'إنشاء القسم الآن'
                : 'Create section now'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className={cn(isRtl && 'text-right')}>
          <h1 className="text-3xl font-bold tracking-tight">
            {isRtl ? 'شركات ذات صلة' : 'Related companies'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isRtl
              ? 'احفظ هنا — يُنشأ لكل شركة صفحة تلقائياً (من قائمة الصفحات). اللوجو يظهر في الرئيسية والضغط يفتح صفحة الشركة.'
              : 'Save here — each company gets a page automatically. Logo on homepage links to company page.'}
          </p>
          {section.sectionKey !== 'related-companies' && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              {isRtl
                ? `تنبيه: مفتاح القسم "${section.sectionKey}" — سيُصحَّح تلقائياً إلى related-companies عند الحفظ.`
                : `Note: section key "${section.sectionKey}" will be fixed to related-companies on save.`}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${locale}`} target="_blank" rel="noopener noreferrer">
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
            {saving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : isRtl ? 'حفظ وربط الصفحات' : 'Save & link pages'}
          </Button>
        </div>
      </div>

      <RelatedCompaniesEditor
        companies={companies}
        onChange={setCompanies}
        activeLang={activeLang}
        isRtl={isRtl}
        pages={pages}
      />
    </div>
  );
}

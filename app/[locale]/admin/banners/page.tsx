'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ExternalLink, ImageIcon, Save } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { resolveMediaUrl } from '@/lib/media-url';
import {
  PAGE_BANNERS,
  buildNewBannerSection,
  type PageBannerConfig,
} from '@/lib/page-banners';
import { cn } from '@/lib/utils';

type PageRecord = { id: string; slug: string; title?: unknown };
type SectionRecord = {
  id: string;
  pageId: string;
  sectionKey: string;
  image?: string;
  backgroundImage?: string;
  [key: string]: unknown;
};

type BannerRow = {
  config: PageBannerConfig;
  page?: PageRecord;
  section?: SectionRecord;
  image: string;
};

export default function AdminPageBanners() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations('admin');
  const [rows, setRows] = useState<BannerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const pagesRes = await apiClient.get('/pages');
      const pages: PageRecord[] = pagesRes.data.data || [];
      const pageIds = [...new Set(PAGE_BANNERS.map((b) => b.pageSlug))];

      const sectionsByPage = new Map<string, SectionRecord[]>();
      await Promise.all(
        pageIds.map(async (slug) => {
          const page = pages.find((p) => p.slug === slug);
          if (!page) return;
          const res = await apiClient.get(`/sections?pageId=${page.id}`);
          sectionsByPage.set(page.id, res.data.data || []);
        })
      );

      setRows(
        PAGE_BANNERS.map((config) => {
          const page = pages.find((p) => p.slug === config.pageSlug);
          const sections = page ? sectionsByPage.get(page.id) || [] : [];
          const section = sections.find((s) => s.sectionKey === config.sectionKey);
          const image =
            section?.backgroundImage ||
            section?.image ||
            '';
          return { config, page, section, image };
        })
      );
    } catch {
      toast.error(isRtl ? 'تعذّر تحميل البانرات' : 'Failed to load banners');
    } finally {
      setLoading(false);
    }
  }, [isRtl]);

  useEffect(() => {
    load();
  }, [load]);

  const updateImage = (id: string, image: string) => {
    setRows((prev) =>
      prev.map((row) => (row.config.id === id ? { ...row, image } : row))
    );
  };

  const saveBanner = async (row: BannerRow) => {
    if (!row.page) {
      toast.error(
        isRtl
          ? `صفحة "${row.config.pageSlug}" غير موجودة — أنشئها من الصفحات أولاً`
          : `Page "${row.config.pageSlug}" not found — create it under Pages first`
      );
      return;
    }

    setSavingId(row.config.id);
    try {
      if (row.section?.id) {
        await apiClient.put(`/sections/${row.section.id}`, {
          image: row.image,
          backgroundImage: row.image,
        });
      } else {
        const res = await apiClient.post(
          '/sections',
          buildNewBannerSection(row.config, row.page.id, row.image)
        );
        setRows((prev) =>
          prev.map((r) =>
            r.config.id === row.config.id
              ? { ...r, section: res.data.data, image: row.image }
              : r
          )
        );
      }
      toast.success(isRtl ? 'تم حفظ البانر' : 'Banner saved');
    } catch {
      toast.error(isRtl ? 'فشل الحفظ' : 'Failed to save');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return <div className="p-8">{t('loading')}</div>;
  }

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className={cn(isRtl && 'text-right')}>
        <h1 className="text-3xl font-bold tracking-tight">{t('pageBanners')}</h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
          {t('pageBannersDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rows.map((row) => {
          const label = isRtl ? row.config.labelAr : row.config.labelEn;
          const previewUrl = `/${locale}${row.config.previewPath}`;

          return (
            <Card key={row.config.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
                <div className={cn(isRtl && 'text-right')}>
                  <CardTitle className="text-lg">{label}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {row.config.sectionKey}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={previewUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className={cn('w-4 h-4', isRtl ? 'ml-2' : 'mr-2')} />
                    {t('previewPage')}
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-[21/9] rounded-lg overflow-hidden bg-muted border">
                  {row.image ? (
                    <img
                      src={resolveMediaUrl(row.image)}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <ImageIcon className="w-10 h-10 opacity-40" />
                      <span className="text-xs">{t('noBannerImage')}</span>
                    </div>
                  )}
                </div>

                {!row.page && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    {isRtl
                      ? `الصفحة "${row.config.pageSlug}" غير موجودة`
                      : `Missing page: ${row.config.pageSlug}`}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  <MediaSelector
                    onSelect={(url) => updateImage(row.config.id, url)}
                    triggerText={row.image ? t('changeBanner') : t('selectBanner')}
                  />
                  <Button
                    onClick={() => saveBanner(row)}
                    disabled={!row.image || !row.page || savingId === row.config.id}
                  >
                    <Save className={cn('w-4 h-4', isRtl ? 'ml-2' : 'mr-2')} />
                    {savingId === row.config.id
                      ? isRtl
                        ? 'جاري الحفظ...'
                        : 'Saving...'
                      : t('saveBanner')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

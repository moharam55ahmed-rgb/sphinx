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

type SectionRecord = {
  id: string;
  pageId: string;
  sectionKey: string;
  image?: string;
  backgroundImage?: string;
};

type PageBannerEditorProps = {
  pageSlug: string;
  sectionKey: string;
  className?: string;
};

function findConfig(pageSlug: string, sectionKey: string): PageBannerConfig | undefined {
  return PAGE_BANNERS.find(
    (b) => b.pageSlug === pageSlug && b.sectionKey === sectionKey
  );
}

export function PageBannerEditor({
  pageSlug,
  sectionKey,
  className,
}: PageBannerEditorProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations('admin');
  const config = findConfig(pageSlug, sectionKey);

  const [pageId, setPageId] = useState<string | null>(null);
  const [section, setSection] = useState<SectionRecord | null>(null);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!config) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const pagesRes = await apiClient.get('/pages');
      const pages = pagesRes.data.data || [];
      const page = pages.find((p: { slug: string }) => p.slug === pageSlug);
      if (!page) {
        setPageId(null);
        setSection(null);
        setImage('');
        return;
      }
      setPageId(page.id);
      const sectionsRes = await apiClient.get(`/sections?pageId=${page.id}`);
      const sections = sectionsRes.data.data || [];
      const heroSection = sections.find(
        (s: { sectionKey: string }) => s.sectionKey === sectionKey
      );
      setSection(heroSection || null);
      setImage(heroSection?.backgroundImage || heroSection?.image || '');
    } catch {
      toast.error(isRtl ? 'تعذّر تحميل البانر' : 'Failed to load banner');
    } finally {
      setLoading(false);
    }
  }, [config, isRtl, pageSlug, sectionKey]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!config || !pageId || !image) return;
    setSaving(true);
    try {
      if (section?.id) {
        await apiClient.put(`/sections/${section.id}`, {
          image,
          backgroundImage: image,
        });
      } else {
        const res = await apiClient.post(
          '/sections',
          buildNewBannerSection(config, pageId, image)
        );
        setSection(res.data.data);
      }
      toast.success(isRtl ? 'تم حفظ البانر' : 'Banner saved');
    } catch {
      toast.error(isRtl ? 'فشل حفظ البانر' : 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  if (!config) return null;

  const label = isRtl ? config.labelAr : config.labelEn;
  const previewUrl = `/${locale}${config.previewPath}`;

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-sm text-muted-foreground">
          {t('loading')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-3">
        <div className={cn(isRtl && 'text-right')}>
          <CardTitle className="text-lg">
            {isRtl ? 'بانر الصفحة' : 'Page banner'} — {label}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {t('pageBannerHint')}
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
        {!pageId && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            {isRtl
              ? `الصفحة "${pageSlug}" غير موجودة في النظام`
              : `Page "${pageSlug}" not found`}
          </p>
        )}

        <div className="relative aspect-[21/9] rounded-lg overflow-hidden bg-muted border">
          {image ? (
            <img
              src={resolveMediaUrl(image)}
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

        <div className="flex flex-wrap gap-2">
          <MediaSelector
            onSelect={setImage}
            triggerText={image ? t('changeBanner') : t('selectBanner')}
          />
          <Button
            onClick={save}
            disabled={!image || !pageId || saving}
          >
            <Save className={cn('w-4 h-4', isRtl ? 'ml-2' : 'mr-2')} />
            {saving
              ? isRtl
                ? 'جاري الحفظ...'
                : 'Saving...'
              : t('saveBanner')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

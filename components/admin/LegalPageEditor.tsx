'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { LegalDocument, LegalSection } from '@/data/legal';
import {
  getDefaultLegalDocument,
  LEGAL_SECTION_KEY,
  type LegalPageSlug,
} from '@/lib/legal-cms';
import Link from 'next/link';
import { useAdminPath } from '@/lib/admin-path';
import { useLocale } from 'next-intl';

type Props = {
  pageId: string;
  slug: LegalPageSlug;
  pageTitle?: { en?: string; ar?: string };
};

export function LegalPageEditor({ pageId, slug, pageTitle }: Props) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const adminPath = useAdminPath();
  const [doc, setDoc] = useState<LegalDocument>(() => getDefaultLegalDocument(slug));
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    const load = async () => {
      try {
        const sectionsRes = await apiClient.get(`/sections?pageId=${pageId}`);
        const sections = sectionsRes.data.data || [];
        const legalSection = sections.find(
          (s: any) => s.sectionKey === LEGAL_SECTION_KEY
        );

        if (legalSection) {
          setSectionId(legalSection.id);
          let raw = legalSection.customData;
          if (typeof raw === 'string') {
            try {
              raw = JSON.parse(raw);
            } catch {
              raw = null;
            }
          }
          if (raw?.sections?.length) {
            setDoc({
              slug,
              title: raw.title ?? getDefaultLegalDocument(slug).title,
              subtitle: raw.subtitle ?? getDefaultLegalDocument(slug).subtitle,
              lastUpdated:
                raw.lastUpdated ?? getDefaultLegalDocument(slug).lastUpdated,
              sections: raw.sections,
            });
          }
        }
      } catch {
        toast.error(
          isRtl ? 'تعذّر تحميل المحتوى' : 'Failed to load legal content'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pageId, slug, isRtl]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      pageId,
      sectionKey: LEGAL_SECTION_KEY,
      sectionName:
        slug === 'privacy'
          ? 'Privacy Policy Content'
          : 'Terms & Conditions Content',
      title: doc.title,
      subtitle: doc.subtitle,
      description: doc.subtitle,
      sortOrder: 1,
      isActive: true,
      customData: {
        title: doc.title,
        subtitle: doc.subtitle,
        lastUpdated: doc.lastUpdated,
        sections: doc.sections,
      },
    };

    try {
      if (sectionId) {
        await apiClient.put(`/sections/${sectionId}`, payload);
      } else {
        const res = await apiClient.post('/sections', payload);
        setSectionId(res.data.data.id);
      }
      toast.success(isRtl ? 'تم الحفظ' : 'Legal content saved');
    } catch (err: any) {
      toast.error(err.response?.data?.message || (isRtl ? 'فشل الحفظ' : 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const loadDefaults = () => {
    if (
      !confirm(
        isRtl
          ? 'استبدال المحتوى بالنص الافتراضي؟'
          : 'Replace content with default template?'
      )
    ) {
      return;
    }
    setDoc(getDefaultLegalDocument(slug));
  };

  const updateSection = (index: number, patch: Partial<LegalSection>) => {
    setDoc((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  };

  const addSection = () => {
    const id = `section-${Date.now()}`;
    setDoc((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id,
          title: { en: 'New section', ar: 'قسم جديد' },
          paragraphs: { en: [''], ar: [''] },
        },
      ],
    }));
  };

  const removeSection = (index: number) => {
    setDoc((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <p className="text-muted-foreground">
        {isRtl ? 'جاري التحميل...' : 'Loading legal content...'}
      </p>
    );
  }

  const publicPath = slug === 'privacy' ? '/privacy' : '/terms';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            {isRtl
              ? slug === 'privacy'
                ? 'سياسة الخصوصية'
                : 'الشروط والأحكام'
              : slug === 'privacy'
                ? 'Privacy Policy'
                : 'Terms & Conditions'}
          </h2>
          {pageTitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {pageTitle[locale as 'en' | 'ar'] || pageTitle.en}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={loadDefaults}>
            {isRtl ? 'تحميل النص الافتراضي' : 'Load default template'}
          </Button>
          <Button type="button" variant="outline" size="sm" asChild>
            <Link href={publicPath} target="_blank">
              {isRtl ? 'معاينة على الموقع' : 'Preview on site'}
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 me-2" />
            {saving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : isRtl ? 'حفظ' : 'Save'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {isRtl ? 'إعدادات الصفحة' : 'Page settings'}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={activeLang === 'en' ? 'default' : 'outline'}
              onClick={() => setActiveLang('en')}
            >
              EN
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeLang === 'ar' ? 'default' : 'outline'}
              onClick={() => setActiveLang('ar')}
            >
              AR
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{isRtl ? 'العنوان' : 'Title'} ({activeLang})</Label>
            <Input
              value={doc.title[activeLang]}
              onChange={(e) =>
                setDoc({
                  ...doc,
                  title: { ...doc.title, [activeLang]: e.target.value },
                })
              }
              dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
          <div className="space-y-2">
            <Label>{isRtl ? 'الوصف المختصر' : 'Subtitle'} ({activeLang})</Label>
            <Input
              value={doc.subtitle[activeLang]}
              onChange={(e) =>
                setDoc({
                  ...doc,
                  subtitle: { ...doc.subtitle, [activeLang]: e.target.value },
                })
              }
              dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
          <div className="space-y-2">
            <Label>{isRtl ? 'تاريخ آخر تحديث' : 'Last updated'} ({activeLang})</Label>
            <Input
              value={doc.lastUpdated[activeLang]}
              onChange={(e) =>
                setDoc({
                  ...doc,
                  lastUpdated: { ...doc.lastUpdated, [activeLang]: e.target.value },
                })
              }
              dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {isRtl ? 'أقسام المحتوى' : 'Content sections'} ({doc.sections.length})
        </h3>
        <Button type="button" variant="outline" size="sm" onClick={addSection}>
          <Plus className="w-4 h-4 me-2" />
          {isRtl ? 'إضافة قسم' : 'Add section'}
        </Button>
      </div>

      <div className="space-y-4">
        {doc.sections.map((section, index) => (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">
                {isRtl ? `قسم ${index + 1}` : `Section ${index + 1}`}
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeSection(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>{isRtl ? 'عنوان القسم' : 'Section title'} ({activeLang})</Label>
                <Input
                  value={section.title[activeLang]}
                  onChange={(e) =>
                    updateSection(index, {
                      title: { ...section.title, [activeLang]: e.target.value },
                    })
                  }
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  {isRtl ? 'الفقرات (سطر لكل فقرة)' : 'Paragraphs (one per line)'} (
                  {activeLang})
                </Label>
                <Textarea
                  rows={6}
                  value={section.paragraphs[activeLang].join('\n')}
                  onChange={(e) =>
                    updateSection(index, {
                      paragraphs: {
                        ...section.paragraphs,
                        [activeLang]: e.target.value.split('\n'),
                      },
                    })
                  }
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="space-y-2">
                <Label>
                  {isRtl ? 'نقاط (اختياري، سطر لكل نقطة)' : 'Bullets (optional, one per line)'} (
                  {activeLang})
                </Label>
                <Textarea
                  rows={4}
                  value={(section.bullets?.[activeLang] || []).join('\n')}
                  onChange={(e) =>
                    updateSection(index, {
                      bullets: {
                        en: section.bullets?.en || [],
                        ar: section.bullets?.ar || [],
                        [activeLang]: e.target.value
                          .split('\n')
                          .filter(Boolean),
                      },
                    })
                  }
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button variant="outline" asChild>
          <Link href={adminPath('/admin/pages')}>
            {isRtl ? 'رجوع للصفحات' : 'Back to pages'}
          </Link>
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 me-2" />
          {isRtl ? 'حفظ المحتوى' : 'Save content'}
        </Button>
      </div>
    </div>
  );
}

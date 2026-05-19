'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Building2, ExternalLink, FileText } from 'lucide-react';
import { MediaSelector } from '@/components/admin/MediaSelector';
import {
  prepareCompaniesForEditor,
  slugifyCompanyName,
  companyPagePath,
  MAX_RELATED_COMPANIES,
  type RelatedCompanyRecord,
} from '@/lib/related-companies';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAdminPath } from '@/lib/admin-path';
import { useLocale } from 'next-intl';

type Props = {
  companies: RelatedCompanyRecord[];
  onChange: (companies: RelatedCompanyRecord[]) => void;
  activeLang: 'en' | 'ar';
  isRtl?: boolean;
  pages?: Array<{ id: string; slug: string }>;
};

export function RelatedCompaniesEditor({
  companies,
  onChange,
  activeLang,
  isRtl = false,
  pages = [],
}: Props) {
  const adminPath = useAdminPath();
  const locale = useLocale();
  const list = prepareCompaniesForEditor(companies);

  const updateList = (next: RelatedCompanyRecord[]) => {
    onChange(next);
  };

  const update = (id: string, field: string, value: string, lang?: 'en' | 'ar') => {
    updateList(
      list.map((c) => {
        if (c.id !== id) return c;
        if (lang && field === 'name') {
          const name = { ...c.name, [lang]: value };
          const autoSlug =
            !c.pageSlug?.trim() && value.trim()
              ? slugifyCompanyName(value)
              : c.pageSlug;
          return { ...c, name, pageSlug: autoSlug };
        }
        if (field === 'sortOrder') {
          return { ...c, sortOrder: parseInt(value, 10) || 0 };
        }
        return { ...c, [field]: value };
      })
    );
  };

  const add = () => {
    if (list.length >= MAX_RELATED_COMPANIES) return;
    updateList([
      ...list,
      {
        id: `company-${Date.now()}`,
        name: { en: '', ar: '' },
        logo: '',
        pageSlug: '',
        sortOrder: list.length,
      },
    ]);
  };

  const remove = (id: string) => {
    updateList(list.filter((c) => c.id !== id));
  };

  return (
    <Card dir={isRtl ? 'rtl' : 'ltr'}>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          {isRtl ? 'شركات ذات صلة' : 'Related companies'}
        </CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={add}
          disabled={list.length >= MAX_RELATED_COMPANIES}
        >
          <Plus className={cn('w-4 h-4', isRtl ? 'ml-2' : 'mr-2')} />
          {isRtl ? 'إضافة شركة' : 'Add company'} ({list.length}/{MAX_RELATED_COMPANIES})
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className={cn('text-xs text-muted-foreground', isRtl && 'text-right')}>
          {isRtl
            ? 'اضغط «إضافة شركة» ثم اكتب الاسم وارفع الصورة. بعدها «حفظ وربط الصفحات».'
            : 'Click Add company, fill name and upload image, then Save & link pages.'}
        </p>

        {list.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg space-y-3">
            <p>{isRtl ? 'لا توجد شركات بعد.' : 'No companies yet.'}</p>
            <Button type="button" variant="secondary" size="sm" onClick={add}>
              <Plus className={cn('w-4 h-4', isRtl ? 'ml-2' : 'mr-2')} />
              {isRtl ? 'إضافة أول شركة' : 'Add first company'}
            </Button>
          </div>
        ) : (
          list.map((company, index) => {
            const page = pages.find((p) => p.slug === company.pageSlug);
            return (
              <div
                key={company.id}
                className="p-4 border rounded-lg bg-card space-y-4 relative group"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 end-2 text-destructive opacity-70 hover:opacity-100"
                  onClick={() => remove(company.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <p className={cn('font-semibold text-sm border-b pb-2', isRtl && 'text-right')}>
                  {isRtl ? `شركة #${index + 1}` : `Company #${index + 1}`}
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">
                      {isRtl ? 'اسم الشركة' : 'Company name'} ({activeLang.toUpperCase()})
                    </Label>
                    <Input
                      value={company.name[activeLang]}
                      onChange={(e) => update(company.id, 'name', e.target.value, activeLang)}
                      dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                      placeholder={isRtl ? 'مثال: سكاي ناين' : 'e.g. Sky Nine'}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{isRtl ? 'ترتيب العرض' : 'Sort order'}</Label>
                    <Input
                      type="number"
                      value={company.sortOrder}
                      onChange={(e) => update(company.id, 'sortOrder', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">{isRtl ? 'رابط الصفحة (Slug)' : 'Page slug'}</Label>
                  <Input
                    value={company.pageSlug}
                    onChange={(e) =>
                      update(company.id, 'pageSlug', e.target.value.replace(/^\//, ''))
                    }
                    placeholder="sky-nine"
                    dir="ltr"
                    className="font-mono text-sm"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {company.pageSlug && (
                      <Link
                        href={`/${locale}${companyPagePath(company.pageSlug)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {isRtl ? 'معاينة الصفحة' : 'Preview page'}
                      </Link>
                    )}
                    {page && (
                      <Link
                        href={adminPath(`/admin/pages/${page.id}/edit`)}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <FileText className="w-3 h-3" />
                        {isRtl ? 'تعديل صفحة الشركة' : 'Edit company page'}
                      </Link>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">{isRtl ? 'صورة / لوجو الشركة' : 'Company image / logo'}</Label>
                  <div className="flex gap-3 items-center flex-wrap">
                    {company.logo && (
                      <div className="h-20 w-32 rounded-lg border overflow-hidden bg-muted">
                        <img
                          src={company.logo}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <MediaSelector
                      onSelect={(url) => update(company.id, 'logo', url)}
                      triggerText={
                        company.logo
                          ? isRtl
                            ? 'تغيير الصورة'
                            : 'Change image'
                          : isRtl
                            ? 'رفع صورة'
                            : 'Upload image'
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
